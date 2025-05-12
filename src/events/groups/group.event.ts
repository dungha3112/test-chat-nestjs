import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ServerGroupEvent, Services } from 'src/utils/constants';
import { AuthenticatedSocket, ISocketRedisService } from 'src/utils/interfaces';
import { Group } from 'src/utils/typeorm';
import { AppGateway } from './../../gateway/gateway';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';

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

  // get emit onGroupJoin from client side
  // {id}: {id: string} id : groupId
  @SubscribeMessage('onGroupJoin')
  onGroupJoin(
    @MessageBody() { id }: { id: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log(`onGroupJoin join id: `, id);
    client.join(`group-${id}`);
    client.to(`group-${id}`).emit('userGroupJoin');
  }

  // get emit onGroupLeave from client side
  // {id}: {id: string} id : groupId
  @SubscribeMessage('onGroupLeave')
  onGroupLeave(
    @MessageBody() { id }: { id: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.leave(`group-${id}`);
    client.to(`group-${id}`).emit('userGroupLeave');
  }
}
