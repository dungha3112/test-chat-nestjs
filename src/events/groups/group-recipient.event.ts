import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/gateway/gateway';
import { ServerGroupRecipientEvent, Services } from 'src/utils/constants';
import {
  TAddRecipientToGroupResponse,
  TRemoveRecipientToGroupResponse,
} from 'src/utils/types';

@Injectable()
export class GroupRecipientEvent {
  constructor(private readonly _appAppGateway: AppGateway) {}

  @OnEvent(ServerGroupRecipientEvent.GROUP_USER_ADD)
  handleGroupUserAdd(payload: TAddRecipientToGroupResponse) {
    const { group, recipient } = payload;

    const ROOM_NAME = `group-${group.id}`;
    this._appAppGateway.server
      .to(ROOM_NAME)
      .emit('onGroupReceivedNewUser', group);
    const recipientSocket = this._appAppGateway._sessions.getUserSocket(
      recipient.id,
    );
    if (recipientSocket) recipientSocket.emit('onGroupUserAdd', group);
  }

  @OnEvent(ServerGroupRecipientEvent.GROUP_USER_ADD)
  handleGroupUserRemove(payload: TRemoveRecipientToGroupResponse) {
    const { group, recipient } = payload;

    const ROOM_NAME = `group-${group.id}`;
    this._appAppGateway.server
      .to(ROOM_NAME)
      .emit('onGroupReceivedRemoved', group);
    const recipientSocket = this._appAppGateway._sessions.getUserSocket(
      recipient.id,
    );
    if (recipientSocket) {
      recipientSocket.emit('onGroupUserRemoved', group);
      recipientSocket.leave(ROOM_NAME);
    }
  }
}
