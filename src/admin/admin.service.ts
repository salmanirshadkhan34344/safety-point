import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { raw } from 'objection';
import { Metas } from 'src/libs/database/entities/metas.entity';
import { CommentTypeEnum, LikeTypeEnum, ReportedTypeEnum } from '../enum/global.enum';
import { BlockUser } from '../libs/database/entities/block-user.entity';
import { Comments } from '../libs/database/entities/comments.entity';
import { ContactUs } from '../libs/database/entities/contact-us.entity';
import { Incidents } from '../libs/database/entities/incidents.entity';
import { Likes } from '../libs/database/entities/likes.entity';
import { Reported } from '../libs/database/entities/reported.entity';
import { Reporting } from '../libs/database/entities/reporting.entity';
import { UserAddresses } from '../libs/database/entities/user-addresses.entity';
import { Users } from '../libs/database/entities/user.entity';
import { Helper } from '../libs/helper/helper.global';
import { BlockUsersPaginatedDto, DeleteReportPaginatedDto, ReportingCommentPaginatedDto, ReportingPaginatedDto, UpdateContentDto, UserAddressPaginatedDto, UserFriendPaginatedDto } from './dto/create-admin.dto';



@Injectable()
export class AdminService {

  async userPaginated(data: any = {}) {
    let result = {} as any;
    let allUsersQuery = {} as any;
    allUsersQuery = Users.query();
    allUsersQuery.where('role', 'user');
    allUsersQuery.orderBy('id', 'desc');
    result = await Users.pagination(allUsersQuery, data);
    return result;
  }



  async adminPaginated(data: any = {}) {
    let result = {} as any;
    let allUsersQuery = {} as any;
    allUsersQuery = Users.query();
    allUsersQuery.where('role', 'admin');
    allUsersQuery.orderBy('id', 'desc');
    result = await Users.pagination(allUsersQuery, data);
    return result;
  }

  async reportingPaginated(data: any = {}) {
    let dto: ReportingPaginatedDto = data.dto;
    let result = {} as any;
    let query = {} as any;
    query = Reporting.query();
    if (dto?.user_id) {
      query.where({ user_id: dto?.user_id })
    }
    query.withGraphFetched('user')
    query.withGraphFetched('share_count')
    query.withGraphFetched('comments_count')
    query.withGraphFetched('likes_count')
    result = await Reporting.pagination(query, data);
    return result;
  }

  async reportedPaginated(data: any = {}) {
    let dto: ReportingPaginatedDto = data.dto;
    let result = {} as any;
    let query = {} as any;
    query = Reported.query();
    query.where('type', ReportedTypeEnum.Reporting);
    if (dto?.user_id) {
      query.where({ user_id: dto?.user_id })
    }
    query.withGraphFetched('reported_by')
    query.withGraphFetched('reported_report.user')
    result = await Reported.pagination(query, data);
    return result;
  }
  async blockUsersPaginated(data: any = {}) {
    let dto: BlockUsersPaginatedDto = data.dto;
    let result = {} as any;
    let query = {} as any;
    query = BlockUser.query();
    if (dto?.user_id) {
      query.where({ user_id: dto?.user_id })
    }
    query.withGraphFetched('user_block_by')
    query.withGraphFetched('user_block_to')
    result = await BlockUser.pagination(query, data);
    return result;
  }

  async incidentsPaginated(data: any = {}) {
    let result = {} as any;
    let query = {} as any;
    query = Incidents.query();
    result = await Incidents.pagination(query, data);
    return result;
  }

  async usersAddressPaginated(data: any = {}) {
    let dto: UserAddressPaginatedDto = data.dto;
    let result = {} as any;
    let query = {} as any;
    query = UserAddresses.query();
    query.where({ user_id: dto?.user_id })
    query.withGraphFetched('user')
    result = await UserAddresses.pagination(query, data);
    return result;
  }

  async reportCommentsPaginated(data: any = {}) {
    let dto: ReportingCommentPaginatedDto = data.dto;
    let result = {} as any;
    let query: any = Comments.query();
    query.where({
      commentableId: dto.report_id,
      commentableType: CommentTypeEnum.Reporting
    })
    query.withGraphFetched('user')
    query.withGraphFetched('child_comments.user')
    query.whereNull('parent_id');
    query.orderBy('id', 'desc');
    result = await Comments.pagination(query, data);
    return result;
  }

