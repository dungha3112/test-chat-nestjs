import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Routes, Services } from 'src/utils/constants';
import { IUserService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';
import { UserResponseDto } from './dtos';

@ApiTags(Routes.USER)
@Controller(Routes.USER)
export class UserController {
  constructor(
    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  @Get('search')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Get messages by conversation ID' })
  @ApiQuery({
    name: 'query',
    required: true,
    type: String,
    description: 'username string',
  })
  @ApiResponse({
    status: 200,
    description: 'List of messages',
    type: UserResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async search(@Query('query') query: string) {
    return await this._userService.searchUser(query);
  }
}
