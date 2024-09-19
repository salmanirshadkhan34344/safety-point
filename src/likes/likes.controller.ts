import {
  Body,
  Controller,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../libs/guard/jwt-auth.guard';
import { ResponseHelper } from '../libs/helper/response.helper';
import { CommentLikeDisLikeDto, ReportingLikeDisLikeDto, SingleCommentLikesDto, SingleReportLikeDto } from './dto/like.dto';
import { LikesService } from './likes.service';

@UseGuards(JwtAuthGuard)
@Controller('api/likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) { }

  @UseInterceptors(FileInterceptor(''))
  @Post("/report-like-and-dislike")
  async reportLikeAndDislike (
    @Body() dto: ReportingLikeDisLikeDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.likesService.reportLikeAndDislike(dto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Post("/comment-like-and-dislike")
  async CommentLikeAndDislike (
    @Body() dto: CommentLikeDisLikeDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const data = await this.likesService.CommentLikeAndDislike(dto, req);
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }


  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Post("/single-report-likes")
  async finAllPostComment (
    @Query() query,
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: SingleReportLikeDto,
  ) {
    try {
      const data = await this.likesService.singlePostLikeAndDislike({
        query,
        req,
        dto
      });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor(''))
  @Post("/single-comment-likes-info")
  async commentsLikeInfo (
    @Query() query,
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: SingleCommentLikesDto,
  ) {
    try {
      const data = await this.likesService.commentsLikeInfo({ query, req, dto });
      return ResponseHelper.success({ res, data })
    } catch (error) {
      return ResponseHelper.error({ res, req, error })

    }
  }




}
