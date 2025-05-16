import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/gateway/gateway';
import { ConversationEvents } from 'src/utils/constants';
import { Conversation } from 'src/utils/typeorm';

@Injectable()
export class ConversationEvent {
  constructor(private readonly _appGateway: AppGateway) {}

  @OnEvent(ConversationEvents.CONVERSATION_CREATE)
  handleConversationCreateEvent(payload: Conversation) {
    const recipientSocket = this._appGateway._sessions.getUserSocket(
      payload.recipient.id,
    );

    if (recipientSocket) recipientSocket.emit('onConversationCreate', payload);
  }
}
