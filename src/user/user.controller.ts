import { Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Routes, Services } from 'src/utils/constants';
import { IUserService } from 'src/utils/interfaces';

@SkipThrottle()
@Controller(Routes.USER)
export class UserController {
  constructor(
    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  @Get('search')
  async search(@Query('query') query: string) {
    return await this._userService.searchUser(query);
  }
}
