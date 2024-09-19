import { Body, Controller, Get, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { BlockUserInterceptor } from 'src/libs/helper/interceptors/block-user-interceptor';
import { InterceptorHelper } from 'src/libs/helper/interceptors/custom-files-interceptor';
import { JwtAuthGuard } from '../libs/guard/jwt-auth.guard';
import { ResponseHelper } from '../libs/helper/response.helper';
import { ChangePasswordDto, DeleteAccountDto, DeleteLocationDto, GetUserByIdDto, GlobalSearchDto, OtpDto, SignUpDto, UpdateProfileDto, savedLocationDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';


@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2
  ) { }


  @UseInterceptors(FileInterceptor(''))
  @Post('/sign-up')
  async signUp (
    @Body() signUpDto: SignUpDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.usersService.signUp(signUpDto);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-all-users')
  async getAllUsers (@Query() query, @Req() req: Request, @Res() res: Response) {
    try {
      const users = await this.usersService.getAllUsers({ query, req });
      return ResponseHelper.success({ res, data: users });
    } catch (error) {
      return ResponseHelper.error({ res, req, error });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-all-blocked-users')
  async getAllBlockedUsers (@Query() query, @Req() req: Request, @Res() res: Response) {
    try {
      const users = await this.usersService.getAllBlockUsers({ query, req });
      return ResponseHelper.success({ res, data: users });
    } catch (error) {
      return ResponseHelper.error({ res, req, error });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/edit-user')
  @UseInterceptors(InterceptorHelper.globalFileInterceptorForImage('image', './public/user'))
  async editUser (
    @UploadedFile() file,
    @Body() dto: UpdateProfileDto,
    @Req() req: Request,
    @Res() res: Response

  ) {
    try {
      const updatedUser = await this.usersService.updateUser(dto, req, file);
      return ResponseHelper.success({ res, data: updatedUser });

    } catch (error) {
      return ResponseHelper.error({ res, req, error });

    }
  }


  @UseInterceptors(FileInterceptor(''))
  @UseGuards(JwtAuthGuard)
  @Post('/save-location')
  async saveLocation (
    @Body() dto: savedLocationDto,
    @Req() req: Request,
    @Res() res: Response

  ) {
    try {
      const data = await this.usersService.saveLocation(dto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })

    }
  }
  @UseGuards(JwtAuthGuard)
  @Get('/get-location')
  async getAllLocation
    (@Req() req: Request,
      @Res() res: Response
    ) {
    try {
      const SavedLocations = await this.usersService.getAllLocation(req);
      return ResponseHelper.success({ res, data: SavedLocations })

    } catch (error) {
      return ResponseHelper.error({ res, req, error })

    }

  }

  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/get-by-id')
  async getById (
    @Body() dto: GetUserByIdDto,
    @Req() req: Request,
    @Res() res: Response

  ) {
    try {
      const data = await this.usersService.getUserById(dto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })

    }
  }


  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/delete-get-by-id')
  async deleteGetById (
    @Body() dto: GetUserByIdDto,
    @Req() req: Request,
    @Res() res: Response

  ) {
    try {
      const data = await this.usersService.deleteGetById(dto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })

    }
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/send-otp')
  async sendOtp (
    @Body() otpDto: OtpDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.usersService.sendOtp(otpDto);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseInterceptors(FileInterceptor(''))
  @Post('/change-password')
  async changePassword (
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.usersService.changePassword(changePasswordDto);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }
  @UseInterceptors(FileInterceptor(''))
  @UseGuards(JwtAuthGuard)
  @Post('/delete-location-by-id')
  async deleteLocation (
    @Body() deleteLocationDto: DeleteLocationDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      let data = await this.usersService.deleteLocation(deleteLocationDto);
      return ResponseHelper.success({ res, data: data })

    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @UseInterceptors(FileInterceptor(''))
  @UseGuards(JwtAuthGuard)
  @Post('/delete-account')
  async deleteAccount (
    @Body() dto: DeleteAccountDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      let data = await this.usersService.deleteAccount(dto, req);
      return ResponseHelper.success({ res, data: data })

    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @Post("/global-search")
  @UseInterceptors(FileInterceptor(''))
  @UseGuards(JwtAuthGuard)
  async searchText (
    @Query() query,
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: GlobalSearchDto,
  ) {
    try {
      const data = await this.usersService.searchText({
        dto,
        query,
        req,
      });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

}