import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CreateNewMessageGroupDto,
  DeleteMessageGroupResDto,
  GetMessagesGroupResponseDto,
  UpdateMessageGroupResDto,
} from 'src/group/dtos';
import { GroupMessageCreateDto } from 'src/group/dtos/messages/group-message-create.dto';
import { GroupMessageEditDto } from 'src/group/dtos/messages/group-message-edit.dto';

export function ApiGroupMessageCreateDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new group message' }),
    ApiBody({ type: GroupMessageCreateDto }),
    ApiResponse({
      status: 201,
      description: 'The message has been successfully created.',
      type: CreateNewMessageGroupDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request.' }),
  );
}

export function ApiGroupMessagesGetDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get messages by group ID' }),
    ApiParam({ name: 'id', description: 'Group ID', type: String }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'limit number',
    }),
    ApiResponse({
      status: 200,
      description: 'List of messages',
      type: GetMessagesGroupResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request.' }),
  );
}

export function ApiUpdateGroupMessageByGroupIdAndMessageIdDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a message by ID' }),
    ApiParam({ name: 'id', description: 'Group ID' }),
    ApiParam({ name: 'messageId', description: 'Message ID' }),
    ApiBody({ type: GroupMessageEditDto }),
    ApiResponse({
      status: 200,
      description: 'Updated message',
      type: UpdateMessageGroupResDto,
    }),
    ApiResponse({ status: 404, description: 'Message not found' }),
  );
}

export function ApiDeleteGroupMessageByGroupIdAndMessageIdDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a message by ID' }),
    ApiParam({ name: 'id', description: 'Group ID' }),
    ApiParam({ name: 'messageId', description: 'Message ID' }),
    ApiResponse({
      status: 200,
      description: 'Deleted message',
      type: DeleteMessageGroupResDto,
    }),
    ApiResponse({ status: 404, description: 'Message not found' }),
  );
}
