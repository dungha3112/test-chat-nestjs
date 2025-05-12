import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { ServerGroupEvent } from 'src/utils/constants';
import { AuthenticatedSocket } from 'src/utils/interfaces';
import { Group } from 'src/utils/typeorm';
import { AppGateway } from './../../gateway/gateway';

@Injectable()
export class GroupEvent {
  constructor(private readonly _appGateway: AppGateway) {}

  //GROUP_CREATE
  @OnEvent(ServerGroupEvent.GROUP_CREATE)
  async handleNewGroupCreate(payload: Group) {
    console.log(`create new group`);
    const onwerId = payload.owner.id;
    const socketIds: string[] = [];

    await Promise.all(
      payload.users.map(async (user) => {
        if (user.id !== onwerId) {
          const socket = await this._appGateway._sessions.getUserSocket(
            user.id,
          );

          if (socket) {
            socketIds.push(socket.id);
          }
        }
      }),
    );

    if (socketIds.length > 0)
      this._appGateway.server.to(socketIds).emit('onGroupCreate', payload);
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

  //ServerGroupEvent.GROUP_OWNER_UPDATE
  @OnEvent(ServerGroupEvent.GROUP_OWNER_UPDATE)
  handleUpdateOwnerGroup(payload: Group) {
    const room = `group-${payload.id}`;
    this._appGateway.server.to(room).emit('onGroupUpdateOwner', payload);
  }

  // ServerGroupEvent.GROUP_UPDATE
  @OnEvent(ServerGroupEvent.GROUP_UPDATE)
  handleUpdateGroup(payload: Group) {
    const room = `group-${payload.id}`;
    this._appGateway.server.to(room).emit('onGroupUpdate', payload);
  }

  //ServerGroupEvent.GROUP_USER_LEAVE
  @OnEvent(ServerGroupEvent.GROUP_USER_LEAVE)
  async handleUserLeaveGroup({
    group,
    userId,
  }: {
    group: Group;
    userId: string;
  }) {
    console.log({ group, userId });

    const ROOM_NAME = `group-${group.id}`;
    const { rooms } = this._appGateway.server.sockets.adapter;
    const socketInRoom = rooms.get(ROOM_NAME);
    const leftUserSocket = this._appGateway._sessions.getUserSocket(userId);

    if (leftUserSocket && socketInRoom) {
      if (socketInRoom.has(leftUserSocket.id)) {
        return this._appGateway.server
          .to(ROOM_NAME)
          .emit('onGroupParticipantLeft', group);
      } else {
        leftUserSocket.emit('onGroupParticipantLeft', group);
        this._appGateway.server
          .to(ROOM_NAME)
          .emit('onGroupParticipantLeft', group);
        return;
      }
    }
    if (leftUserSocket && !socketInRoom) {
      return leftUserSocket.emit('onGroupParticipantLeft', group);
    }

    this._appGateway.server.to(ROOM_NAME).emit('onGroupUpdateOwner', group);
  }
}
