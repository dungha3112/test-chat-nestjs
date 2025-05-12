import { Inject } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Services } from 'src/utils/constants';
import { AuthenticatedSocket, ISocketRedisService } from 'src/utils/interfaces';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  pingInterval: 25000,
  pingTimeout: 60000,
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(Services.REDIS_SOCKET)
    private readonly _redisSocketService: ISocketRedisService,
  ) {}

  // server: Server from package, to emit to client side
  @WebSocketServer()
  server: Server;

  // handleConnection
  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    try {
      console.log(socket.user.id, socket.id);

      this._redisSocketService.setUserSocket(socket.user.id, socket);

      socket.emit('connected', {});
    } catch (error) {
      console.log('error handleConnection', error);
    }
  }

  // handleDisconnect
  handleDisconnect(socket: AuthenticatedSocket) {
    socket.disconnect();
    // this._redisSocketService.removeUserSocket(socket.user.id);
    console.log('socket dis-connect', socket.id);
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
  }
}
