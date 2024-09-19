import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

import { JwtAuthGuard } from 'src/libs/guard/jwt-auth.guard';
import { ResponseHelper } from 'src/libs/helper/response.helper';
import { SeenDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('api/notifications')
@UseGuards(JwtAuthGuard)

export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get('/paginated')
  async notifications (
    @Query() query,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.notificationsService.getMyNotifications({query,req,res});
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @Post('/seen-all')
  @UseInterceptors(FileInterceptor(''))
  @UseGuards(JwtAuthGuard)
  async seenMyNotification (@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.notificationsService.seenMyAllNotifications(req);
        return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @Post('/seen-single')
  @UseInterceptors(FileInterceptor(''))
  @UseGuards(JwtAuthGuard)
  async seenMySingleNotification (
    @Req() req: Request,
    @Res() res: Response,
    @Body() seenDto: SeenDto,
  ) {
    try {
      const data = await this.notificationsService.seenMySingleNotification(seenDto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @Post('/delete-single')
  @UseInterceptors(FileInterceptor(''))
  @UseGuards(JwtAuthGuard)
  async deleteMySingleNotification (
    @Req() req: Request,
    @Res() res: Response,
    @Body() deleteDto: SeenDto,
  ) {
    try {
      const data =await this.notificationsService.deleteMySingleNotification(deleteDto,req );
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }
}
