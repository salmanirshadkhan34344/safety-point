import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { NotificationRelatedTypeEnum } from 'src/enum/global.enum';
import { NotificationReceiver } from 'src/libs/database/entities/notification-receiver.entity';
import { Notifications } from 'src/libs/database/entities/notification.entity';
import { Reporting } from 'src/libs/database/entities/reporting.entity';
import { Helper } from 'src/libs/helper/helper.global';
import { SeenDto } from './dto/create-notification.dto';


@Injectable()
export class NotificationsService {

  async getMyNotifications (params: any = {}) {
    let blockUserIds: any = await Helper.isBlocked({ userId: params.req.user.id })

    let query: any = Notifications.query();
    query.where('related_type' ,'!=','friend')
    query.whereNotIn('sender_id',blockUserIds)    
    query.withGraphFetched('sender')  
    query.withGraphFetched('received_notification');
    query.whereExists(Notifications.relatedQuery('received_notification').where('receiver_id', params.req.user.id).whereNotIn('receiver_id',blockUserIds));
    query.orderBy('id', 'desc');
    let result:any = await Notifications.pagination(query, params);
    for (const iterator of result?.results) {
      if(iterator.related_type == NotificationRelatedTypeEnum.Report){
        iterator.report =await Reporting.query().findById(iterator.related_id)
      }
      if(iterator.related_type != NotificationRelatedTypeEnum.Report){
        iterator.report = null
      }
      
    }

    return result
  }

  async seenMyAllNotifications (req) {
    await NotificationReceiver.query().patch({ is_seen: true }).where({ receiver_id: req.user.id, is_seen: false })
    return true;
  }

  async seenMySingleNotification (seenDto: SeenDto, req) {
    await NotificationReceiver.query() .patch({ is_seen: true }).where({ id: seenDto.notification_id, receiver_id: req.user.id })
    return true;
  }

  async deleteMySingleNotification (deleteDto: SeenDto, req) {
    let item: any = await NotificationReceiver.query().where({ id: deleteDto.notification_id, receiver_id: req.user.id }).first()
    if (!item) { throw new HttpException('Notification not found', HttpStatus.NOT_FOUND) }
    await NotificationReceiver.query().deleteById(item.id)
    return true;
  }
}
