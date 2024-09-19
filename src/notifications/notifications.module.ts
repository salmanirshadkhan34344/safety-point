import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationFunction } from './notification-functions';

@Module({
  controllers: [NotificationsController,],
  providers: [NotificationsService,NotificationFunction],
  exports:[NotificationsService,NotificationFunction]
})
export class NotificationsModule {}
