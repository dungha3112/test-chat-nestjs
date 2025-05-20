import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IConversationService } from 'src/conversation/interfaces/conversation.interface';
import { TMessageConverPayload } from 'src/conversation/types/conversation-message.type';
import { AppGateway } from 'src/gateway/gateway';
import { ConverMessageEvents, Services } from 'src/utils/constants';

@Injectable()
export class ConversationMessageEvent {
  constructor(
    private readonly _appGateway: AppGateway,
    @Inject(Services.CONVERSATION)
    private readonly _conversationService: IConversationService,
  ) {}

  @OnEvent(ConverMessageEvents.CONVER_MESSAGE_CREATE)
  async handleConverMessageCreateEvent(payload: TMessageConverPayload) {
    const { conversationId, message } = payload;
    const conversation =
      await this._conversationService.findConversationById(conversationId);

    const recipientSocket =
      message.author.id === conversation.creator.id
        ? this._appGateway._sessions.getUserSocket(conversation.recipient.id)
        : this._appGateway._sessions.getUserSocket(conversation.creator.id);

    if (recipientSocket)
      recipientSocket.emit('onConverMessageCreate', { conversation, message });
  }

  @OnEvent(ConverMessageEvents.CONVER_MESSAGE_EDIT)
  async handleConverMessageEditEvent(payload: TMessageConverPayload) {
    const { conversationId, message } = payload;
    const conversation =
      await this._conversationService.findConversationById(conversationId);

    const recipientSocket =
      message.author.id === conversation.creator.id
        ? this._appGateway._sessions.getUserSocket(conversation.recipient.id)
        : this._appGateway._sessions.getUserSocket(conversation.creator.id);

    if (recipientSocket)
      recipientSocket.emit(`onMessageEdit`, { conversation, message });
  }

  @OnEvent(ConverMessageEvents.CONVER_MESSAGE_DELETE)
  async handleConverMessageDeleteEvent(payload: TMessageConverPayload) {
    const { conversationId, message } = payload;
    const conversation =
      await this._conversationService.findConversationById(conversationId);

    const recipientSocket =
      message.author.id === conversation.creator.id
        ? this._appGateway._sessions.getUserSocket(conversation.recipient.id)
        : this._appGateway._sessions.getUserSocket(conversation.creator.id);

    if (recipientSocket)
      recipientSocket.emit(`onMessageDelete`, { conversation, message });
  }
}
