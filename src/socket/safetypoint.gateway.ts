import { Injectable } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Users } from 'src/libs/database/entities/user.entity';
import { Chat } from '../libs/database/entities/chat.entity';
import { Helper } from '../libs/helper/helper.global';
import { SocketSeenMessageDto } from './dto/socket.dto';

@WebSocketGateway({
    namespace: "safetypoint",
    cors: '*',
    transports: ['websocket']
})
@Injectable()
export class SafetyPointGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    async handleConnection (socket: Socket) {
        const header = socket.handshake.headers;
        // console.log('haaaaaaaaaaaaaaaaa', header.user_id)

        if (header?.user_id) {
            const user = await Helper.changeUserStatus(header?.user_id, 1);
            // console.log('haaaaaaaaaaaaaaaaa')

            return this.server.emit("user-connected", user);
        }
    }

    async handleDisconnect (client: Socket) {
        const header = client.handshake.headers;
        console.log('haaaaaaaaaaaaaaaaa', header)

        if (header?.user_id) {
            const user = await Helper.changeUserStatus(header?.user_id, 0);
            console.log('haaaaaaaaaaaaaaaaa')
            return this.server.emit("user-dis-connected", user);
        }
    }


    @SubscribeMessage('reports')
    async reports (@MessageBody() data: any) {
        await Users.query().updateAndFetchById(data.user_id, {
            latitude: data.latitude,
            longitude: data.longitude
        })
        let result = await Helper.getAllReports(data)
        return this.server.emit("reports-" + data.user_id, result);
    }

    @SubscribeMessage("typing")
    async typing (
        @MessageBody() data: any, @ConnectedSocket() socket: Socket) {
        return socket.broadcast.emit(`typing-${data.conversation_id}`, data);
    }


    async reportService ({ reports, userId }) {
        return this.server.emit("reports-" + userId, reports);

    }
    async reportsReGet ({ userId }) {
        return this.server.emit("reget-reports-" + userId);
    }

    async isOnline (data) {
        let user: any = {};
        user.text = "Online...";
        user.status = 1;
        return this.server.emit(`user-online-` + data.user_id, user);
    }
    async Offline (data) {
        let user: any = {};
        user.text = "Offline...";
        user.status = 1;
        return this.server.emit("user-offline-" + data.user_id, user);
    }
    async postReport ({ reportId, data }) {
        return this.server.emit('post-report-' + reportId, data);
    }

    async sentRequest ({ receiverId, data }) {
        return this.server.emit('send-request-' + receiverId, data);
    }

    async cancelRequest ({ receiverId, data, senderId }) {
        return this.server.emit('cancel-request' + receiverId + 'user-' + senderId, data)
    }

    async addFriend ({ receiverId, data, senderId }) {
        return this.server.emit("add-friend-" + receiverId + "-user-" + senderId, data)
    }
    async unFriend ({ data }): Promise<any> {
        return this.server.emit("unfriend-" + data.id, data);
    }
    async userBlock ({ authId, blockTo }): Promise<any> {
        return this.server.emit(`block-by-${authId}-block-to${blockTo}`, blockTo);
    }

    async receivedMessage ({ receiverId, conversationId, data }) {

        let conversationIdCount = await Helper.conversationIdCount(conversationId)
        if (conversationIdCount <= 1) {
            return this.server.emit(`message-receiver-${receiverId}`, data);
        }
        if (conversationIdCount > 1) {
            return this.server.emit(`message-receiver-${receiverId}-conversation-${conversationId}`, data);
        }
    }

    async newMessage ({ receiverId, data }) {
        return this.server.emit(`new-message-receiver-${receiverId}`, data);
    }


    async seenMessage ({ senderId, messageId }): Promise<any> {
        let result: any = await Chat.query().where({ id: messageId })
            .withGraphFetched('sender')
            .withGraphFetched('receiver')
            .first();
        return this.server.emit(`all-seen-message-${senderId}`, result);
    }

    async deleteForEveryOne ({ conversationId, data }): Promise<any> {
        return this.server.emit(`delete-for-everyone-${conversationId}`, data);
    }


    async abc (): Promise<any> {
        return await this.server.emit('o');
    }


    async flagMessage ({ senderId, messageId }): Promise<any> {
        let result: any = await Chat.query().where({ id: messageId })
            .withGraphFetched('sender')
            .withGraphFetched('receiver')
            .first();
        return this.server.emit(`all-flag-message-${senderId}`, result);

    }

    @SubscribeMessage("message-acknowledged")
    async messageAcknowledged (@MessageBody() dto: SocketSeenMessageDto, @ConnectedSocket() socket: Socket) {
        let result: any = await Chat.query().updateAndFetchById(dto.message_id, {
            is_seen: 1
        });
        return this.server.emit(`all-seen-message-${result.sender_id}`, result);
    }

    //comment

    async reportComment ({ reportId, data }) {
        return this.server.emit('report-comment-' + reportId, data);
    }


    async reportLikeDislike ({ reportId, data }): Promise<any> {
        return this.server.emit('report-like-dislike-' + reportId, data);
    }

    async commentLikeDislike ({ commentId, data }): Promise<any> {
        return this.server.emit('comment-like-dislike-' + commentId, data);
    }

}   