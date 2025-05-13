import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/gateway/gateway';
import { ServerGroupRecipientEvent } from 'src/utils/constants';
import {
  TAddRecipientToGroupResponse,
  TRemoveRecipientToGroupResponse,
} from 'src/utils/types';

@Injectable()
export class GroupRecipientEvent {
  constructor(private readonly _appGateway: AppGateway) {}

  @OnEvent(ServerGroupRecipientEvent.GROUP_USER_ADD)
  handleGroupUserAdd(payload: TAddRecipientToGroupResponse) {
    const { group, recipient } = payload;

    const ROOM_NAME = `group-${group.id}`;
    const recipientSocket = this._appGateway._sessions.getUserSocket(
      recipient.id,
    );

    this._appGateway.server.to(ROOM_NAME).emit('onGroupReceivedNewUser', group);

    if (recipientSocket) recipientSocket.emit('onGroupUserAdd', group);
  }

  @OnEvent(ServerGroupRecipientEvent.GROUP_USER_REMOVE)
  handleGroupUserRemove(payload: TRemoveRecipientToGroupResponse) {
    const { group, recipient } = payload;
    const recipientSocket = this._appGateway._sessions.getUserSocket(
      recipient.id,
    );

    const ROOM_NAME = `group-${group.id}`;

    this._appGateway.server.to(ROOM_NAME).emit('onGroupReceivedRemoved', group);

    if (recipientSocket) {
      recipientSocket.emit('onGroupUserRemoved', group);
      recipientSocket.leave(ROOM_NAME);
    }
  }
}
