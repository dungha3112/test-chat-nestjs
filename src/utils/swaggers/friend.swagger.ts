import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FriendResDto, GetFriendsResDto } from 'src/friend/dtos/friends';

//ApiGetFriendsDoc
export function ApiGetFriendsDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get friends' }),
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
      description: 'List friends',
      type: GetFriendsResDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
  );
}

//ApiSearchFriendsDoc
export function ApiSearchFriendsDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Search friends' }),
    ApiQuery({
      name: 'query',
      required: true,
      type: String,
      description: 'username query',
    }),

    ApiResponse({
      status: 200,
      description: 'List friends',
      isArray: true,
      type: FriendResDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
  );
}

//ApiDeleteFriendDoc
export function ApiDeleteFriendDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Search friends' }),
    ApiParam({ name: 'id', description: 'Friend ID' }),
    ApiResponse({
      status: 200,
      description: 'List friends',
      isArray: true,
      type: FriendResDto,
    }),
    ApiResponse({ status: 400, description: 'Bad request' }),
  );
}
