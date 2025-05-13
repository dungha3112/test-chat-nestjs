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
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { IGatewaySessionManager } from './gateway.session';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  pingInterval: 25000,
  pingTimeout: 60000,
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(Services.GATEWAY_SESSION_MANAGER)
    public readonly _sessions: IGatewaySessionManager,
  ) {}

  // server: Server from package, to emit to client side
  @WebSocketServer()
  server: Server;

  // handleConnection
  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    try {
      console.log(
        '---> conected () username: ',
        socket.user.username,
        ' socketId: ',
        socket.id,
      );

      this._sessions.setUserSocket(socket.user.id, socket);
      socket.emit('connected', {});
    } catch (error) {
      console.log('error handleConnection', error);
    }
  }

  // handleDisconnect
  handleDisconnect(socket: AuthenticatedSocket) {
    socket.disconnect();
    this._sessions.removeUserSocket(socket.user.id);
    console.log('socket dis-connect', socket.id);
  }
}
