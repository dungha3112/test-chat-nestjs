import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Routes, Services } from 'src/utils/constants';
import { UserResponseDto } from './dtos';
import { IUserService } from './user.interface';

@ApiTags(Routes.USER)
@ApiBearerAuth()
@Controller(Routes.USER)
export class UserController {
  constructor(
    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  @Get('search')
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
