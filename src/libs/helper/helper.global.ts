import { HttpException, HttpStatus } from "@nestjs/common";
import * as moment from 'moment';
import { raw } from "objection";
import { join } from "path";
import { CommentTypeEnum, LikeTypeEnum, ReportedTypeEnum } from "../../enum/global.enum";
import { BlockUser } from "../database/entities/block-user.entity";
import { Chat } from "../database/entities/chat.entity";
import { Comments } from "../database/entities/comments.entity";
import { Friends } from "../database/entities/friends.entity";
import { InboxActive } from "../database/entities/inbox-active";
import { Likes } from "../database/entities/likes.entity";
import { NotificationReceiver } from "../database/entities/notification-receiver.entity";
import { Reporting } from "../database/entities/reporting.entity";
import { Users } from "../database/entities/user.entity";



const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
export class Helper {
  static async changeUserStatus(userId, status) {
    if (userId) {
      await Users.query().updateAndFetchById(userId, { user_status: status })
      let user: any = await Users.query().where({ id: userId }).first();
      return user ? user : null;
    }
    return null;
  }

  static async userUnreadNotificationCount(userId) {
    let isExist: any = await NotificationReceiver.query()
      .count('id as count')
      .where({ receiver_id: userId, is_seen: false })
      .first();
    return isExist ? isExist.count : 0;
  }

  static async generateOtp() {
    return Math.floor(1000 + Math.random() * 9000);

  }
  static async getAllUsers(data) {
    console.log(data)
    let blockUserIds: any = await this.isBlocked({ userId: data.user_id })
    let query = Users.query();
    query.where({ is_deleted: 0 })
    query.whereNotIn('id', blockUserIds)
    query.select('id', raw(`( 6367 * ACOS( COS(RADIANS(${data.latitude ?? null})) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(${data.longitude ?? null})) + SIN(RADIANS(${data.latitude ?? null})) * SIN(RADIANS(latitude)) ) ) AS distance`));
    query.having('distance', '<=', 500);
    let records = await Users.findAllCustom(query);
    let ids: any = records.map(item => item.id);
    return ids.length > 0 ? ids : [];

  }

  static async getAllReports(data) {

    let blockUserIds = await this.isBlocked({ userId: data.user_id })
    let friendIds = await this.getFriendIds({ userId: data.user_id })


    let query: any;
    query = Reporting.query();
    query.whereNotExists(Reporting.relatedQuery('reported_report').where({ user_id: data.user_id, type: ReportedTypeEnum.Reporting }));

    query.select('*', raw(`( 6367 * ACOS( COS(RADIANS(${data.latitude ?? null})) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(${data.longitude ?? null})) + SIN(RADIANS(${data.latitude ?? null})) * SIN(RADIANS(latitude)) ) ) AS distance`))
    query.having('distance', '<=', 5)

    query.where(function () {
      this.where('is_public', '=', 1).whereNotIn('user_id', blockUserIds)
      this.orWhere(function () {
        this.where('is_public', '=', 0).where({ 'user_id': data.user_id });
        this.orWhere('is_public', '=', 0).whereIn('user_id', friendIds);
      });
    });

    query.withGraphFetched('parent.user')
    query.withGraphFetched('user')
    query.withGraphFetched('share_count')
    query.withGraphFetched('comments_count')
    query.withGraphFetched('likes_count')
    query.withGraphFetched('is_like').modifyGraph('is_like', (builder) => {
      builder.where('user_id', data.user_id);
    });

    const result = await Reporting.findAllCustom(query);
    const reportCount = result.length
    const incidentCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0
    };

