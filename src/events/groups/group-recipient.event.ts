import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/gateway/gateway';
import { GroupRecipientEvents } from 'src/utils/constants';
import {
  TAddRecipientToGroupResponse,
  TRemoveRecipientToGroupResponse,
} from 'src/utils/types';

@Injectable()
export class GroupRecipientEvent {
  constructor(private readonly _appGateway: AppGateway) {}

  @OnEvent(GroupRecipientEvents.GROUP_USER_ADD)
  async handleGroupUserAdd(payload: TAddRecipientToGroupResponse) {
    const { group, recipient } = payload;

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
    // const recipientSocket = this._appGateway._sessions.getUserSocket(
    //   recipient.id,
    // );
    // if (recipientSocket) {
    //   recipientSocket.emit('onGroupUserAdd', group);
    // }

    // if (socketIds.length > 0)
    //   this._appGateway.server
    //     .to(socketIds)
    //     .emit('onGroupReceivedNewUser', group);

    const ROOM_NAME = `group-${group.id}`;
    const recipientSocket = this._appGateway._sessions.getUserSocket(
      recipient.id,
    );

    this._appGateway.server.to(ROOM_NAME).emit('onGroupReceivedNewUser', group);

    if (recipientSocket) recipientSocket.emit('onGroupUserAdd', group);
  }

  @OnEvent(GroupRecipientEvents.GROUP_USER_REMOVE)
  async handleGroupUserRemove(payload: TRemoveRecipientToGroupResponse) {
    const { group, recipient } = payload;
    const recipientSocket = this._appGateway._sessions.getUserSocket(
      recipient.id,
    );

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

    // if (recipientSocket) {
    //   recipientSocket.emit('onGroupUserRemoved', group);
    // }

    // if (socketIds.length > 0)
    //   this._appGateway.server
    //     .to(socketIds)
    //     .emit('onGroupReceivedRemoved', payload);

    const ROOM_NAME = `group-${group.id}`;

    this._appGateway.server.to(ROOM_NAME).emit('onGroupReceivedRemoved', group);

    if (recipientSocket) {
      recipientSocket.emit('onGroupUserRemoved', group);
      recipientSocket.leave(ROOM_NAME);
    }
  }
}
