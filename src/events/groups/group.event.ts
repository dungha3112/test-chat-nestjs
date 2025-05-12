import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServerGroupEvent, Services } from 'src/utils/constants';
import { ISocketRedisService } from 'src/utils/interfaces';
import { Group } from 'src/utils/typeorm';
import { AppGateway } from './../../gateway/gateway';

@Injectable()
export class GroupEvent {
  constructor(
    private readonly _appAppGateway: AppGateway,
    @Inject(Services.REDIS_SOCKET)
    private readonly _redisSocketService: ISocketRedisService,
  ) {}

  @OnEvent(ServerGroupEvent.GROUP_CREATE)
  async handleNewGroupCreate(payload: Group) {
    console.log(`create new group`);
    const onwerId = payload.owner.id;
    const socketIds: string[] = [];

    await Promise.all(
      payload.users.map(async (user) => {
        if (user.id !== onwerId) {
          const socket = await this._redisSocketService.getUserSocket(user.id);

          if (socket) {
            socketIds.push(socket.id);
          }
        }
      }),
    );

    if (socketIds.length > 0)
      this._appAppGateway.server.to(socketIds).emit('onGroupCreate', payload);
  }
}
