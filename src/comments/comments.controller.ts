import {
  Body,
  Controller,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../libs/guard/jwt-auth.guard';
import { BlockUserInterceptor } from '../libs/helper/interceptors/block-user-interceptor';
import { InterceptorHelper } from '../libs/helper/interceptors/custom-files-interceptor';
import { ResponseHelper } from '../libs/helper/response.helper';
import { CommentsService } from './comments.service';
import {
  CreateCommentDto,
  DeleteCommentDto,
  ReportCommentsPaginatedDto,
  UpdateCommentDto
} from './dto/comment.dto';


@UseGuards(JwtAuthGuard)
@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @UseInterceptors(InterceptorHelper.globalFileInterceptorForImage('image', './public/comments'))
  @Post("/add-comment")
  async addComment (
    @Body() dto: CreateCommentDto,
    @UploadedFile() file,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.commentsService.addComment(dto, req, file);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor)
  @Post("/delete-comment")
  async deletePostsComment (
    @Body() dto: DeleteCommentDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.commentsService.deletePostsComment(dto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseInterceptors(InterceptorHelper.globalFileInterceptorForImage('image', './public/comments'))
  @Post("/update-comment")
  async updateComment (
    @Body() dto: UpdateCommentDto,
    @UploadedFile() file,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.commentsService.updateComment(dto, req, file);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @Post("/report-comments-paginated")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''), BlockUserInterceptor)
  async reportCommentsPaginated (
    @Query() query,
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: ReportCommentsPaginatedDto,
  ) {
    try {
      const data = await this.commentsService.reportCommentsPaginated({ query, req, dto });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }



}
