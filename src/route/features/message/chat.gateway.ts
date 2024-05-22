import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { MessageService } from './message.service';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthService } from 'src/route/auth/auth.service';
import { UserService } from '../user/user.service';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: string): Promise<void> {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader) {
      const author = await this.authService.handleVerifyToken(
        (authHeader as string).split(' ')[1],
      );
      const infoUser = await this.userService.getUserById(author);
      this.server.sockets.emit('recMessage', {
        idUser: infoUser.id,
        fullname: infoUser.fullname,
        avatar: infoUser.avatar,
        message: payload,
      });
    }
  }

  @SubscribeMessage('editMessage')
  async handleEditMessage(
    client: Socket,
    payload: { id: string; body: UpdateMessageDto },
  ): Promise<void> {
    const message = await this.messageService.updateMessage(
      payload.id,
      payload.body,
    );
    this.server.emit('recMessage', message);
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(client: Socket, payload: string): Promise<void> {
    const result = await this.messageService.deleteMessage(payload);
    this.server.emit('recMessage', result);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  afterInit(socket: Socket): any {}

  async handleConnection(socket: Socket) {
    console.log('connect', socket.id);
    const authHeader = socket.handshake.headers.authorization;

    if (authHeader && (authHeader as string).split(' ')[1]) {
      try {
        socket.data.userId = await this.authService.handleVerifyToken(
          (authHeader as string).split(' ')[1],
        );
        socket.join(socket.data.userId);
        console.log('connect success');
      } catch (e) {
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnect', socket.id, socket.data?.email);
  }
}
