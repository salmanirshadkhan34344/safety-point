import { Module } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { SocketsModule } from '../socket/sockets.module';
import { NotificationsModule } from 'src/notifications/notifications.module';


@Module({
  imports: [
    SocketsModule,
    NotificationsModule
    ],
  controllers: [ReportingController],
  providers: [ReportingService],
})
export class ReportingModule {}
