import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  AcceptRequestDto,
  FriendRequestCreateDto,
  FriendRequestResDto,
  GetFriendsRequestResDto,
} from 'src/friend/dtos/friend-request';

//ApiGetFriendsRequestDoc
export function ApiGetFriendsRequestDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get list friends request' }),
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
    ApiQuery({
      name: 'status',
      required: true,
      description: 'status string',
    }),
    ApiResponse({
      status: 200,
      description: 'List friends request',
      type: GetFriendsRequestResDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
  );
}

//ApiCreateNewRequestDoc
export function ApiCreateNewRequestDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create new request' }),
    ApiBody({ type: FriendRequestCreateDto }),
    ApiResponse({
      status: 201,
      description: 'create new request successfully created.',
      type: FriendRequestResDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request.' }),
  );
}

//ApiAcceptRequestDoc
export function ApiAcceptRequestDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Accept request ' }),
    ApiParam({ name: 'id', description: 'Friend request id' }),
    ApiResponse({
      status: 200,
      description: 'Accepted request successfully.',
      type: AcceptRequestDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
  );
}

// ApiDeleteRequestDoc
export function ApiDeleteRequestDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete request ' }),
    ApiParam({ name: 'id', description: 'Friend request id' }),
    ApiResponse({
      status: 200,
      description: 'Deleted request successfully.',
      type: FriendRequestResDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
  );
}

// ApiRejectRequestDoc
export function ApiRejectRequestDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Reject request ' }),
    ApiParam({ name: 'id', description: 'Friend request id' }),
    ApiResponse({
      status: 200,
      description: 'Reject request successfully.',
      type: FriendRequestResDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
  );
}
