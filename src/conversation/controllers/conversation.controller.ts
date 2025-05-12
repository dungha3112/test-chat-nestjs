import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IConversationService } from 'src/utils/interfaces/conversation.interface';
import { User } from 'src/utils/typeorm';
import { ConversationCreateDto } from '../dtos/conversation-create.dto';

@Controller(Routes.CONVERSATION)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATION)
    private readonly _conversationService: IConversationService,
  ) {}

  @Post()
  async createNewConversation(
    @AuthUser() creator: User,
    @Body() conversationCreateDto: ConversationCreateDto,
  ) {
    const params = { ...conversationCreateDto, creator };
    const newConversation =
      await this._conversationService.createNewConversation(params);
    return newConversation;
  }
}
