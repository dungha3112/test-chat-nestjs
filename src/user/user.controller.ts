import { Controller, Get, Inject, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Routes, Services } from 'src/utils/constants';
import { IUserService } from 'src/utils/interfaces';

@Controller(Routes.USER)
export class UserController {
  constructor(
    @Inject(Services.USER) private readonly _userService: IUserService,
  ) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Get('search')
  async search(@Query('query') query: string) {
    return await this._userService.searchUser(query);
  }
}
