import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IFriendService } from 'src/utils/interfaces';
import { User } from 'src/utils/typeorm';

@Controller(Routes.FRIEND)
export class FriendController {
  constructor(
    @Inject(Services.FRIEND) private readonly _friendService: IFriendService,
  ) {}

  @Get()
  async getFriends(
    @AuthUser() { id: userId }: User,

    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const params = { userId, page, limit };
    return await this._friendService.getFriends(params);
  }

  @Get('search')
  async searchFriend(@Query('query') query: string) {
    return await this._friendService.searchFriend(query);
  }

  @Delete(':id/delete')
  async deleteFriend(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const params = { id, userId };

    const friend = await this._friendService.deleteFriendById(params);

    return friend;
  }
}
