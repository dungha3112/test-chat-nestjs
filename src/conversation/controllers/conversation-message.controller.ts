import { Controller, Inject } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { IConversationMessageService } from 'src/utils/interfaces';

@Controller(Routes.CONVERSATION_MESSAGE)
export class ConversationMessageController {
  constructor(
    @Inject(Services.CONVERSATION_MESSAGE)
    private readonly _conversationMessageService: IConversationMessageService,
  ) {}
}
