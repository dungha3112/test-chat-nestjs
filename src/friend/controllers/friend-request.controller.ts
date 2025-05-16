import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IFriendRequestService } from 'src/utils/interfaces/friend-request.interface';
import { User } from 'src/utils/typeorm';
import { FriendRequestCreateDto } from '../dtos/friend-request';

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

  @Patch(':id/accept')
  async acceptRequest(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const params = { id, userId };
    const res = await this._friendRequestService.acceptById(params);

    return res;
  }

  // receiver delete
  @Delete(':id/delete')
  async deleteRequest(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const params = { id, userId };
    const res = await this._friendRequestService.deleteById(params);

    return res;
  }

  @Patch(':id/reject')
  async rejectRequest(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const params = { id, userId };

    const res = await this._friendRequestService.rejectById(params);
    return res;
  }
}
