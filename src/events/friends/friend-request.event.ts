import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/gateway/gateway';
import { FriendRequestEvents } from 'src/utils/constants';
import { FriendRequest } from 'src/utils/typeorm';
import { TFriendRequestAcceptedRes } from 'src/utils/types';

@Injectable()
export class FriendRequestEvent {
  constructor(private readonly _appGateway: AppGateway) {}

  @OnEvent(FriendRequestEvents.FRIEND_REQUEST_CREATE)
  handleCreateFriendRequest(payload: FriendRequest) {
    const { receiver } = payload;

    const receiverRequestSocket = this._appGateway._sessions.getUserSocket(
      receiver.id,
    );

    if (receiverRequestSocket)
      receiverRequestSocket.emit('onFriendRequestReceived', payload);
  }

  @OnEvent(FriendRequestEvents.FRIEND_REQUEST_ACCEPT)
  handleReceiverAcceptRequest(payload: TFriendRequestAcceptedRes) {
    const { friend, friendRequest } = payload;

    const senderSocket = this._appGateway._sessions.getUserSocket(
      friendRequest.sender.id,
    );
    if (senderSocket) senderSocket.emit('onFriendRequestAccepted', payload);
  }

  @OnEvent(FriendRequestEvents.SENDER_DELETE_REQUEST)
  handleSenderDeleteRequest(payload: FriendRequest) {
    const receiverRequestSocket = this._appGateway._sessions.getUserSocket(
      payload.receiver.id,
    );
    if (receiverRequestSocket)
      receiverRequestSocket.emit('onFriendRequestDeleted', payload);
  }

  @OnEvent(FriendRequestEvents.RECEIVER_REJECT_REQUEST)
  handleReceiverRejectRequest(payload: FriendRequest) {
    const senderSocket = this._appGateway._sessions.getUserSocket(
      payload.sender.id,
    );
    if (senderSocket) senderSocket.emit('onFriendRequestRejected', payload);
  }
}
