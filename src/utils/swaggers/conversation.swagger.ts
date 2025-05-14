import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  ConversationCreateDto,
  ConverstionResDto,
} from 'src/conversation/dtos';

export function ApiConversationCreateDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new a conversation' }),
    ApiBody({ type: ConversationCreateDto }),
    ApiResponse({
      status: 201,
      description: 'Create new conversation successfully',
      type: ConverstionResDto,
    }),
    ApiResponse({ status: 400, description: 'Validation failed' }),
  );
}

export function ApiUserGetConversaionDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get conversations' }),
    ApiResponse({
      status: 201,
      description: 'Get conversations',
      type: ConverstionResDto,
      isArray: true,
    }),
    ApiResponse({ status: 400, description: 'Error server' }),
  );
}

export function ApiFindConversationById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a conversation by id' }),
    ApiParam({ name: 'id', description: 'Group ID', type: String }),
    ApiResponse({
      status: 201,
      description: 'Get conversation successfully',
      type: ConverstionResDto,
    }),
    ApiResponse({ status: 400, description: 'Validation failed' }),
  );
}
