import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Routes, ConversationEvents, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import {
  ApiConversationCreateDoc,
  ApiFindConversationById,
  ApiUserGetConversaionDoc,
} from 'src/utils/swaggers';
import { User } from 'src/utils/typeorm';
import { ConversationCreateDto } from '../dtos/conversations/conversation-create.dto';
import { ConverstionResDto } from '../dtos';
import { IConversationService } from '../interfaces/conversation.interface';

@ApiBearerAuth()
@ApiTags(Routes.CONVERSATION)
@Controller(Routes.CONVERSATION)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATION)
    private readonly _conversationService: IConversationService,

    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @ApiConversationCreateDoc()
  async createNewConversation(
    @AuthUser() creator: User,
    @Body() conversationCreateDto: ConversationCreateDto,
  ) {
    const params = { ...conversationCreateDto, creator };
    const newConversation =
      await this._conversationService.createNewConversation(params);

    this._eventEmitter.emit(
      ConversationEvents.CONVERSATION_CREATE,
      newConversation,
    );

    return newConversation;
  }

  @Get()
  @ApiUserGetConversaionDoc()
  async userGetConversations(@AuthUser() user: User) {
    const conversations = await this._conversationService.userGetConversations(
      user.id,
    );

    return conversations;
  }

  @Get(':id')
  @ApiFindConversationById()
  async findGrouById(@Param('id') id: string) {
    const res = await this._conversationService.findConversationById(id);

    return res;
  }
}
