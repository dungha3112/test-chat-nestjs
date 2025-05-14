import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  ConverMessageCreateDto,
  ConverMessageEditDto,
  CreateConversationResponseDto,
  DeleteMessageConverResponseDto,
  GetMessagesConversationResponseDto,
  UpdateMessageConverResponseDto,
} from 'src/conversation/dtos';

export function ApiConverMessageCreateDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new conversation message' }),
    ApiBody({ type: ConverMessageCreateDto }),
    ApiParam({ name: 'id', description: 'Group ID', type: String }),
    ApiResponse({
      status: 201,
      description: 'Message created successfully',
      type: CreateConversationResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Validation failed' }),
  );
}

export function ApiGetConverMessagesByCorverIdDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get messages by conversation ID' }),
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
      description: 'Messages per page',
    }),
    ApiResponse({
      status: 200,
      description: 'List of messages',
      type: GetMessagesConversationResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
  );
}

export function ApiPatchConverMessageByConverIdAndMessageIdDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Edit a conversation message by ID' }),
    ApiParam({ name: 'id', description: 'Group ID', type: String }),
    ApiParam({ name: 'messageId', description: 'message ID', type: String }),
    ApiBody({ type: ConverMessageEditDto }),
    ApiResponse({
      status: 200,
      description: 'Message updated successfully',
      type: UpdateMessageConverResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
  );
}

export function ApiDeleteConverMessageByConverIdAndMessageIdDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a conversation message by ID' }),
    ApiParam({ name: 'id', description: 'Group ID', type: String }),
    ApiParam({ name: 'messageId', description: 'message ID', type: String }),
    ApiResponse({
      status: 200,
      description: 'Message deleted successfully',
      type: DeleteMessageConverResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
  );
}
