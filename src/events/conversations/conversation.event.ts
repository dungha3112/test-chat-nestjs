import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/gateway/gateway';
import { ServerConversationEvent } from 'src/utils/constants';
import { Conversation } from 'src/utils/typeorm';

@Injectable()
export class ConversationEvent {
  constructor(private readonly _appAppGateway: AppGateway) {}

  @OnEvent(ServerConversationEvent.CONVERSATION_CREATE)
  handleConversationCreateEvent(payload: Conversation) {
    const recipientSocket = this._appAppGateway._sessions.getUserSocket(
      payload.recipient.id,
    );

    if (recipientSocket) recipientSocket.emit('onConversationCreate', payload);
  }
}
