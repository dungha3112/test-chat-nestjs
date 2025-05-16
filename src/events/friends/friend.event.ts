import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/gateway/gateway';
import { FriendEvents } from 'src/utils/constants';
import { Friend } from 'src/utils/typeorm';

@Injectable()
export class FriendEvent {
  constructor(private readonly _appGateway: AppGateway) {}

  @OnEvent(FriendEvents.USER_DELETE_FRIEND)
  handleUserDeleteFriend(payload) {
    const { userId, friend }: { userId: string; friend: Friend } = payload;

    const receiverId =
      userId === friend.receiver.id ? friend.sender.id : friend.receiver.id;

    const receiverSocket = this._appGateway._sessions.getUserSocket(receiverId);
    receiverSocket && receiverSocket.emit('onFriendDelete', friend);
  }
}
