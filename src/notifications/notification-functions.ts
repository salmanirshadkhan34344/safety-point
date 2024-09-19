import { Injectable } from "@nestjs/common";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { NotificationReceiver } from "src/libs/database/entities/notification-receiver.entity";
import { Notifications } from "src/libs/database/entities/notification.entity";
import { Users } from "src/libs/database/entities/user.entity";
import { Helper } from "src/libs/helper/helper.global";
import { CommentTypeEnum, NotificationRelatedTypeEnum, NotificationTypeEnum, ReportTypeEnum } from '../enum/global.enum';
import { Reporting } from "../libs/database/entities/reporting.entity";
import { FcmHelper } from "./notification.fcm";

@Injectable()
export class NotificationFunction {


    constructor(private readonly eventEmitter: EventEmitter2) { }
    async PublicReportAdded({ senderId, item, receiver_ids, notificationTitle }) {
        try {
            let user: any = await Users.query().where({ id: senderId }).first()
            let title: any = `${user?.first_name} ${user.last_name} added report`
            await this.insertMultipleNotifications({
                body: 'ssss',
                text: title,
                source_id: item.id,
                sender_id: senderId,
                receivedIds: receiver_ids,
                type: ReportTypeEnum.AddReport,
                relatedType: "report",
                related_id: item.id,
                title: notificationTitle
            })
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }


    // add friend notification
    async addFriendNotify({ senderId, item, receiverId, notificationTitle }) {
        try {
            let user: any = await Users.query().where({ id: senderId }).first()
            let title: any = `${user?.first_name} ${user?.last_name} sent you friend request `;
            await this.insertSingleNotification({
                body: item,
                text: title,
                source_id: item.id,
                sender_id: senderId,
                receiver_id: receiverId,
                type: NotificationTypeEnum.AddFriend,
                relatedId: item.id,
                relatedType: NotificationRelatedTypeEnum.Friend,
                title: notificationTitle
            });
            return true;
        } catch (err) {

            console.log(err)
            return false;
        }
    }

    async acceptFriendRequest({ senderId, item, receiverId, }) {
        try {
            let user: any = await Users.query().where({ id: senderId }).first();
            let title: any = `${user?.first_name} ${user?.last_name} accepted your friend request`;
            await this.insertSingleNotification({
                body: item,
                text: title,
                source_id: item.id,
                sender_id: senderId,
                receiver_id: receiverId,
                type: NotificationTypeEnum.AcceptFriend,
                relatedId: item.id,
                relatedType: NotificationRelatedTypeEnum.Friend,
                title: 'accept friend request'
            })
            return true;
        } catch (err) {
            console.log(err)
            return false;
        }
    }

    // add comment
    async postCommentAdd({ senderId, reportCommentCount, item ,reportId}) {
        try {

            let report: any = await Reporting.query().where({ id: reportId }).first();
            let user: any = await Users.query().where({ id: senderId }).first();
            let title: any = `${user?.first_name} ${user?.last_name} commented on a report`;


            if (reportCommentCount < 1) {
                if (report.user_id != senderId) {
                    let userIds: any = [report.user_id]
                    await this.insertMultipleNotifications({
                        body: item,
                        text: title,
                        source_id: item.id,
                        sender_id: senderId,
                        receivedIds: userIds,
                        type: NotificationTypeEnum.ReportComment,
                        related_id: report.id,
                        relatedType: NotificationRelatedTypeEnum.Report,
                        title: "Post commented"
                    });
                    return true;
                }
            }
            if (reportCommentCount > 0) {
                let userIds: any = await Helper.reportCommentedUserIds({
                    reportId: report.id,
                    userId: senderId,
                    commentFor: CommentTypeEnum.Reporting
                })
                await this.insertMultipleNotifications({
                    body: item,
                    text: title,
                    source_id: item.id,
                    sender_id: senderId,
                    receivedIds: userIds,
                    type: NotificationTypeEnum.ReportComment,
                    related_id: report.id,
                    relatedType: NotificationRelatedTypeEnum.Report,
                    title: "Post commented"
                });
                return true;
            }
        } catch (error) {
            console.log(error)
            return false;
        }

    }




    // add comment
    async friendReportNotify({ senderId, item }) {
        try {


            let user: any = await Users.query().where({ id: senderId }).first();
            let title: any = `${user?.first_name} ${user?.last_name} created new report`;
            let userIds: any = await Helper.getFriendIds({ userId: senderId })
            if(userIds?.length > 0){
                await this.insertMultipleNotifications({
                    body: item,
                    text: title,
                    source_id: item.id,
                    sender_id: senderId,
                    receivedIds: userIds,
                    type: NotificationTypeEnum.FriendAddedNewReport,
                    related_id: item.id,
                    relatedType: NotificationRelatedTypeEnum.Report,
                    title: "New Report"
                });
            }
          
            return true;

        } catch (error) {
            console.log(error)
            return false;
        }

    }
    // add comment
    async friendNotifyForReporting({ senderId, item, userIds }) {
        try {


            let user: any = await Users.query().where({ id: senderId }).first();
            let title: any = `${user?.first_name} ${user?.last_name} has notified you for a report`;
            await this.insertMultipleNotifications({
                body: item,
                text: title,
                source_id: item.id,
                sender_id: senderId,
                receivedIds: userIds,
                type: NotificationTypeEnum.NotifiedReport,
                related_id: item.id,
                relatedType: NotificationRelatedTypeEnum.Report,
                title: "Report notify"
            });
            return true;

        } catch (error) {
            console.log(error)
            return false;
        }

    }

    // post Like
    async reportLike({ senderId, reportId, item }) {
        try {
            let report: any = await Reporting.query().where({ id: reportId }).first();
            let user: any = await Users.query().where({ id: senderId }).first();
            if (report.user_id != senderId) {
                let title: any = `${user?.first_name} ${user?.last_name} liked your report`;
                await this.insertSingleNotification({
                    body: item,
                    text: title,
                    source_id: item.id,
                    sender_id: senderId,
                    receiver_id: report.user_id,
                    type: NotificationTypeEnum.ReportLike,
                    relatedId: reportId,
                    relatedType: NotificationRelatedTypeEnum.Report,
                    title: "Report like"
                });
            }
            return true;
        } catch (error) {
            console.log(error)
            return false;
        }
    }


    // add Report
    async insertMultipleNotifications({
        body,
        text,
        source_id,
        sender_id,
        receivedIds,
        type,
        relatedType,
        related_id,
        title
    }) {
        try {
            let notification: any;
            notification = new Notifications();
            notification.body =null;
            notification.text = text;
            notification.type = type;
            notification.source_id = source_id;
            notification.sender_id = sender_id;
            notification.related_id = related_id;
            notification.related_type = relatedType;
            notification = await Notifications.query().insertAndFetch(notification);
            this.eventEmitter.emit('send-multiple-notifications', { receiver_ids: receivedIds, notification, relatedType, related_id, body: text, title })
            return notification;

        } catch (err) {
            console.log(err, 'error')
            return err
        }
    }


    async insertSingleNotification({
        body,
        text,
        source_id,
        sender_id,
        receiver_id,
        type,
        relatedId,
        relatedType,
        title
    }) {
        let notification: any;
        notification = new Notifications();
        notification.body = null;
        notification.text = text;
        notification.type = type;
        notification.source_id = source_id;
        notification.sender_id = sender_id;
        notification.related_id = relatedId;
        notification.related_type = relatedType;
        notification = await Notifications.query().insertAndFetch(notification);

        let notificationReceiver: any;
        notificationReceiver = new NotificationReceiver();
        notificationReceiver.notification_id = notification.id;
        notificationReceiver.receiver_id = receiver_id;
        await NotificationReceiver.query().insert(notificationReceiver);
        this.eventEmitter.emit('send-single-notification', { receiver_id, notification, title: title, body: text });
        return notification;
    }


    @OnEvent('send-single-notification', { async: true })
    async sendSingleNotification({ receiver_id, notification, title, body }) {
        try {
            let deviceToken: any = await Helper.deviceTokenByUsers(receiver_id);

            await FcmHelper.SendNotificationWithTitleBody({ deviceToken, notification, notificationTitle: title, body: body })
        } catch (err) {
            console.log(err)
        }
    }

    @OnEvent('send-multiple-notifications', { async: true })
    async sendMultipleNotifications({ receiver_ids, notification, title, body }) {
        try {
            if (receiver_ids?.length > 0) {
                let allUsers: any = receiver_ids.reduce((acc, curr) => {
                    acc.push({
                        notification_id: notification.id,
                        receiver_id: curr
                    });
                    return acc;
                }, []);
                let deviceTokens: any = await Helper.multipleDeviceTokenByUsers({ids:receiver_ids})
                console.log('token', deviceTokens)
                await FcmHelper.SendMultipleNotificationWithTitleBody({ deviceTokens, notification, notificationTitle: title, body: body })
                await NotificationReceiver.query().insertGraph(allUsers)
            }

        }
        catch (err) {
            console.log(err)
        }
    }



}