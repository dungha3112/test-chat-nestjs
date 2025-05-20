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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FriendEvents, Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';

import {
  ApiDeleteFriendDoc,
  ApiGetFriendsDoc,
  ApiSearchFriendsDoc,
} from 'src/utils/swaggers';
import { User } from 'src/utils/typeorm';
import { IFriendService } from '../interfaces/friend.interface';

@ApiBearerAuth()
@ApiTags(Routes.FRIEND)
@Controller(Routes.FRIEND)
export class FriendController {
  constructor(
    @Inject(Services.FRIEND) private readonly _friendService: IFriendService,

    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @ApiGetFriendsDoc()
  async getFriends(
    @AuthUser() { id: userId }: User,

    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const params = { userId, page, limit };
    return await this._friendService.getFriends(params);
  }

  @Get('search')
  @ApiSearchFriendsDoc()
  async searchFriend(@Query('query') query: string) {
    return await this._friendService.searchFriend(query);
  }

  @Delete(':id/delete')
  @ApiDeleteFriendDoc()
  async deleteFriend(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const params = { id, userId };

    const friend = await this._friendService.deleteFriendById(params);

    this._eventEmitter.emit(FriendEvents.USER_DELETE_FRIEND, {
      friend,
      userId,
    });

    return friend;
  }
}
