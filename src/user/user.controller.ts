import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Routes, Services } from 'src/utils/constants';
import { IUserService } from 'src/utils/interfaces';
import { UserResponseDto } from './dtos';

@ApiTags(Routes.USER)
@ApiBearerAuth()
@Controller(Routes.USER)
export class UserController {
  constructor(
    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  @Get('search')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Search user by username ' })
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
