import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { toObjectId } from '../utils';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { _id: toObjectId(payload.sub, 'user') } as any,
      });

      if (!user) {
        client.disconnect();
        return;
      }

      client.data.userId = user.id;
      client.data.user = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      client.join(`user:${user.id}`);

      // Emit authenticated event to confirm connection is ready
      client.emit('authenticated', { userId: user.id });
    } catch (error) {
      client.disconnect();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDisconnect(_client: Socket) {
    // TODO: add cleanup
  }

  @SubscribeMessage('joinConversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    if (!client.data.userId) {
      return { error: 'Unauthorized' };
    }

    client.join(`conversation:${conversationId}`);
    return { success: true, conversationId };
  }

  @SubscribeMessage('leaveConversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    client.leave(`conversation:${conversationId}`);
    return { success: true, conversationId };
  }

  broadcastMessage(conversationId: string, message: any) {
    this.server
      .to(`conversation:${conversationId}`)
      .emit('message:new', message);
  }
}
