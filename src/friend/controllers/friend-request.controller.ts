import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FriendRequestEvents, Routes, Services } from 'src/utils/constants';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { IFriendRequestService } from 'src/friend/interfaces/friend-request.interface';
import { User } from 'src/utils/typeorm';
import { FriendRequestCreateDto } from '../dtos/friend-request';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiAcceptRequestDoc,
  ApiCreateNewRequestDoc,
  ApiDeleteRequestDoc,
  ApiGetFriendsRequestDoc,
  ApiRejectRequestDoc,
} from 'src/utils/swaggers';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TFriendRequestStatusType } from '../types/friend-request.type';

@ApiBearerAuth()
@ApiTags(Routes.FRIEND_REQUEST)
@Controller(Routes.FRIEND_REQUEST)
export class FriendRequestController {
  constructor(
    @Inject(Services.FRIEND_REQUEST)
    private readonly _friendRequestService: IFriendRequestService,

    private readonly _eventEmitter: EventEmitter2,
  ) {}

  @Get()
  @ApiGetFriendsRequestDoc()
  async getFriendsRequest(
    @AuthUser() { id: userId }: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status: TFriendRequestStatusType,
  ) {
    const params = { userId, page, limit, status };
    return await this._friendRequestService.getRequests(params);
  }

  @Post()
  @ApiCreateNewRequestDoc()
  async createNewRequest(
    @AuthUser() sender: User,
    @Body() { receiverId }: FriendRequestCreateDto,
  ) {
    const params = { receiverId, sender };
    const newRequest = await this._friendRequestService.create(params);

    this._eventEmitter.emit(
      FriendRequestEvents.FRIEND_REQUEST_CREATE,
      newRequest,
    );

    return newRequest;
  }

  @Patch(':id/accept')
  @ApiAcceptRequestDoc()
  async acceptRequest(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const params = { id, userId };
    const res = await this._friendRequestService.acceptById(params);
    this._eventEmitter.emit(FriendRequestEvents.FRIEND_REQUEST_ACCEPT, res);

    return res;
  }

  // receiver delete
  @Delete(':id/delete')
  @ApiDeleteRequestDoc()
  async deleteRequest(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const params = { id, userId };
    const res = await this._friendRequestService.deleteById(params);

    this._eventEmitter.emit(FriendRequestEvents.SENDER_DELETE_REQUEST, res);
    return res;
  }

  @Patch(':id/reject')
  @ApiRejectRequestDoc()
  async rejectRequest(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const params = { id, userId };

    const res = await this._friendRequestService.rejectById(params);
    this._eventEmitter.emit(FriendRequestEvents.RECEIVER_REJECT_REQUEST, res);

    return res;
  }
}
