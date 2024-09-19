import { Body, Controller, Get, Post, Query, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileExtensionsEnum } from 'src/enum/global.enum';
import { JwtAuthGuard } from 'src/libs/guard/jwt-auth.guard';
import { Helper } from 'src/libs/helper/helper.global';
import { BlockUserInterceptor } from 'src/libs/helper/interceptors/block-user-interceptor';
import { ResponseHelper } from 'src/libs/helper/response.helper';
import { editFileName } from 'src/libs/helper/upload-files';
import { ChatService } from './chat.service';
import { ClearChatDto, DeleteMessageDto, FlagMessageDto, OnlineDto, SeenMessageDto, SentMessageDto, UserWishChatDto } from './dto/create-chat.dto';


@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'media', maxCount: 20 }], {
      storage: diskStorage({
        destination: './public/message',
        filename: editFileName,
      }),
      fileFilter: (req, file, cb) => {
        let validation: any = {
          media: FileExtensionsEnum.All,
        };
        Helper.uploadFile(req, file, cb, validation);
      },
    }),
    BlockUserInterceptor
  )
  @Post('/sent-message')
  async sentMessage (
    @UploadedFiles() files,
    @Body() sentMessageDto: SentMessageDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.chatService.sendMessage(sentMessageDto, req, files);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-inboxes')
  async getUser (@Req() req: Request, @Res() res: Response, @Query() query) {
    try {
      const data = await this.chatService.getInboxes({ req, query });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor)
  @Post('/seen-message')
  async seenMessage (
    @Body() seenMessageDto: SeenMessageDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.chatService.seenMessage(seenMessageDto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor)
  @Post('/delete-message')
  async deleteMessage (
    @Body() deleteMessageDto: DeleteMessageDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.chatService.deleteMessage(deleteMessageDto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor)
  @Post('/delete-message-for-everyone')
  async deleteForEveryOne (
    @Body() deleteMessageDto: DeleteMessageDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.chatService.deleteForEveryOne(deleteMessageDto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor
  )
  @Post('/clear-chat')
  async clearChat (
    @Body() clearChatDto: ClearChatDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.chatService.clearChat(clearChatDto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor)
  @Post('/delete-inbox')
  async inboxDelete (
    @Body() clearChatDto: ClearChatDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.chatService.inboxDelete(clearChatDto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor
  )
  @Post('/user-wish-chats')
  async userWishChat (
    @Body() userWishChatDto: UserWishChatDto,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.chatService.userWishChat({ req, query, userWishChatDto });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @Post('/is-online')
  @UseInterceptors(FileInterceptor(''))
  async isOnline (
    @Body() onlineDto: OnlineDto,
    @Req() req: Request,
    @Res() res: Response,
    @Query() query
  ) {
    try {
      const data = await this.chatService.IsOnline(onlineDto);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor)
  @Post('/flag-message')
  async flagMessage (
    @Body() dto: FlagMessageDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.chatService.flagMessage(dto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

}

