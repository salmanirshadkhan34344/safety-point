import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { SocketsModule } from 'src/socket/sockets.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    SocketsModule,
    NotificationsModule
    ],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule {}
