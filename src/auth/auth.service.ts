import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from '../libs/database/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ApproveOtpDto, PhoneNumberDto, ProfileInformationDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }


  async login(user: any) {
    try {
      const payload = { email: user.email, sub: user.id, };

      return {
        token_type: "Bearer",
        token: this.jwtService.sign(user),
        user_details: user
      };
    }
    catch (err) {
      return err;
    }

  }

  async validateUser(email: string, pass: string, deviceToken: string): Promise<any> {
    let findOne: any = await Users.query().where({ email: email, is_deleted: 0 }).first()
    await Users.query().updateAndFetchById(findOne.id, { device_token: deviceToken })
    if (findOne && findOne.password && await bcrypt.compare(pass, findOne.password) == true) {
      const { password, ...result } = findOne;
      return result;
    }
    return null;
  }


  async logOut(req): Promise<any> {
    let userExist = await Users.query().where({ id: req.user.id }).first();
    if (!userExist) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    return await Users.query().updateAndFetchById(req.user.id, {
      device_token: null
    });
  }





  // saving 
  async saveNumber(dto: PhoneNumberDto, req) {
    let userExist = await Users.query().findById(req.user.id)
    if (!userExist) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    return await Users.query().updateAndFetchById(req?.user?.id, {
      phone_number: dto?.phone_number,
    })
  }

  async approveOtp(dto: ApproveOtpDto, req): Promise<any> {
    try {


      let userExist: any = await Users.query().findById(req.user.id)
      if (!userExist) {
        throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
      }
      if (!userExist?.otp == null) {
        throw new HttpException('otp is expire', HttpStatus.BAD_REQUEST);
      }
      if (userExist?.otp != dto?.otp) {
        throw new HttpException('invalid otp', HttpStatus.BAD_REQUEST);
      }
      return await Users.query().updateAndFetchById(req.user.id, {
        is_verified: 1
      })
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async profileDetails(dto: ProfileInformationDto, req, file): Promise<any> {
    let userExist: any = await Users.query().findById(req.user.id)

    if (!userExist) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST)
    }
    return await Users.query().updateAndFetchById(req.user.id, {
      first_name: dto.first_name,
      last_name: dto.last_name,
      profile: file ? 'user/' + file.filename : null
    })

  }

}
