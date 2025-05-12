import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Routes, ServerConversationEvent, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IConversationService } from 'src/utils/interfaces/conversation.interface';
import { User } from 'src/utils/typeorm';
import { ConversationCreateDto } from '../dtos/conversation-create.dto';
import { Throttle } from '@nestjs/throttler';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.CONVERSATION)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATION)
    private readonly _conversationService: IConversationService,

    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  async createNewConversation(
    @AuthUser() creator: User,
    @Body() conversationCreateDto: ConversationCreateDto,
  ) {
    const params = { ...conversationCreateDto, creator };
    const newConversation =
      await this._conversationService.createNewConversation(params);

    this._eventEmitter.emit(
      ServerConversationEvent.CONVERSATION_CREATE,
      newConversation,
    );
    return newConversation;
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get()
  async userGetConversations(@AuthUser() user: User) {
    const conversations = await this._conversationService.userGetConversations(
      user.id,
    );

    return conversations;
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get(':id')
  async findGrouById(@Param('id') id: string) {
    return await this._conversationService.findConversationById(id);
  }
}
