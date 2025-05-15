import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IFriendRequestService } from 'src/utils/interfaces/friend-request.interface';
import { User } from 'src/utils/typeorm';
import { FriendRequestCreateDto } from '../dtos/friend-request/friend-request.dto';

@Controller(Routes.FRIEND_REQUEST)
export class FriendRequestController {
  constructor(
    @Inject(Services.FRIEND_REQUEST)
    private readonly _friendRequestService: IFriendRequestService,
  ) {}

  @Post()
  async createNewRequest(
    @AuthUser() sender: User,
    @Body() { receiverId }: FriendRequestCreateDto,
  ) {
    const params = { receiverId, sender };
    const newRequest = await this._friendRequestService.create(params);

    return newRequest;
  }
}
