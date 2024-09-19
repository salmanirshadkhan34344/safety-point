import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { raw } from 'objection';
import { Reporting } from 'src/libs/database/entities/reporting.entity';
import { Helper } from 'src/libs/helper/helper.global';
import { v4 as uuid } from 'uuid';
import { ReportedTypeEnum } from '../enum/global.enum';
import { Reported } from '../libs/database/entities/reported.entity';
import { Users } from '../libs/database/entities/user.entity';
import { NotificationFunction } from '../notifications/notification-functions';
import { SafetyPointGateway } from '../socket/safetypoint.gateway';
import { FriendNotifyForReporting, GetReportById, GetReportsDto, GetUserPrivateReportsDto, ReportReportedDto, createReportingDto, updateReportingDto } from './dto/reporting.dto';

@Injectable()
export class ReportingService {
    constructor(

        private readonly safetyPointGateway: SafetyPointGateway,

        private readonly notifications: NotificationFunction
    ) { }
    async addReport(dto: createReportingDto, req, file) {

        await Users.query().updateAndFetchById(req.user.id, {
            latitude: dto.latitude,
            longitude: dto.longitude
        })

        let reportObj: any = {};
        reportObj.user_id = req.user.id;
        reportObj.priority = dto.priority ? dto.priority : null;
        reportObj.text = dto.text;
        reportObj.is_public = dto.is_public;
        reportObj.parent_id = dto.parent_id ? dto.parent_id : 0;
        reportObj.longitude = dto.longitude;
        reportObj.latitude = dto.latitude;
        reportObj.incident_id = dto.incident_id;
        reportObj.location = dto.location;

        if (file) {
            let type = file?.mimetype?.split('/')[0]
            if (type == "video") {
                let obj: any = {
                    path: 'report/' + file.filename,
                    file_id: uuid(),
                    thumbnail: Helper.createVideoThumbnail({ val: file, path: 'report' })
                }
                reportObj.images = JSON.stringify(obj);
            }
            if (type == "image") {
                let obj: any = {
                    path: 'report/' + file.filename,
                    file_id: uuid(),
                }
                reportObj.images = JSON.stringify(obj);
            }
        }



        let report: any = await Reporting.query().insertAndFetch(reportObj)
        await this.notifications.friendReportNotify({ senderId: req.user.id, item: report })
        let users: any = await Helper.getAllUsers({ user_id: req.user.id, longitude: report.longitude, latitude: report.latitude })
        for (let item of users) {
            await this.safetyPointGateway.reportsReGet({ userId: item })
        }
        return report
    }



    async editReport(dto: updateReportingDto, req, file) {
        let existingReport: any = await Reporting.query().findById(dto.id);
        if (!existingReport) {
            throw new HttpException('Report not found', HttpStatus.BAD_REQUEST);
        }
        let received_id: any = await Users.query()
        const filteredReceiverIds = received_id.filter(id => id !== req.user.id);

        let reportObj: any = {};
        reportObj.user_id = req.user.id;
        reportObj.priority = dto.priority ? dto.priority : null;
        reportObj.text = dto.text;
        reportObj.is_public = dto.is_public;
        reportObj.longitude = dto.longitude;
        reportObj.latitude = dto.latitude;
        reportObj.incident_id = dto.incident_id;
        reportObj.location = dto.location;


        if (file) {
            let type = file?.mimetype?.split('/')[0]
            if (type === "video") {
                const obj: any = {
                    path: `report/${file.filename}`,
                    file_id: uuid(),
                    thumbnail: Helper.createVideoThumbnail({ val: file, path: 'report' })
                };
                reportObj.images = JSON.stringify(obj);
            }
            if (type == "image") {
                const obj: any = {
                    path: `report/${file.filename}`,
                    file_id: uuid(),
                };
                reportObj.images = JSON.stringify(obj);
            }
        }
        let updatedReport: any = await Reporting.query().updateAndFetchById(dto.id, reportObj)
        let users: any = await Helper.getAllUsers({ user_id: req.user.id, longitude: updatedReport.longitude, latitude: updatedReport.latitude })
        for (let item of users) {
            let user: any = await Users.query().findById(item)
            console.log('this is the user', user.id)
            let reports: any = await Helper.getAllReports({ user_id: user.id, longitude: user.longitude, user: user.latitude })
            await this.safetyPointGateway.reportService({ userId: user.id, reports })
        }

        return updatedReport;

    }

    async getFriendsAllReports(dto: GetReportsDto, req) {
        let friendIds = await Helper.getFriendIds({ userId: req.user.id })
        let query: any;
        query = Reporting.query()
        query.whereNotExists(Reporting.relatedQuery('reported_report').where({ user_id: req.user.id, type: ReportedTypeEnum.Reporting }));

        query.whereIn('user_id', friendIds)
        query.select('*', raw(`( 6367 * ACOS( COS(RADIANS(${dto.latitude ?? null})) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(${dto.longitude ?? null})) + SIN(RADIANS(${dto.latitude ?? null})) * SIN(RADIANS(latitude)) ) ) AS distance`))
        query.having('distance', '<=', 500)
        query.withGraphFetched('user')
        const result = await Reporting.findAllCustom(query)
        return result;
    }

