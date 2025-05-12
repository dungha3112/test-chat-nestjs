import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Services } from 'src/utils/constants';
import { AuthenticatedSocket, ICustomJwtService } from 'src/utils/interfaces';
import * as cookie from 'cookie';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  pingInterval: 25000,
  pingTimeout: 60000,
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}
  // server: Server from package, to emit to client side
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    try {
      console.log('WebSocket server initialized');
    } catch (error) {
      console.log('erorre after: ', error);
    }
  }

  // afterInit(server: Server) {
  // server.use(async (socket: Socket, next) => {
  //   const { cookie: cookieClient } = socket.handshake.headers;
  //   if (!cookieClient) {
  //     console.log('Client has no cookies ?');
  //     throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
  //   }
  //   const { refresh_token } = cookie.parse(cookieClient);
  //   if (!refresh_token) {
  //     console.log('signing cookie.');
  //     throw new HttpException(
  //       'Error signing cookie.',
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  //   try {
  //     const decoded =
  //       await this._customJwtService.verifyRefreshToken(refresh_token);
  //     console.log(decoded);
  //     //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     //   (socket as AuthenticatedSocket).user = decoded;
  //     //   next();
  //   } catch (err) {
  //     return next(new Error('Authentication error: Invalid token'));
  //   }
  // });
  // }

  // handleConnection
  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    try {
      console.log('socket.user:  ', socket.user);

      console.log('socket connected', socket.id);
      socket.emit('connected', {});
    } catch (error) {
      console.log('error handleConnection', error);
    }
  }
  private extractToken(socket: Socket): string {
    const tokenFromHeader =
      socket.handshake.headers.authorization?.split(' ')[1];
    const tokenFromQuery = socket.handshake.query?.token as string;
    return tokenFromHeader || tokenFromQuery || null;
  }
  // handleDisconnect
  handleDisconnect(socket: AuthenticatedSocket) {
    socket.disconnect();
    console.log('socket dis-connect', socket.id);
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    console.log(body);
  }
}
