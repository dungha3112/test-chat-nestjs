import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  Routes,
  ServerConverMessageEvent,
  Services,
} from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IConversationMessageService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { ConverMessageCreateDto } from '../dtos/conversation-message.create';
import { ConverMessageEditDto } from '../dtos/conversation-message-edit.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TMessageConverPayload } from 'src/utils/types';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateConversationResponseDto,
  DeleteMessageConverResponseDto,
  GetMessagesConversationResponseDto,
  UpdateMessageConverResponseDto,
} from '../dtos';

@ApiBearerAuth()
@ApiTags(Routes.CONVERSATION_MESSAGE)
@Controller(Routes.CONVERSATION_MESSAGE)
export class ConversationMessageController {
  constructor(
    @Inject(Services.CONVERSATION_MESSAGE)
    private readonly _converMessageService: IConversationMessageService,

    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new conversation message' })
  @ApiBody({ type: ConverMessageCreateDto })
  @ApiParam({ name: 'id', description: 'Group ID', type: String })
  @ApiResponse({
    status: 201,
    description: 'Message created successfully',
    type: CreateConversationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  async createNewConverMessage(
    @AuthUser() author: User,
    @Param('id') id: string,
    @Body() { content }: ConverMessageCreateDto,
  ) {
    const params = { author, id, content };

    const res = await this._converMessageService.createMessageConver(params);

    const payload: TMessageConverPayload = {
      conversationId: id,
      message: res.message,
    };
    this._eventEmitter.emit(
      ServerConverMessageEvent.CONVER_MESSAGE_CREATE,
      payload,
    );

    return res;
  }
  // api/conversation/:id/message
  @Get()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Get messages by conversation ID' })
  @ApiParam({ name: 'id', description: 'Group ID', type: String })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Messages per page',
  })
  @ApiResponse({
    status: 200,
    description: 'List of messages',
    type: GetMessagesConversationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async getMessagesByGroupId(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const params = { id, page, limit };

    return await this._converMessageService.getMessagesByConverId(params);
  }

  // api/conversation/:id/message/messageId
  @Patch(':messageId')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Edit a conversation message by ID' })
  @ApiParam({ name: 'id', description: 'Group ID', type: String })
  @ApiParam({ name: 'messageId', description: 'message ID', type: String })
  @ApiBody({ type: ConverMessageEditDto })
  @ApiResponse({
    status: 200,
    description: 'Message updated successfully',
    type: UpdateMessageConverResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateMessageById(
    @AuthUser() { id: authorId }: User,
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Body() { content }: ConverMessageEditDto,
  ) {
    const params = { authorId, id, messageId, content };
    const message = await this._converMessageService.editMessage(params);

    const payload: TMessageConverPayload = {
      conversationId: id,
      message,
    };
    this._eventEmitter.emit(
      ServerConverMessageEvent.CONVER_MESSAGE_EDIT,
      payload,
    );

    return {
      conversationId: id,
      message,
    };
  }

  // api/conversation/:id/message/messageId
  @Delete(':messageId')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete a conversation message by ID' })
  @ApiParam({ name: 'id', description: 'Group ID', type: String })
  @ApiParam({ name: 'messageId', description: 'message ID', type: String })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully',
    type: DeleteMessageConverResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async deleteMessageById(
    @AuthUser() { id: authorId }: User,
    @Param('id') id: string,
    @Param('messageId') messageId: string,
  ) {
    const params = { authorId, id, messageId };

    const message =
      await this._converMessageService.deleteMessageConverById(params);

    const payload: TMessageConverPayload = {
      conversationId: id,
      message: message,
    };
    this._eventEmitter.emit(
      ServerConverMessageEvent.CONVER_MESSAGE_DELETE,
      payload,
    );

    return {
      conversationId: id,
      message,
    };
  }
}
