import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NotificationFunction } from '../notifications/notification-functions';

import { CommentTypeEnum } from '../enum/global.enum';
import { Comments } from '../libs/database/entities/comments.entity';
import { Helper } from '../libs/helper/helper.global';
import { SafetyPointGateway } from '../socket/safetypoint.gateway';
import { CreateCommentDto, DeleteCommentDto, ReportCommentsPaginatedDto, UpdateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly safetyPointGateway: SafetyPointGateway,
    private readonly notificationFunction: NotificationFunction


  ) { }

  async addComment (dto: CreateCommentDto, req, file) {
    let result: any = await Comments.query()
      .withGraphFetched('user')
      .insertAndFetch({
        text: dto.text,
        media: file ? 'comments/' + file.filename : null,
        user_id: req.user.id,
        parent_id: dto?.parent_id ? dto?.parent_id : null,
        commentableId: dto.report_id,
        commentableType: CommentTypeEnum.Reporting
      })


    let reportCommentCount: any = await Helper.postCommentCount({ reportId: dto.report_id })


    //notification
    await this.notificationFunction.postCommentAdd({
      senderId: req.user.id,
      reportCommentCount: reportCommentCount,
      item: result,
      reportId: dto.report_id

    })


    //socket
    await this.safetyPointGateway.reportComment({
      reportId: dto.report_id,
      data: result
    })


    return result

  }
  async updateComment (dto: UpdateCommentDto, req, file) {

    let comment: any = await Comments.query().findById(dto.comment_id)
    if (!comment) {
      throw new HttpException('comments not found', HttpStatus.BAD_REQUEST);
    }
    if (comment.user_id != req.user.id) {
      throw new HttpException('can update only your own comment', HttpStatus.BAD_REQUEST);
    }

    let result: any = new Comments();
    if (dto.text) {
      result.text = dto.text;
    }
    if (file) {
      result.media = 'comment/' + file.filename;
    }

    if (!file) {
      if (dto.delete_media) {
        result.media = null;
      }
    }
    let updateComment = await Comments.query().updateAndFetchById(comment.id, result);
    return updateComment

  }


  async deletePostsComment (dto: DeleteCommentDto, req) {
    let comment: any = await Comments.query().findById(dto.comment_id)
    if (!comment) {
      throw new HttpException('comments not found', HttpStatus.BAD_REQUEST);
    }
    if (comment.user_id != req.user.id) {
      throw new HttpException('can delete only your own comment', HttpStatus.BAD_REQUEST);
    }
    await Comments.query().deleteById(dto.comment_id)
    return true

  }


  async reportCommentsPaginated (data: any = {}) {
    let blockUserIds: any = await Helper.isBlocked({ userId: data.req.user.id })
    let dto: ReportCommentsPaginatedDto = data.dto;
    let result = {} as any;
    let query: any = Comments.query();
    query.where({
      commentableId: dto.report_id,
      commentableType: CommentTypeEnum.Reporting
    })

    query.whereNotIn('user_id', blockUserIds)
    query.withGraphFetched('user')
    query.withGraphFetched('child_comments.user')
    query.modifyGraph('child_comments', (builder) => {
      builder.whereNotIn('user_id', blockUserIds)
    });
    query.withGraphFetched('comments_like_count')

    query.withGraphFetched('is_comment_like')
    query.modifyGraph('is_comment_like', (builder) => {
      builder.where('user_id', data.req.user.id)
    });
    query.whereNull('parent_id');
    query.orderBy('id', 'desc');
    result = await Comments.pagination(query, data);
    return result;
  }


}
