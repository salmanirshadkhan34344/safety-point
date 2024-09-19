import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { join } from 'path';
import { Chat } from 'src/libs/database/entities/chat.entity';
import { InboxActive } from 'src/libs/database/entities/inbox-active';
import { Helper } from 'src/libs/helper/helper.global';
import { SafetyPointGateway } from 'src/socket/safetypoint.gateway';
import { v4 as uuid } from 'uuid';
import { FcmHelper } from '../notifications/notification.fcm';
import { ClearChatDto, DeleteMessageDto, FlagMessageDto, OnlineDto, SeenMessageDto, SentMessageDto } from './dto/create-chat.dto';
const ffmpeg = require('fluent-ffmpeg');

@Injectable()
export class ChatService {

  constructor(
    private readonly safetyPointGateway: SafetyPointGateway,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async sendMessage (sentMessageDto: SentMessageDto, req, files?) {
    let conId: any = await Helper.conversationId({ senderId: req.user.id, receiverId: sentMessageDto.receiver_id })
    let allFiles = [];
    if (files?.media) {
      files?.media.forEach((val) => {
        let splitUrl = val?.mimetype.split('/');
        if (splitUrl[0] == 'video') {

          allFiles.push({
            file_id: uuid(),
            file_type: splitUrl[0],
            filename: 'message/' + val.filename,
            thumbnail: this.createVideoThumbnail(val),
          });
          console.log(allFiles)
        }
        if (splitUrl[0] != 'video') {
          allFiles.push({
            file_id: uuid(),
            file_type: splitUrl[0],
            filename: 'message/' + val.filename,
          });
        }
      });
    }

    let message: any;
    message = new Chat();
    message.receiver_id = sentMessageDto.receiver_id;
    message.sender_id = req.user.id;
    message.message = sentMessageDto.message;
    message.conversation_id = conId;

    if (sentMessageDto.parent_id) {
      message.parent_id = sentMessageDto.parent_id;
    }
    message.media = allFiles.length > 0 ? JSON.stringify(allFiles) : null;
    message = await Chat.query().insertAndFetch(message)
      .withGraphFetched('parent.sender')
      .withGraphFetched('parent.receiver')

      .withGraphFetched('receiver')
      .withGraphFetched('sender');

    await Helper.userInboxActive({ conversationId: conId, senderId: req.user.id, receiverId: sentMessageDto.receiver_id })
    await this.safetyPointGateway.receivedMessage({ receiverId: sentMessageDto.receiver_id, conversationId: conId, data: message });
    await this.safetyPointGateway.newMessage({ receiverId: sentMessageDto.receiver_id, data: message });
    this.eventEmitter.emit('message-notification', message);
    return message;
  }


  @OnEvent('message-notification', { async: true })
  async insertSingleNotificationEvent (chatObj) {
    try {

      await new Promise<void>(async (resolve) => {
        setTimeout(async () => {
          let message: any = await Chat.query()
            .withGraphFetched('receiver')
            .withGraphFetched('sender')
            .withGraphFetched('parent.sender')
            .withGraphFetched('parent.receiver')
            .where({ id: chatObj.id })
            .first();
          if (message.is_seen == 0) {
            let deviceToken: any = await Helper.deviceTokenByUsers(chatObj.receiver_id);
            if (deviceToken) {
              let title = `New message`;
              let body = message.file_type == "message" ? message?.msg : `${message?.sender?.first_name} ${message?.sender?.last_name} ${message?.file_type == "image" ? "sends you an image" : "sends you a video"}`;
              message.notification_for = "message"
              message.type='chat'
              message.related_type='chat'

              await FcmHelper.sendSingleMessageNotification({
                deviceToken,
                notification: message,
                title: title,
                body: body
              });
        
            }
          }
          resolve();
        }, 3000);
      });
    } catch (error) {
      console.log(error)
    }
  }


  async IsOnline (dto: OnlineDto) {
    if (dto.bool == 1) {
      await this.safetyPointGateway.isOnline({ user_id: dto.user_id });
    }
    else {
      await this.safetyPointGateway.Offline({ user_id: dto.user_id });
    }

  }

  async seenMessage (seenMessageDto: SeenMessageDto, req) {

    let seenMessage: any = await Chat.query().where({
      id: seenMessageDto.message_id,
    }).first();
    if (!seenMessage) {
      throw new HttpException('message not seen', HttpStatus.BAD_REQUEST);
    }
    if (seenMessage.receiver_id == req.user.id) {
      let result: any = await Chat.query().updateAndFetchById(seenMessage.id, { is_seen: true });
      await this.safetyPointGateway.seenMessage({
        senderId: seenMessage.sender_id,
        messageId: seenMessageDto.message_id,
      });
      return result
    }
    throw new HttpException('message not found', HttpStatus.BAD_REQUEST);
  }

  async getInboxes (data: any = {}) {

    let result = {} as any;
    let chatQuery = {} as any;
    chatQuery = InboxActive.query();
    chatQuery.where('user_id', data.req.user.id);
    chatQuery.withGraphFetched('user.is_blocked_by_me')
    chatQuery.modifyGraph('user.is_blocked_by_me', (builder) => {
      builder.where('block_to', data.req.user.id)
    });
    chatQuery.withGraphFetched('user.is_mi_blocked_by_him')
    chatQuery.modifyGraph('user.is_mi_blocked_by_him', (builder) => {
      builder.where('block_by', data.req.user.id)
    });
    chatQuery.withGraphFetched('last_message');
    chatQuery.modifyGraph('last_message', (builder) => {
      builder.where('delete_by', '!=', data.req.user.id);
    })
    chatQuery.orderBy('updated_at', 'desc');
    result = await InboxActive.pagination(chatQuery, data);
    return result
  }

  createVideoThumbnail (val) {
    const name = val.originalname.split('.')[0];
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    ffmpeg({
      source: join(__dirname, '../../', 'public/') + 'message/' + val.filename,
    }).thumbnail(
      {
        count: 1,
        filename: randomName + name + '.png',
        timemarks: [1],
        size: '320x320',
      },
      join(__dirname, '../../', 'public/') + 'message',
    );
    return 'message/' + randomName + name + '.png';
  }

  async deleteMessage (deleteMessageDto: DeleteMessageDto, req) {
    let chat: any = await Chat.query().where({ id: deleteMessageDto.message_id }).first();
    if (!chat) {
      throw new HttpException('message not found', HttpStatus.BAD_REQUEST);
    }
    if (chat.delete_by == 0) {
      await Chat.query().updateAndFetchById(chat.id, { delete_by: req.user.id });
      return true
    }
    await Chat.query().where({ id: chat.id }).delete();
    return true;
  }

  async deleteForEveryOne (deleteMessageDto: DeleteMessageDto, req) {
    let chat: any = await Chat.query().where({ id: deleteMessageDto.message_id }).first();
    if (!chat) {
      throw new HttpException('message not found', HttpStatus.BAD_REQUEST);
    }
    if (chat.sender_id != req.user.id) {
      throw new HttpException('only can sender delete for everyone', HttpStatus.BAD_REQUEST);
    }
    let item: any = await Chat.query().updateAndFetchById(chat.id, { delete_for_everyone: true });

    let result: any = await Chat.query().where({ id: deleteMessageDto.message_id })
      .withGraphFetched('sender')
      .withGraphFetched('receiver')
      .first();

    await this.safetyPointGateway.deleteForEveryOne({ conversationId: chat.conversation_id, data: result })
    return true
  }

  async clearChat (clearChatDto: ClearChatDto, req) {
    let result: any = await Chat.query().where({ 'conversation_id': clearChatDto.conversation_id })
    for (const item of result) {
      if (item.delete_by == 0) {
        await Chat.query().updateAndFetchById(item.id, { delete_by: req.user.id });
      }
      if (item.delete_by != 0) {
        if (item.delete_by != req.user.id) {
          await Chat.query().where({ id: item.id }).delete();
        }
      }
    }
    return true;
  }

  async inboxDelete (clearChatDto: ClearChatDto, req) {
    let result: any = await Chat.query().where({ 'conversation_id': clearChatDto.conversation_id })
    for (const item of result) {
      if (item.delete_by == 0) {
        await Chat.query().updateAndFetchById(item.id, { delete_by: req.user.id });
      }
      if (item.delete_by != 0) {
        if (item.delete_by != req.user.id) {
          await Chat.query().where({ id: item.id }).delete();
        }
      }
    }
    await InboxActive.query().where({
      conversation_id: clearChatDto.conversation_id,
      user_id: req.user.id
    }).delete()

    return true;
  }


  async userWishChat (data: any = {}) {

    let unSeenMessage: any = await Chat.query().where({
      receiver_id: data.req.user.id,
      is_seen: false

    })

    if (unSeenMessage.length > 0) {
      for (const iterator of unSeenMessage) {
        await Chat.query().updateAndFetchById(iterator.id, { is_seen: true });
        await this.safetyPointGateway.seenMessage({ senderId: iterator.sender_id, messageId: iterator.id });
      }
    }

    let result = {} as any;
    let chatQuery = {} as any;
    chatQuery = Chat.query();
    chatQuery.where('delete_by', '!=', data.req.user.id)
    chatQuery.where((q) => {
      q.where({ 'receiver_id': data.req.user.id, 'sender_id': data.userWishChatDto.user_id })
      q.orWhere({ 'sender_id': data.req.user.id, 'receiver_id': data.userWishChatDto.user_id })
    });

    // block start 
    chatQuery.withGraphFetched('parent.sender');
    chatQuery.withGraphFetched('parent.receiver');

    chatQuery.withGraphFetched('sender.is_blocked_by_me')
    chatQuery.modifyGraph('sender.is_blocked_by_me', (builder) => {
      builder.where('block_to', data.req.user.id)
    });
    chatQuery.withGraphFetched('sender.is_mi_blocked_by_him')
    chatQuery.modifyGraph('sender.is_mi_blocked_by_him', (builder) => {
      builder.where('block_by', data.req.user.id)
    });
    chatQuery.withGraphFetched('receiver.is_blocked_by_me')
    chatQuery.modifyGraph('receiver.is_blocked_by_me', (builder) => {
      builder.where('block_to', data.req.user.id)
    });
    chatQuery.withGraphFetched('receiver.is_mi_blocked_by_him')
    chatQuery.modifyGraph('receiver.is_mi_blocked_by_him', (builder) => {
      builder.where('block_by', data.req.user.id)
    });
    // block end 

    chatQuery.orderBy('id', 'desc');
    result = await Chat.pagination(chatQuery, data);
    return result;
  }


  async flagMessage (dto: FlagMessageDto, req) {
    let seenMessage: any = await Chat.query().findById(dto.message_id)
    let result: any = await Chat.query().updateAndFetchById(seenMessage.id, { is_flag: 1 });
    await this.safetyPointGateway.flagMessage({
      senderId: seenMessage.sender_id,
      messageId: dto.message_id,
    });
    return result
  }

}