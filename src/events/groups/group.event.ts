import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { GroupEvents } from 'src/utils/constants';
import { Group } from 'src/utils/typeorm';
import { AppGateway } from './../../gateway/gateway';
import { AuthenticatedSocket } from 'src/gateway/gateway.interface';

@Injectable()
export class GroupEvent {
  constructor(private readonly _appGateway: AppGateway) {}

  //GROUP_CREATE
  @OnEvent(GroupEvents.GROUP_CREATE)
  async handleNewGroupCreate(payload: Group) {
    const onwerId = payload.owner.id;
    const socketIds: string[] = [];

    await Promise.all(
      payload.users.map((user) => {
        if (user.id !== onwerId) {
          const socket = this._appGateway._sessions.getUserSocket(user.id);

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

  //GroupEvents.GROUP_OWNER_UPDATE
  @OnEvent(GroupEvents.GROUP_OWNER_UPDATE)
  async handleUpdateOwnerGroup(payload: Group) {
    // const onwerId = payload.owner.id;
    // const socketIds: string[] = [];

    // await Promise.all(
    //   payload.users.map((user) => {
    //     if (user.id !== onwerId) {
    //       const socket = this._appGateway._sessions.getUserSocket(user.id);

    //       if (socket) {
    //         socketIds.push(socket.id);
    //       }
    //     }
    //   }),
    // );

    // if (socketIds.length > 0)
    //   this._appGateway.server.to(socketIds).emit('onGroupUpdateOwner', payload);

    const room = `group-${payload.id}`;
    this._appGateway.server.to(room).emit('onGroupUpdateOwner', payload);
  }

  // GroupEvents.GROUP_UPDATE
  @OnEvent(GroupEvents.GROUP_UPDATE)
  async handleUpdateGroup(payload: Group) {
    //    const onwerId = payload.owner.id;
    // const socketIds: string[] = [];
    // await Promise.all(
    //   payload.users.map((user) => {
    //     if (user.id !== onwerId) {
    //       const socket = this._appGateway._sessions.getUserSocket(user.id);
    //       if (socket) {
    //         socketIds.push(socket.id);
    //       }
    //     }
    //   }),
    // );
    // if (socketIds.length > 0)
    //   this._appGateway.server.to(socketIds).emit('onGroupUpdate', payload);

    const room = `group-${payload.id}`;
    this._appGateway.server.to(room).emit('onGroupUpdate', payload);
  }

  //GroupEvents.GROUP_USER_LEAVE
  @OnEvent(GroupEvents.GROUP_USER_LEAVE)
  async handleUserLeaveGroup({
    group,
    userId,
  }: {
    group: Group;
    userId: string;
  }) {
    // const onwerId = group.owner.id;
    // const socketIds: string[] = [];

    // await Promise.all(
    //   group.users.map((user) => {
    //     if (user.id !== onwerId) {
    //       const socket = this._appGateway._sessions.getUserSocket(user.id);

    //       if (socket) {
    //         socketIds.push(socket.id);
    //       }
    //     }
    //   }),
    // );

    // if (socketIds.length > 0)
    //   this._appGateway.server.to(socketIds).emit('onGroupUpdateOwner', group);

    // const leftUserSocket = this._appGateway._sessions.getUserSocket(userId);
    // if (leftUserSocket) {
    //   return leftUserSocket.emit('onGroupParticipantLeft', group);
    // }

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