  async reportingLikePaginated(data: any = {}) {
    let dto: ReportingCommentPaginatedDto = data.dto;
    let result = {} as any;
    let query = {} as any;
    query = Likes.query();
    query.where({ likeableId: dto.report_id, likeableType: LikeTypeEnum.Reporting });
    query.withGraphFetched('user')
    query.orderBy('id', 'desc');
    result = await Likes.pagination(query, data);
    return result;
  }


  async reportingDetail(dto: ReportingCommentPaginatedDto) {
    let result = {} as any;
    let query = {} as any;
    query = Reporting.query();
    query.where({ id: dto.report_id });
    query.withGraphFetched('user')
    query.withGraphFetched('share_count')
    query.withGraphFetched('comments_count')
    query.withGraphFetched('likes_count')
    query.orderBy('id', 'desc');
    result = await Reporting.findOneCustom(query)
    return result;
  }
  async friendsPaginated(data: any = {}) {
    let dto: UserFriendPaginatedDto
    let userIds: any = await Helper.getFriendIds({ userId: dto.user_id })
    let result = {} as any;
    let query = {} as any;
    query = Users.query();
    query.where({ is_deleted: 0 });
    query.whereIn('id', userIds);
    query.orderBy('id', 'desc');
    result = await Users.pagination(query, data);
    return result;
  }
  async contactUsPaginated(data: any = {}) {
    let result = {} as any;
    let query = {} as any;
    query = ContactUs.query();
    query.withGraphFetched('user')
    query.orderBy('id', 'desc');
    result = await ContactUs.pagination(query, data);
    return result;
  }

  // chart

  async currentYearUsers() {
    let year = moment(Date.now()).format("YYYY")
    let singleItem: any
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    singleItem = await Users.query().select(raw("COUNT(id) as count,MONTHNAME(created_at) as month_name, YEAR(created_at) AS year"))
      .groupBy('month_name')
      .having("year", '=', year)

    let dataSet = []
    months.reduce((acc, current) => {
      let single = singleItem.find(e => e.month_name === current)
      if (single) {
        dataSet.push({ user_count: single.count, month: current })
      }
      else {
        dataSet.push({ user_count: 0, month: current })
      }
      return dataSet
    }, []);
    return dataSet
  }

  async currentYearReporting() {
    let year = moment(Date.now()).format("YYYY")
    let singleItem: any
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    singleItem = await Reporting.query().select(raw("COUNT(id) as count,MONTHNAME(created_at) as month_name, YEAR(created_at) AS year"))
      .groupBy('month_name')
      .having("year", '=', year)

    let dataSet = []
    months.reduce((acc, current) => {
      let single = singleItem.find(e => e.month_name === current)
      if (single) {
        dataSet.push({ report_count: single.count, month: current })
      }
      else {
        dataSet.push({ report_count: 0, month: current })
      }
      return dataSet
    }, []);
    return dataSet
  }

  async userDetail(dto: UserFriendPaginatedDto) {
    let query = {} as any;
    query = Users.query();
    query.where({ id: dto.user_id });
    return await Users.findOneCustom(query)
  }

  async deleteReport(dto: DeleteReportPaginatedDto) {
    if (dto.status == 'accept') {
      await Reporting.query().deleteById(dto.report_id);
      await Reported.query().where({
        source_id: dto.report_id,
        type: ReportedTypeEnum.Reporting
      }).delete()
    }

    if (dto.status == 'reject') {
      await Reporting.query().deleteById(dto.report_id);
      await Reported.query().deleteById(dto.reported_id);
    }

    return true
  }

  async dashboardData() {
    let dashboardData: any = {}

    dashboardData.app_content = await
      Metas.query()
        .select(raw(`MAX(CASE WHEN meta_key = 'about_us'THEN meta_value END) about_us`))
        .select(raw(`MAX(CASE WHEN meta_key = 'terms_and_services'THEN meta_value END) terms_and_services`))
        .select(raw(`MAX(CASE WHEN meta_key = 'privacy_policy'THEN meta_value END) privacy_policy`))
        .where({ source_type: 'app-info' })
        .groupBy('source_id', 'user_id').first()
    return dashboardData;
  }

  async updateContent(dto: UpdateContentDto) {
    let item: any = await Metas.query().where({ meta_key: dto.update_key, source_type: 'app-info' }).first();
    return await Metas.query().updateAndFetchById(item.id, { meta_value: dto.update_value });
  }


  async cardHeader() {
    let obj: any = {}
    let userCount: any = await Users.query().count('id as count').first();
    let reportingCount: any = await Reporting.query().count('id as count').first();
    obj.user_count = userCount.count
    obj.reporting_count = reportingCount.count
    return obj;
  }

}
