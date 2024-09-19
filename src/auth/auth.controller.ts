import { Body, Controller, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';


import { JwtAuthGuard } from '../libs/guard/jwt-auth.guard';
import { LocalAuthGuard } from '../libs/guard/local-auth.guard';
import { InterceptorHelper } from '../libs/helper/interceptors/custom-files-interceptor';
import { ResponseHelper } from '../libs/helper/response.helper';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ApproveOtpDto, LogInDto, PhoneNumberDto, ProfileInformationDto } from './dto/create-auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  @Post('/login')
  @UseInterceptors(FileInterceptor(''))
  @UseGuards(LocalAuthGuard)
  async login (@Body() obj: LogInDto, @Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.authService.login(req.user);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }

  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @UseInterceptors(FileInterceptor(''))
  async logOut (@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.authService.logOut(req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @Post('/save-number')
  @UseInterceptors(FileInterceptor(''))
  @UseGuards(JwtAuthGuard)
  async saveNumber (@Body() dto: PhoneNumberDto, @Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.authService.saveNumber(dto, req);
      return ResponseHelper.success({ res, data })
    }
    catch (error) {
      return ResponseHelper.error({ res, req, error })

    }
  }

  @Post('/approve-otp')
  @UseInterceptors(FileInterceptor(''))
  @UseGuards(JwtAuthGuard)
  async approveOtp (@Body() dto: ApproveOtpDto, @Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.authService.approveOtp(dto, req);
      return ResponseHelper.success({ res, data })
    }
    catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @Post('/profile-details')
  @UseInterceptors(InterceptorHelper.globalFileInterceptorForImage('image', './public/user'))
  @UseGuards(JwtAuthGuard)
  async profile_details (
    @UploadedFile() file,
    @Body() dto: ProfileInformationDto,
    @Req() req: Request,
    @Res() res: Response) {
    try {
      const data = await this.authService.profileDetails(dto, req, file);
      return ResponseHelper.success({ res, data })
    }
    catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

}
