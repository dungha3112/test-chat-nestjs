import {
  HttpException,
  HttpStatus,
  INestApplicationContext,
  Injectable,
} from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookie from 'cookie';
import { NextFunction } from 'express';
import { ServerOptions } from 'socket.io';
import { Services } from 'src/utils/constants';
import {
  AuthenticatedSocket,
  ICustomJwtService,
  IUserService,
} from 'src/utils/interfaces';

@Injectable()
export class WebsocketAdapter extends IoAdapter {
  constructor(private readonly app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);

    const _customJwtService = this.app.get<ICustomJwtService>(
      Services.CUSTOM_JWT,
    );
    const _userService = this.app.get<IUserService>(Services.USER);

    server.use(async (socket: AuthenticatedSocket, next: NextFunction) => {
      try {
        const token = socket.handshake.headers.token as string;

        if (!token) {
          console.log('Client has no accessToken ?');
          throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }

        //Decode refresh token
        const decoded = await _customJwtService.verifyAccessToken(token);

        const user = await _userService.findOne({
          options: { selectAll: false },
          params: { id: decoded.userId },
        });
        if (!user) {
          throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
        }

        socket.user = user;
        next();
      } catch (error) {
        console.log('Error in WebSocket middleware:', error);
        throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
      }
    });

    return server;
  }
}
