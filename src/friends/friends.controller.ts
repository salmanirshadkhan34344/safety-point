import { Body, Controller, Get, Post, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/libs/guard/jwt-auth.guard';
import { BlockUserInterceptor } from 'src/libs/helper/interceptors/block-user-interceptor';
import { ResponseHelper } from 'src/libs/helper/response.helper';
import { AcceptRejectRequestDto, BlockUserDto, CancelRequestDto, CreateFriendDto, UnfriendFriendDto } from './dto/create-friend.dto';
import { FriendsService } from './friends.service';

@Controller('api/friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) { }


  // Add Friend

  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/add-friend')
  async addFriend (
    @Body() dto: CreateFriendDto,
    @Req() req: Request,
    @Res() res: Response) {
    try {
      const friend = await this.friendsService.addFriend(dto, req);
      return ResponseHelper.success({ res, data: friend })

    }
    catch (error) {
      return ResponseHelper.error({ res, req, error })

    }

  }
  // Un Friend
  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/un-friend')
  async unFriend (@Body() createFriendDto: UnfriendFriendDto, @Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.friendsService.unFriend(createFriendDto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  // Accept Or Reject
  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor)
  @UseGuards(JwtAuthGuard)
  @Post('/request-response')
  async friendRequestResponse (@Body() acceptRejectRequestDto: AcceptRejectRequestDto, @Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.friendsService.acceptRejectRequest(acceptRejectRequestDto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  // Cancel Request
  @UseInterceptors(FileInterceptor(''))
  @UseGuards(JwtAuthGuard)
  @Post('/cancel-request')
  async cancelRequest (@Body() cancelRequestDto: CancelRequestDto, @Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.friendsService.cancelRequest(cancelRequestDto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseInterceptors(FileInterceptor(''))
  @UseGuards(JwtAuthGuard)
  @Get('/friend-count')
  async friendCount (@Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.friendsService.friendCount(req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  // List My Friends
  @UseGuards(JwtAuthGuard)
  @Get('/my-friends')
  async myFriends (@Query() query, @Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.friendsService.myFriends({ req, query });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my-received-request')
  async myReceivedRequest (@Query() query, @Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.friendsService.myReceivedRequest({ req, query });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my-sent-request')
  async mySentRequest (@Query() query, @Req() req: Request, @Res() res: Response) {
    try {
      const data = await this.friendsService.mySentRequest({ req, query });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @UseInterceptors(FileInterceptor(''))
  @UseGuards(JwtAuthGuard)
  @Post('/block-user')
  async blockUser (
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: BlockUserDto
  ) {
    try {
      const data = await this.friendsService.blockUser(dto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }
}
