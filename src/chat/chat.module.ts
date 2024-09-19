import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { SocketsModule } from 'src/socket/sockets.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    SocketsModule,
    NotificationsModule
    ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