    result.forEach(report => {
      const incidentType = report.incident_id;
      if (incidentType && incidentCounts.hasOwnProperty(incidentType)) {
        incidentCounts[incidentType]++;
      }
    });
    return { result, reportCount, incidentCounts };

  }

  static uploadFile(req, file, callback, validation: any) {
    var pregmax = new RegExp(`\\.(${validation[file.fieldname]})$`);
    if (!file.originalname.match(pregmax)) {
      return callback(
        new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: [`only allow ${validation[file.fieldname]}`],
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
    callback(null, true);
  }

  static async conversationId({ receiverId, senderId }) {
    let conId: any;
    let item: any = await Chat.query()
      .where({
        receiver_id: receiverId,
        sender_id: senderId,
      })
      .orWhere({
        sender_id: receiverId,
        receiver_id: senderId,
      })
      .first();
    if (item) {
      conId = item.conversation_id;
      return conId
    }
    if (!item) {
      conId = `${senderId}-${receiverId}`;
      return conId
    }
  }


  static async likeCount({ reportId, authId }) {
    let obj: any = {}
    let like: any = await Likes.query().where({ user_id: authId, likeableId: reportId, likeableType: LikeTypeEnum.Reporting }).count('id as count').first()
    let likeCount: any = await Likes.query().where({ likeableId: reportId, likeableType: LikeTypeEnum.Reporting }).count('id as count').first()
    obj.likes_count = likeCount.count;
    obj.is_like = like;
    return obj
  }

  static async commentLikeCount({ commentId, authId }) {
    let obj: any = {}
    let like: any = await Likes.query().where({ user_id: authId, likeableId: commentId, likeableType: LikeTypeEnum.Comment }).count('id as count').first()
    let likeCount: any = await Likes.query().where({ likeableId: commentId, likeableType: LikeTypeEnum.Comment }).count('id as count').first()
    obj.comments_like_count = likeCount.count;
    obj.is_comment_like = like;
    return obj
  }




  static async conversationIdCount(conversationId) {
    let item: any = await Chat.query()
      .where({ conversation_id: conversationId })
      .count("id as conversation_id_count")
      .first();
    return item ? item.conversation_id_count : 0;
  }

  static async userInboxActive({ receiverId, senderId, conversationId }) {
    let objSender: any = { conversation_id: conversationId, user_id: senderId, addresser_id: receiverId }
    let objReceiver: any = { conversation_id: conversationId, user_id: receiverId, addresser_id: senderId }

    let senderInbox: any = await InboxActive.query().where(objSender).first()
    let receiverInbox: any = await InboxActive.query().where(objReceiver).first()

    if (senderInbox) {
      await InboxActive.query().updateAndFetchById(senderInbox.id, { updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') })
    }
    if (receiverInbox) {
      await InboxActive.query().updateAndFetchById(receiverInbox.id, { updated_at: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') })
    }

    if (!senderInbox) {
      await InboxActive.query().insertAndFetch(objSender)
    }
    if (!receiverInbox) {
      await InboxActive.query().insertAndFetch(objReceiver)
    }
  }

  static async getFriendIds({ userId }) {
    let userIds: any = []
    let users: any = await Friends.query()
      .where({ status: 'accept', sender_id: userId })
      .orWhere({ status: 'accept', receiver_id: userId })
    users.reduce((acc, curr) => {
      let uId = curr.sender_id == userId ? curr.receiver_id : curr.sender_id
      userIds.push(uId)
      return acc;
    }, []);


    return userIds?.length > 0 ? userIds : []

  }
  static async getRequestedIds({ userId }) {
    let userIds: any = []
    let users: any = await Friends.query()
      .where({ status: 'requested', sender_id: userId })
      .orWhere({ status: 'requested', receiver_id: userId })


    users.reduce((acc, curr) => {
      let uId = curr.sender_id == userId ? curr.receiver_id : curr.sender_id
      userIds.push(uId)
      return acc;
    }, []);


    return userIds?.length > 0 ? userIds : []

  }

  static async deviceTokenByUsers(userId) {
    let users: any = await Users.query().where('id', userId).first();
    return users.device_token ? users.device_token : null
  }

  static async multipleDeviceTokenByUsers({ ids }) {
    let users: any = await Users.query().where({ is_deleted: 0 }).whereIn('id', ids);
    let userIdsArray: any[] = users.map((user: any) => user.device_token).filter((deviceToken: any) => deviceToken !== null);
    return userIdsArray
  }

  static async isFriend({ friendId, userId }) {
    let isExist: any = await Friends.query()
      .where({
        sender_id: friendId,
        receiver_id: userId,
      })
      .orWhere({
        sender_id: userId,
        receiver_id: friendId,
      })
      .first();

    // console.log('this is all the users requested or -'isExist);
    if (isExist) {
      isExist.is_sender = isExist.sender_id == userId ? true : false;
    }
    return isExist ? isExist : null;
  }

  static async friendCount(userId) {
    let isExist: any = await Friends.query()
      .count('id as count')
      .where({ receiver_id: userId, status: 'accept' })
      .orWhere({ sender_id: userId, status: 'accept' })
      .first();
    return isExist ? isExist.count : 0;
  }

  static async isBlocked({ userId }) {

    let userIds: any = []
    let users: any = await BlockUser.query()
      .where({ block_by: userId })
      .orWhere({ block_to: userId })
    users.reduce((acc, curr) => {
      let uId = curr.block_to == userId ? curr.block_by : curr.block_to
      userIds.push(uId)
      return acc;
    }, []);
    return userIds?.length > 0 ? userIds : []

  }

  static async deletedUserIds() {
    let userIds: any = []
    let users: any = await Users.query().where({ role: 'user', is_deleted: 1 })
    users.reduce((acc, curr) => {
      userIds.push(curr.id)
      return acc;
    }, []);
    return userIds?.length > 0 ? userIds : []

  }



  static async postCommentCount({ reportId }) {
    let isExist: any = await Comments.query()
      .count('id as count')
      .where({
        commentableId: reportId,
        commentableType: CommentTypeEnum.Reporting
      })
      .first();

    return isExist ? isExist.count : 0;
  }


  static async reportCommentedUserIds({ reportId, userId, commentFor }) {
    let post: any = await Reporting.query().where({ id: reportId }).first()
    let commentUsers: any = await Comments.query().select('user_id')
      .where({ commentableId: reportId, commentableType: commentFor })
      .groupBy('commentableId', 'user_id', 'commentableType');
    var commentedUserIds: any = [];
    if (commentUsers?.length > 0) {
      commentUsers.reduce((acc, current) => {
        https://portal.gologonow.org/index.php/tickets
        commentedUserIds.push(current.user_id)
      }, []);
    }
    const x = commentedUserIds.includes(post?.user_id);
    if (!x) {
      commentedUserIds.push(post?.user_id)
    }
    commentedUserIds = commentedUserIds.filter(x => x != userId);
    return commentedUserIds
  }

  static createVideoThumbnail({ val, path }) {
    const name = val.originalname.split('.')[0];
    const randomName = Array(4).fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    ffmpeg({
      source: join(__dirname, '../../../', 'public/') + path + '/' + val.filename,
    }).thumbnail(
      {
        count: 1,
        filename: randomName + name + '.png',
        timemarks: [1],
        size: '320x320',
      },
      join(__dirname, '../../../', 'public/') + path,
    );
    return path + '/' + randomName + name + '.png';
  }
}

