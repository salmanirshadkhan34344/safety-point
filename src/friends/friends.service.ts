import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BlockUser } from 'src/libs/database/entities/block-user.entity';
import { Friends } from 'src/libs/database/entities/friends.entity';
import { NotificationReceiver } from 'src/libs/database/entities/notification-receiver.entity';
import { Notifications } from 'src/libs/database/entities/notification.entity';
import { Users } from 'src/libs/database/entities/user.entity';
import { Helper } from 'src/libs/helper/helper.global';
import { SafetyPointGateway } from 'src/socket/safetypoint.gateway';
import { NotificationFunction } from '../notifications/notification-functions';
import { AcceptRejectRequestDto, BlockUserDto, CancelRequestDto, CreateFriendDto, UnfriendFriendDto } from './dto/create-friend.dto';
@Injectable()
export class FriendsService {
  constructor(
    private readonly notifications: NotificationFunction,
    private readonly safetyPointGateway: SafetyPointGateway
  ) { }

  async addFriend(dto: CreateFriendDto, req) {

    let data: any = await Friends.query()
      .where({ receiver_id: dto.user_id, sender_id: req.user.id })
      .orWhere({ receiver_id: req.user.id, sender_id: dto.user_id })
      .first();

    if (data) {
      if (data.status == 'requested') {
        throw new HttpException('already requested', HttpStatus.UNPROCESSABLE_ENTITY);
      }
      if (data.status == 'accept') {
        throw new HttpException('already friend', HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }
    let friend: any;
    friend = new Friends();
    friend.receiver_id = dto.user_id;
    friend.sender_id = req.user.id;
    friend.status = 'requested';
    friend = await Friends.query().insertAndFetch(friend)
    this.notifications.addFriendNotify({ senderId: req.user.id, item: friend, receiverId: dto.user_id, notificationTitle: 'friend' })
    return friend;

  }

  async friendCount(req) {
    let data = await Helper.friendCount(req.user.id)
    return { count: data };
  }

  async acceptRejectRequest(dto: AcceptRejectRequestDto, req) {

    let request: any = await Friends.query().findById(dto.friend_id)

    if (!request) {
      throw new HttpException('Request not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (request.status == 'accept') {
      throw new HttpException('Already friend', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (dto.status == 'accept') {
      let result: any = await Friends.query().updateAndFetchById(request.id, {
        status: dto.status
      });
      await this.safetyPointGateway.reportsReGet({ userId: result.receiver_id })
      await this.safetyPointGateway.reportsReGet({ userId: result.sender_id })
      await this.notifications.acceptFriendRequest({
        senderId: req.user.id,
        item: request,
        receiverId: result.sender_id,
      })
      return result;
    }

    if (dto.status == 'reject') {
      return await Friends.query().deleteById(request.id)
    }

  }

  async unFriend(createFriendDto: UnfriendFriendDto, req) {
    let item: any = await Friends.query().findById(createFriendDto.friend_id)
    if (!item) {
      throw new HttpException('friend not fount', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    await Friends.query().deleteById(item.id)
    await this.safetyPointGateway.unFriend({ data: item })
    await this.safetyPointGateway.reportsReGet({ userId: item.receiver_id })
    await this.safetyPointGateway.reportsReGet({ userId: item.sender_id })
    return true;
  }

  async myFriends(params: any = {}) {

    let friendIds: any = await Helper.getFriendIds({ userId: params.req.user.id })
    let deletedUserIds: any = await Helper.deletedUserIds()

    let query: any = Users.query();
    query.whereIn('id', friendIds);
    query.whereNotIn('id', deletedUserIds);
    query.where({ role: 'user', is_deleted: 0 })
    let result: any = await Users.pagination(query, params);
    for (const item of result.results) {
      item.is_friend = await Helper.isFriend({ friendId: item.id, userId: params.req.user.id })
      item.friend_count = await Helper.friendCount(item.id)
    }

    return result
  }

  async blockUser(BlockUserDto: BlockUserDto, req) {
    let user: any = await Users.query().where('role', 'user').where({ id: BlockUserDto.user_id, is_deleted: 0 }).first();
    if (!user) {
      throw new HttpException('the user you want to block not fount', HttpStatus.UNPROCESSABLE_ENTITY,);
    }
    let blockUser: any = await BlockUser.query().where({ block_by: req.user.id, block_to: BlockUserDto.user_id }).first();
    if (blockUser) {
      await BlockUser.query().where({ id: blockUser.id }).delete();
      user.message = 'the user is unblocked';
      return user;
    }

    let friendItem: any = await Friends.query()
      .where({ sender_id: req.user.id, receiver_id: BlockUserDto.user_id })
      .orWhere({ receiver_id: req.user.id, sender_id: BlockUserDto.user_id })
      .first();

    let resultAuth: any = await Notifications.query()
      .where({ sender_id: req.user.id })
      .withGraphFetched('received_notification')
      .whereExists(Notifications.relatedQuery('received_notification').where('receiver_id', BlockUserDto.user_id));
    if (resultAuth?.length > 0)
      for (const iterator of resultAuth) {
        if (iterator.received_notification) {
          await NotificationReceiver.query().where({ id: iterator?.received_notification?.id }).delete();
        }
      }

      let resultOther: any = await Notifications.query()
      .where({ sender_id: BlockUserDto.user_id })
      .withGraphFetched('received_notification')
      .whereExists(Notifications.relatedQuery('received_notification').where('receiver_id', req.user.id));
    if (resultOther?.length > 0)
      for (const iterator of resultOther) {
        if (iterator.received_notification) {
          await NotificationReceiver.query().where({ id: iterator?.received_notification?.id }).delete();
        }
      }



    if (friendItem) {
      await Friends.query().where({ id: friendItem.id }).delete();
    }
    await BlockUser.query().insertAndFetch({ block_by: req.user.id, block_to: BlockUserDto.user_id });
    user.message = 'user block';
    await this.safetyPointGateway.userBlock({ authId: req.user.id, blockTo: BlockUserDto.user_id })
    return user;
  }


  async cancelRequest(cancelRequestDto: CancelRequestDto, req) {
    let requestItem: any = await Friends.query().where({ id: cancelRequestDto.is_friend_id }).first();
    if (!requestItem) {
      throw new HttpException('request not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (requestItem.status === 'accept') {
      throw new HttpException('already accepted request', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (requestItem.receiver_id == cancelRequestDto.user_id && requestItem.sender_id == req.user.id) {
      await Friends.query().where({ id: requestItem.id }).delete();
      let user: any = await Users.query().where({ 'role': 'user' }).where({ id: cancelRequestDto.user_id }).first();
      let user2: any = await Users.query().where({ 'role': 'user' }).where({ id: req.user.id }).first();
      await this.safetyPointGateway.cancelRequest({ receiverId: requestItem.receiver_id, data: user2, senderId: req.user.id })
      return user;
    }

    if (requestItem.receiver_id != cancelRequestDto.user_id) {
      throw new HttpException('receiver not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (requestItem.sender_id != req.user.id) {
      throw new HttpException('sender not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    throw new HttpException('request not found', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  async myReceivedRequest(params: any = {}) {

    let queryFriend: any = Friends.query();
    queryFriend.where({ receiver_id: params.req.user.id, status: 'requested' });
    queryFriend.orderBy('id', 'desc');
    var myFriends = await Friends.pagination(queryFriend, params);

    for (const query of myFriends.results) {
      query.user = await Users.query().findById(query.sender_id)

    }
    return myFriends;

  }

  async mySentRequest(params: any = {}) {
    let queryFriend: any = Friends.query();
    queryFriend.where((qe) => {
      qe.where({ sender_id: params.req.user.id, status: 'requested' });
    });
    queryFriend.orderBy('id', 'desc');
    var myFriends = await Friends.pagination(queryFriend, params);
    for (const query of myFriends.results) {
      query.user = await Users.query().findById(query.receiver_id)
    }
    return myFriends;
  }

}

