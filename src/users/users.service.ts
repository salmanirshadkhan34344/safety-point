import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { raw } from 'objection';
import { BlockUser } from 'src/libs/database/entities/block-user.entity';
import { NotificationReceiver } from 'src/libs/database/entities/notification-receiver.entity';
import { Notifications } from 'src/libs/database/entities/notification.entity';
import { UserAddresses } from 'src/libs/database/entities/user-addresses.entity';
import { EmailHelper } from 'src/libs/helper/email-sender';
import { Helper } from 'src/libs/helper/helper.global';
import { ReportedTypeEnum } from '../enum/global.enum';
import { Comments } from '../libs/database/entities/comments.entity';
import { Friends } from '../libs/database/entities/friends.entity';
import { Likes } from '../libs/database/entities/likes.entity';
import { Reported } from '../libs/database/entities/reported.entity';
import { Reporting } from '../libs/database/entities/reporting.entity';
import { Users } from '../libs/database/entities/user.entity';
import { SearchTypeEnum } from '../libs/enum/global.enum';
import { jwtConstants } from '../libs/guard/constants';
import { ChangePasswordDto, DeleteAccountDto, DeleteLocationDto, GetUserByIdDto, GlobalSearchDto, OtpDto, SignUpDto, UpdateProfileDto, savedLocationDto } from './dto/users.dto';


