import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Comments } from 'src/libs/database/entities/comments.entity';
import { Helper } from 'src/libs/helper/helper.global';
import { LikeTypeEnum } from '../enum/global.enum';
import { Likes } from '../libs/database/entities/likes.entity';
import { Reporting } from '../libs/database/entities/reporting.entity';
import { SafetyPointGateway } from '../socket/safetypoint.gateway';
import { NotificationFunction } from './../notifications/notification-functions';
import { CommentLikeDisLikeDto, ReportingLikeDisLikeDto, SingleCommentLikesDto, SingleReportLikeDto } from './dto/like.dto';

@Injectable()
export class LikesService {



  constructor(

    private readonly notificationFunction: NotificationFunction,
    private readonly safetyPointGateway: SafetyPointGateway,

  ) { }


  async reportLikeAndDislike (dto: ReportingLikeDisLikeDto, req): Promise<any> {

    let like: any = await Likes.query().where({
      likeableId: dto.report_id,
      likeableType: LikeTypeEnum.Reporting,
      user_id: req.user.id,
      like_type: 'like'
      

    }).first();

    if (like) {
      let result: any = await Likes.query().deleteById(like.id)

      let item:any = await Helper.likeCount({
        reportId:dto.report_id,
        authId:req.user.id
      })

      await this.safetyPointGateway.reportLikeDislike({ reportId: dto.report_id, data: item })
      return true;
    }
    let result: any = await Likes.query().insertAndFetch({
      likeableId: dto.report_id,
      likeableType: LikeTypeEnum.Reporting,
      user_id: req.user.id,
      like_type: 'like'
    });
    await this.notificationFunction.reportLike({
      item: result,
      reportId: dto.report_id,
      senderId: req.user.id
    })
    let item:any = await Helper.likeCount({
      reportId:dto.report_id,
      authId:req.user.id
    })
    await this.safetyPointGateway.reportLikeDislike({ reportId: dto.report_id, data: item })
    return true;
  }
  
  
  async CommentLikeAndDislike (dto: CommentLikeDisLikeDto, req): Promise<any> {
    let like: any = await Likes.query().where({
      likeableId: dto.comment_id,
      likeableType: LikeTypeEnum.Comment,
      user_id: req.user.id,
    }).first();
    
    if (like) {
      await Likes.query().deleteById(like.id)

      let item:any = await Helper.commentLikeCount({
        commentId:dto.comment_id,
        authId:req.user.id
      })


      await this.safetyPointGateway.commentLikeDislike({ commentId: dto.comment_id, data: item })
      return true;
    }
    
    await Likes.query().insertAndFetch({
      likeableId: dto.comment_id,
      likeableType: LikeTypeEnum.Comment,
      user_id: req.user.id,
      like_type: 'like'
    });
    let item:any = await Helper.commentLikeCount({
      commentId:dto.comment_id,
      authId:req.user.id
    })

    
    await this.safetyPointGateway.commentLikeDislike({ commentId: dto.comment_id, data: item })
    return true;
  }


  async singlePostLikeAndDislike (data: any = {}): Promise<any> {

    let dto: SingleReportLikeDto = data.dto;
    let findOne: any = await Reporting.query().where({ id: dto.report_id }).first()
    if (!findOne) {
      throw new HttpException("This report has been deleted", HttpStatus.MOVED_PERMANENTLY);
    }
    let result = {} as any;
    let query = {} as any;
    query = Likes.query();
    query.where({ likeableId: dto.report_id, likeableType: LikeTypeEnum.Reporting });
    query.withGraphFetched('user')
    query.orderBy('id', 'desc');
    result = await Likes.pagination(query, data);
    return result;
  }

  async commentsLikeInfo (data: any = {}): Promise<any> {
    let dto: SingleCommentLikesDto = data.dto;
    let findOne: any = await Comments.query().where({ id: dto.comment_id }).first()
    if (!findOne) {
      throw new HttpException("This comment has been deleted", HttpStatus.MOVED_PERMANENTLY);
    }
    let result = {} as any;
    let query = {} as any;
    query = Likes.query();
    query.where({ likeableId: dto.comment_id, likeableType: LikeTypeEnum.Comment });
    query.withGraphFetched('user')
    query.orderBy('id', 'desc');
    result = await Likes.pagination(query, data);
    return result;
  }
}
