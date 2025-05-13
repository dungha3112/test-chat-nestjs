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
import { Routes, ServerGroupMessageEvent, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IGroupMessageService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { GroupMessageCreateDto } from '../dtos/group-message-create.dto';
import { GroupMessageEditDto } from '../dtos/group-message-edit.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TMessageGroupPayload } from 'src/utils/types';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateNewMessageGroupDto,
  DeleteMessageGroupResDto,
  GetMessagesGroupResponseDto,
  UpdateMessageGroupResDto,
} from '../dtos';

@ApiTags(Routes.GROUP_MESSAGE)
@Controller(Routes.GROUP_MESSAGE)
export class GroupMessageController {
  constructor(
    @Inject(Services.GROUP_MESSAGE)
    private readonly _groupMessageService: IGroupMessageService,
    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Create a new group message' })
  @ApiBody({ type: GroupMessageCreateDto })
  @ApiResponse({
    status: 201,
    description: 'The message has been successfully created.',
    type: CreateNewMessageGroupDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async createNewGroupMessage(
    @AuthUser() author: User,
    @Param('id') id: string,
    @Body() { content }: GroupMessageCreateDto,
  ) {
    const params = { author, id, content };

    const res = await this._groupMessageService.createMessageGroup(params);

    const payload: TMessageGroupPayload = {
      groupId: res.group.id,
      message: res.message,
    };
    this._eventEmitter.emit(
      ServerGroupMessageEvent.GROUP_MESSAGE_CREATE,
      payload,
    );
    return res;
  }

  // api/group/:id/message
  @Get()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Get messages by group ID' })
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
    type: GetMessagesGroupResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async getMessagesByGroupId(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const params = { id, page, limit };

    return await this._groupMessageService.getMessagesByGroupId(params);
  }

  // api/group/:id/message/:messageId
  @Patch(':messageId')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Update a message by ID' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiParam({ name: 'messageId', description: 'Message ID' })
  @ApiBody({ type: GroupMessageEditDto })
  @ApiResponse({
    status: 200,
    description: 'Updated message',
    type: UpdateMessageGroupResDto,
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async updateMessageById(
    @AuthUser() { id: authorId }: User,
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Body() { content }: GroupMessageEditDto,
  ) {
    const params = { authorId, id, messageId, content };
    const message = await this._groupMessageService.editMessage(params);

    const payload: TMessageGroupPayload = { groupId: id, message: message };
    this._eventEmitter.emit(
      ServerGroupMessageEvent.GROUP_MESSAGE_EDIT,
      payload,
    );

    return { groupId: id, message };
  }

  // api/group/:id/message/:messageId
  @Delete(':messageId')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Delete a message by ID' })
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiParam({ name: 'messageId', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'Deleted message',
    type: DeleteMessageGroupResDto,
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async deleteMessageById(
    @AuthUser() { id: authorId }: User,
    @Param('id') id: string,
    @Param('messageId') messageId: string,
  ) {
    const params = { authorId, id, messageId };

    const message =
      await this._groupMessageService.deleteMessageGroupById(params);

    const payload: TMessageGroupPayload = { groupId: id, message };
    this._eventEmitter.emit(
      ServerGroupMessageEvent.GROUP_MESSAGE_DELETE,
      payload,
    );
    return { groupId: id, message };
  }
}