@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2

  ) { }

  async signUp(dto: SignUpDto) {
    try {

      let findOne: any = await Users.query().where({ is_deleted: 0, email: dto.email }).first();
      if (findOne) { throw new HttpException(`${dto.email} already exists. Choose another.`, HttpStatus.BAD_REQUEST); }


      let generateOtp = await Helper.generateOtp()
      const passwordHash = await bcrypt.hash(dto.password, 10);
      let users: any = await Users.query().insertAndFetch({
        email: dto.email,
        password: passwordHash,
        role: dto.role,
        longitude: dto.longitude,
        latitude: dto.latitude,
        device_token: dto.device_token,
        otp: generateOtp,
      });

      this.eventEmitter.emit('send-email', { email: users.email, otp: generateOtp });
      let objUser: any = {};
      objUser.token_type = jwtConstants.token_type;
      objUser.token = this.jwtService.sign(users.toJSON());
      objUser.user_details = users;
      return objUser;
    }
    catch (err) {
      return err;
    }

  }
  @OnEvent('send-email', { async: true })
  async insertSingleNotificationEvent(obj) {
    try {
      await new Promise<void>(async (resolve) => {
        setTimeout(async () => {
          console.log('ddsadasdsa')
          await EmailHelper.sendOtpEmail(obj.email, obj.otp);
          resolve();
        }, 1000);
      });
    } catch (error) {
      console.log(error)
    }
  }

  async generateResetToken() {
    return Math.floor(1000 + Math.random() * 9000);

  }
  async findOne(email: string, deviceToken: string) {
    let user: any = await Users.query()
      .where({ email: email, is_deleted: 0 })
      .first();
    if (!user) {
      return new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }

    if (user.is_block == 1) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: [`your account temporarily locked by admin`],
          error: 'your account temporarily locked by admin',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.is_deleted == 1) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: [`this account is not available`],
          error: 'this account is not available',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let updateUser = await this.updateDeviceToken(user.id, deviceToken);
    return updateUser;
  }

  async updateDeviceToken(userId, deviceToken) {
    let user: any = await Users.query().updateAndFetchById(userId, { device_token: deviceToken })
    let generateOtp = await Helper.generateOtp()
    await Users.query().updateAndFetchById(user.id, {
      otp: generateOtp,
    });

    await EmailHelper.sendOtpEmail(user.email, generateOtp);
    return user;
  }


  async getUserById(dto: GetUserByIdDto, req) {
    let query = Users.query()
    query.where({ id: dto.id });
    query.where({ is_deleted: 0 })
    query.withGraphFetched('is_mi_blocked_by_him')
    query.modifyGraph('is_mi_blocked_by_him', (builder) => {
      builder.where('block_by', req.user.id)
    });
    query.withGraphFetched('is_blocked_by_me')
    query.modifyGraph('is_blocked_by_me', (builder) => {
      builder.where('block_to', req.user.id)
    });

    let user: any = await Users.findOneCustom(query)
    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    user.is_friend = await Helper.isFriend({ friendId: user.id, userId: req.user.id })
    user.friend_count = await Helper.friendCount(user.id)
    return user;
  }
  async deleteGetById(dto: GetUserByIdDto, req) {
    let query = Users.query()
    query.where({ id: dto.id });
    query.withGraphFetched('is_mi_blocked_by_him')
    query.modifyGraph('is_mi_blocked_by_him', (builder) => {
      builder.where('block_by', req.user.id)
    });
    query.withGraphFetched('is_blocked_by_me')
    query.modifyGraph('is_blocked_by_me', (builder) => {
      builder.where('block_to', req.user.id)
    });

    let user: any = await Users.findOneCustom(query)
    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    user.is_friend = await Helper.isFriend({ friendId: user.id, userId: req.user.id })
    user.friend_count = await Helper.friendCount(user.id)
    return user;
  }


  async getAllUsers(params) {
    let friendIds: any = await Helper.getFriendIds({ userId: params.req.user.id })
    let isRequested: any = await Helper.getRequestedIds({ userId: params.req.user.id })
    let blockUserIds: any = await Helper.isBlocked({ userId: params.req.user.id });
    let users: any;
    let userQuery: any
    userQuery = Users.query();
    userQuery.where({ role: 'user', is_deleted: 0 });
    userQuery.where('id', '!=', params.req.user.id);
    userQuery.whereNotIn('id', blockUserIds);
    userQuery.whereNotIn('id', friendIds);
    userQuery.whereNotIn('id', isRequested);


    users = await Users.pagination(userQuery, params)
    for (const item of users.results) {
      item.is_friend = await Helper.isFriend({ friendId: item.id, userId: params.req.user.id })
      item.friend_count = await Helper.friendCount(item.id)

    }
    return users;
  }

  async getAllBlockUsers(params) {
    let user: any;
    let query: any
    query = BlockUser.query()
    query.where({ block_by: params.req.user.id })
    query.withGraphFetched('user');
    user = await BlockUser.pagination(query, params)
    return user
  }

  async updateUser(dto: UpdateProfileDto, req, file) {
    let userObj: any = {};
    if (dto.first_name) { userObj.first_name = dto.first_name }
    if (dto.last_name) { userObj.last_name = dto.last_name }
    if (dto.gender) { userObj.gender = dto.gender }
    if (dto.country) { userObj.country = dto.country }
    if (dto.city) { userObj.city = dto.city }
    if (dto.state) { userObj.state = dto.state }
    if (dto.latitude) { userObj.latitude = dto.latitude }
    if (dto.longitude) { userObj.longitude = dto.longitude }
    if (dto.date_of_birth) { userObj.date_of_birth = dto.date_of_birth }
    if (dto.phone_number) { userObj.phone_number = dto.phone_number }
    if (file) { userObj.profile = 'user/' + file.filename }
    let updatedUser: any = await Users.query().updateAndFetchById(dto.id, userObj)
    console.log(updatedUser)
    return updatedUser;
  }

  async saveLocation(dto: savedLocationDto, req) {
    // let savedLocation:any = await Address.query().insertAndFetch()
    let addresses: any = new UserAddresses();
    addresses.latitude = dto.latitude;
    addresses.longitude = dto.longitude;
    addresses.user_id = req.user.id;
    addresses.address = dto.address;
    addresses.title = dto.title;
    addresses.default = dto.default_address;
    //sdsdds
    let savedLocation: any = await UserAddresses.query().insertAndFetch(addresses);
    return savedLocation;

  }

  async deleteLocation(dto: DeleteLocationDto) {
    let deletedLocation = await UserAddresses.query().deleteById(dto.id)
    return deletedLocation;

  }

  async getAllLocation(req) {
    let SavedLocation = await UserAddresses.query().where({ user_id: req.user.id }).orderBy('id', 'desc'); // Order by the 'id' column in ascending order;
    return SavedLocation;
  }

  async sendOtp(otpDto: OtpDto) {
    let userExist: any = await Users.query()
      .where({ email: otpDto.email, is_deleted: 0 })
      .first();
    if (!userExist) {
      throw new HttpException('email not found', HttpStatus.BAD_REQUEST);
    }
    let generateOtp = await Helper.generateOtp()
    await Users.query().updateAndFetchById(userExist.id, {
      otp: generateOtp,
    });

    await EmailHelper.sendOtpEmail(otpDto.email, generateOtp);
    return 'check your email for otp';
  }
  async changePassword(changePasswordDto: ChangePasswordDto) {
    let userItem: any = await Users.query()
      .where({ email: changePasswordDto.email })
      .first();
    if (!userItem) {
      throw new HttpException('email not found', HttpStatus.BAD_REQUEST);
    }

    if (userItem.otp != changePasswordDto.otp) {
      throw new HttpException('otp not match', HttpStatus.BAD_REQUEST);
    }
    const passwordHash = await bcrypt.hash(changePasswordDto.password, 10);
    return await Users.query().updateAndFetchById(userItem.id, {
      password: passwordHash,
    });
  }

  async deleteAccount(dto: DeleteAccountDto, req) {

    let userItem: any = await Users.query().where({ is_deleted: 0, id: dto.user_id }).first();
    if (!userItem) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    await Users.query().updateAndFetchById(userItem.id, { is_deleted: 1 })
    await Likes.query().where({ user_id: req.user.id }).delete()
    await Notifications.query().where({ sender_id: req.user.id }).delete()
    await Notifications.query().where({ sender_id: req.user.id }).delete()
    await NotificationReceiver.query().where({ receiver_id: req.user.id }).delete()

    await Reported.query().where({ user_id: req.user.id }).delete()
    await Reporting.query().where({ user_id: req.user.id }).delete()
    await UserAddresses.query().where({ user_id: req.user.id }).delete()
    await BlockUser.query().where({ block_by: req.user.id }).orWhere({ block_to: req.user.id }).delete()
    await Friends.query().where({ sender_id: req.user.id }).orWhere({ receiver_id: req.user.id }).delete()
    let comments: any = await Comments.query().withGraphFetched('child_comments').where({ user_id: req.user.id })
    for (const iterator of comments) {
      await Comments.query().where({ id: iterator.id }).delete()
      if (comments?.child_comments?.length > 0) {
        for (const item of comments?.child_comments) {
          await Comments.query().where({ id: item.id }).delete()
        }
      }
    }


    return true
  }



  async reportSearchText(data: any) {



    let blockUserIds = await Helper.isBlocked({ userId: data.req.user.id })
    let friendIds = await Helper.getFriendIds({ userId: data.req.user.id })


    let dto: GlobalSearchDto = data.dto;

    let query: any = Reporting.query()
    // query.where({ user_id: data.req.user.id })
    query.whereNotExists(Reporting.relatedQuery('reported_report').where({ user_id: data.req.user.id, type: ReportedTypeEnum.Reporting }));




    query.where(function () {
      this.where('is_public', '=', 1).whereNotIn('user_id', blockUserIds)
      this.orWhere(function () {
        this.where('is_public', '=', 0).where({ 'user_id': data.req.user.id });
        this.orWhere('is_public', '=', 0).whereIn('user_id', friendIds);
      });
    });



    if (dto?.incident_id) {
      query.where({ incident_id: dto.incident_id })
    }

    if (dto?.search_text) {
      query.where(qqq => {
        qqq.where('text', 'like', `%${dto.search_text}%`)
        qqq.orWhere('location', 'like', `%${dto.search_text}%`)
        // qqq.orWhereExists(Reporting.relatedQuery('user').where('first_name', 'like', `%${dto.search_text}%`));
        // qqq.orWhereExists(Reporting.relatedQuery('user').where('first_name', 'like', `%${dto.search_text}%`));
        // qqq.orWhereExists(Reporting.relatedQuery('user').where('user_name', 'like', `%${dto.search_text}%`));
        // qqq.orWhereExists(Reporting.relatedQuery('user').where('email', 'like', `%${dto.search_text}%`));
        // qqq.orWhereExists(Reporting.relatedQuery('user').where('phone_number', 'like', `%${dto.search_text}%`));
        // qqq.orWhereExists(Reporting.relatedQuery('user').orWhereRaw("CONCAT(`first_name` ,'', `last_name`) LIKE '%" + dto.search_text + "%'"));
        // qqq.orWhereExists(Reporting.relatedQuery('user').orWhereRaw("CONCAT(`first_name` ,' ', `last_name`) LIKE '%" + dto.search_text + "%'"));
      });

    }

    if (dto?.latitude && dto?.longitude) {
      query.select('*', raw(`( 6367 * ACOS( COS(RADIANS(${dto.latitude ?? null})) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(${dto.longitude ?? null})) + SIN(RADIANS(${dto.latitude ?? null})) * SIN(RADIANS(latitude)) ) ) AS distance`))
      query.having('distance', '<=', 10)
    }




    query.withGraphFetched('parent.user')
    query.withGraphFetched('user')
    query.withGraphFetched('share_count')
    query.withGraphFetched('comments_count')
    query.withGraphFetched('likes_count')
    query.withGraphFetched('is_like').modifyGraph('is_like', (builder) => {
      builder.where('user_id', data.req.user.id);
    });

    let result: any = await Reporting.pagination(query, data);
    return result

  }
  async userSearchText(data: any) {
    let dto: GlobalSearchDto = data.dto;

    let query: any = Users.query();
    query.where({ role: 'user', is_deleted: 0 })
    if (dto?.search_text) {
      query.where(qqq => {
        qqq.where('first_name', 'like', `%${dto.search_text}%`)
        qqq.orWhere('last_name', 'like', `%${dto.search_text}%`)
        qqq.orWhere('user_name', 'like', `%${dto.search_text}%`)
        qqq.orWhere('email', 'like', `%${dto.search_text}%`)
        qqq.orWhere('phone_number', 'like', `%${dto.search_text}%`)
        qqq.orWhereRaw("CONCAT(`first_name` ,'', `last_name`) LIKE '%" + dto.search_text + "%'")
        qqq.orWhereRaw("CONCAT(`first_name` ,' ', `last_name`) LIKE '%" + dto.search_text + "%'")
      })

    }

    query.orderBy('id', 'desc');
    let result: any = await Users.pagination(query, data);
    for (const item of result.results) {
      item.is_friend = await Helper.isFriend({ friendId: item.id, userId: data.req.user.id })
    }
    return result
  }


  async searchText(data: any = {}) {
    let dto: GlobalSearchDto = data.dto;

    if (dto.type === SearchTypeEnum.Users) {
      return await this.userSearchText(data)
    }

    if (dto.type === SearchTypeEnum.Reports) {
      return await this.reportSearchText(data)
    }
  }


}