    async deleteReport(dto, req) {

        const data: any = await Reporting.query().findById(dto.id)

        if (!data) {
            throw new HttpException('Report not found', HttpStatus.BAD_REQUEST);
        }
        if (data.user_id != req.user.id) {
            throw new HttpException('Only owner can delete the report', HttpStatus.BAD_REQUEST);
        }
        // return data;
        const deletedReport: any = await Reporting.query().deleteById(dto.id);

        let users: any = await Helper.getAllUsers({ user_id: req.user.id, longitude: data.longitude, latitude: data.latitude })
        for (let item of users) {
            await this.safetyPointGateway.reportsReGet({ userId: item })
        }
        return true;
    }

    async reportHistoryData(req) {

        let query: any = Reporting.query()
        query.where({ user_id: req.user.id })
        query.whereNotExists(Reporting.relatedQuery('reported_report').where({ user_id: req.user.id, type: ReportedTypeEnum.Reporting }));

        query.withGraphFetched('parent.user')
        query.withGraphFetched('user')
        query.withGraphFetched('share_count')
        query.withGraphFetched('comments_count')
        query.withGraphFetched('likes_count')
        query.withGraphFetched('is_like').modifyGraph('is_like', (builder) => {
            builder.where('user_id', req.user.id);
        });

        return await Reporting.findAllCustom(query);
    }

    async gerUserReport(dto: GetReportById, req) {
        let query: any;
        query = Reporting.query().where({ id: dto.id })
        query.whereNotExists(Reporting.relatedQuery('reported_report').where({ user_id: req.user.id, type: ReportedTypeEnum.Reporting }));
        query.withGraphFetched('parent.user')
        query.withGraphFetched('user')
        query.withGraphFetched('share_count')
        query.withGraphFetched('comments_count')
        query.withGraphFetched('likes_count')
        query.withGraphFetched('is_like').modifyGraph('is_like', (builder) => {
            builder.where('user_id', req.user.id);
        }); return await Reporting.findAllCustom(query)
    }

    async getUserReports(dto: GetReportsDto) {
        const user = await Users.query().findById(dto.user_id)
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        let data: any = await Helper.getAllReports({ user_id: dto.user_id, longitude: dto.longitude, latitude: dto.latitude })
        return data;
    }

    async getUserPublicReports(dto: GetUserPrivateReportsDto, req: any) {
        let query: any;
        query = Reporting.query().where({ user_id: dto.user_id, is_public: 1 })
        query.whereNotExists(Reporting.relatedQuery('reported_report').where({ user_id: req.user.id, type: ReportedTypeEnum.Reporting }));
        query.withGraphFetched('parent.user')
        query.withGraphFetched('user')
        query.withGraphFetched('share_count')
        query.withGraphFetched('comments_count')
        query.withGraphFetched('likes_count')
        query.withGraphFetched('is_like').modifyGraph('is_like', (builder) => {
            builder.where('user_id', req.user.id);
        });
        return await Reporting.findAllCustom(query)
    }

    async reportReported(dto: ReportReportedDto, req) {
        const data = await Reported.query().insertAndFetch({
            user_id: req.user.id,
            source_id: dto.reporting_id,
            type: ReportedTypeEnum.Reporting,
            message: dto.issue
        })
        return data;
    }

    async getReportReportedPaginated(data: any = {}) {
        let query: any = Reported.query();
        query.withGraphFetched('reported_report.user')
        query.where({ user_id: data.req.user.id })
        return await Reported.pagination(query, data)
    }

    async getUserPrivateReports(dto: GetUserPrivateReportsDto, req: any) {
        let query: any;
        query = Reporting.query().where({ user_id: dto.user_id, is_public: 0 })
        query.whereNotExists(Reporting.relatedQuery('reported_report').where({ user_id: req.user.id, type: ReportedTypeEnum.Reporting }));
        query.withGraphFetched('parent.user')
        query.withGraphFetched('user')
        query.withGraphFetched('share_count')
        query.withGraphFetched('comments_count')
        query.withGraphFetched('likes_count')
        query.withGraphFetched('is_like').modifyGraph('is_like', (builder) => {
            builder.where('user_id', req.user.id);
        });
        return await Reporting.findAllCustom(query)
    }

    async friendNotifyForReporting(dto: FriendNotifyForReporting, req) {
        let findOne: any = await Reporting.query().findById(dto.reporting_id)
        if (!findOne) {
            throw new HttpException('report not found', HttpStatus.BAD_REQUEST);
        }
        await this.notifications.friendNotifyForReporting({ senderId: req.user.id, item: findOne, userIds: dto.user_Ids })
        return true
    }

}


