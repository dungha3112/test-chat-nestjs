import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppGateway } from 'src/gateway/gateway';
import { ServerConverMessageEvent, Services } from 'src/utils/constants';
import { IConversationService } from 'src/utils/interfaces';
import { TMessageConverPayload } from 'src/utils/types';

@Injectable()
export class ConversationMessageEvent {
  constructor(
    private readonly _appGateway: AppGateway,
    @Inject(Services.CONVERSATION)
    private readonly _conversationService: IConversationService,
  ) {}

  @OnEvent(ServerConverMessageEvent.CONVER_MESSAGE_CREATE)
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
}
