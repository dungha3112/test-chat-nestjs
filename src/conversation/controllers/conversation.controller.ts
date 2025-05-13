import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Routes, ServerConversationEvent, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { Conversation, User } from 'src/utils/typeorm';
import { ConversationCreateDto } from '../dtos/conversation-create.dto';
import { Throttle } from '@nestjs/throttler';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IConversationService } from 'src/utils/interfaces';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ConverstionResDto } from '../dtos';

@ApiTags(Routes.CONVERSATION)
@Controller(Routes.CONVERSATION)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATION)
    private readonly _conversationService: IConversationService,

    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create new a conversation' })
  @ApiBody({ type: ConversationCreateDto })
  @ApiResponse({
    status: 201,
    description: 'Create new conversation successfully',
    type: ConverstionResDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
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

  @Get()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Get conversations' })
  @ApiResponse({
    status: 201,
    description: 'Get conversations',
    type: ConverstionResDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Error server' })
  async userGetConversations(@AuthUser() user: User) {
    const conversations = await this._conversationService.userGetConversations(
      user.id,
    );

    return conversations;
  }

  @Get(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Get a conversation by id' })
  @ApiParam({ name: 'id', description: 'Group ID', type: String })
  @ApiResponse({
    status: 201,
    description: 'Get conversation successfully',
    type: ConverstionResDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async findGrouById(@Param('id') id: string) {
    return await this._conversationService.findConversationById(id);
  }
}
