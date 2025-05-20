import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { FriendRequest } from 'src/utils/typeorm';

import { Brackets, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { IFriendRequestService } from '../interfaces/friend-request.interface';
import { IUserService } from 'src/user/user.interface';
import { IFriendService } from '../interfaces/friend.interface';
import {
  TCreateFriendRequestParams,
  TFriendRequestAcceptedRes,
  TFriendRequestParams,
  TGetFriendRequestParams,
  TGetFriendsRequestResponse,
} from '../types/friend-request.type';

@Injectable()
export class FriendReuestService implements IFriendRequestService {
  constructor(
    @Inject(Services.USER) private readonly _userService: IUserService,

    @InjectRepository(FriendRequest)
    private readonly _friendRequestRepository: Repository<FriendRequest>,

    @Inject(forwardRef(() => Services.FRIEND))
    private readonly _friendService: IFriendService,
  ) {}

  async getRequests(
    params: TGetFriendRequestParams,
  ): Promise<TGetFriendsRequestResponse> {
    const { userId, limit, page, status } = params;

    const query = await this._friendRequestRepository
      .createQueryBuilder('friendRequest')
      .leftJoinAndSelect('friendRequest.sender', 'sender')
      .leftJoinAndSelect('friendRequest.receiver', 'receiver')

      .where(
        new Brackets((qb) => {
          qb.where('sender.id = :userId', { userId }).orWhere(
            'receiver.id = :userId',
            { userId },
          );
        }),
      );

    if (status) {
      query.andWhere('friendRequest.status = :status', { status });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      userId,
      friendsRequest: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(params: TCreateFriendRequestParams): Promise<FriendRequest> {
    const { receiverId, sender } = params;
    if (!isUUID(receiverId)) {
      throw new HttpException(
        `Invalid UUID format receiverId`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const receiver = await this._userService.findOne({
      options: { selectAll: false },
      params: { id: receiverId },
    });
    if (!receiver)
      throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);

    const isFriend = await this._friendService.isFriend(sender.id, receiverId);
    if (isFriend)
      throw new HttpException(
        'They are friends, Can not send friend request.',
        HttpStatus.BAD_REQUEST,
      );

    if (sender.id === receiverId)
      throw new HttpException(
        'Can not send friend request with myself',
        HttpStatus.BAD_REQUEST,
      );

    const requestExist = await this.findOneRequest(sender.id, receiverId);
    if (requestExist) {
      if (requestExist.status === 'pending')
        throw new HttpException(
          'Friend Requesting Pending',
          HttpStatus.BAD_REQUEST,
        );

      if (requestExist.status === 'rejected')
        throw new HttpException(
          'Friend Requesting rejected',
          HttpStatus.BAD_REQUEST,
        );
    }

    const newRequest = this._friendRequestRepository.create({
      receiver,
      sender,
      status: 'pending',
    });

    return await this.saveFriendRequest(newRequest);
  }

  async acceptById(
    params: TFriendRequestParams,
  ): Promise<TFriendRequestAcceptedRes> {
    const { userId, id } = params;
    const request = await this.findfRequestById(id);

    if (request.status == 'accepted')
      throw new HttpException(
        'Friend Request Already Accepted',
        HttpStatus.BAD_REQUEST,
      );

    if (request.receiver.id !== userId)
      throw new HttpException(
        'Can not accepted friends request from myself',
        HttpStatus.BAD_REQUEST,
      );

    request.status = 'accepted';
    const updateRequest = await this.saveFriendRequest(request);

    const newFriend = await this._friendService.createNewFriend({
      sender: request.sender,
      receiver: request.receiver,
    });

    return { friend: newFriend, friendRequest: updateRequest };
  }

  async rejectById(params: TFriendRequestParams): Promise<FriendRequest> {
    const { id, userId } = params;
    const request = await this.findfRequestById(id);

    if (request.status == 'accepted')
      throw new HttpException(
        'Friend Request Already Accepted',
        HttpStatus.BAD_REQUEST,
      );

    if (request.receiver.id !== userId)
      throw new HttpException(
        'Can not rejected friends request from myself',
        HttpStatus.BAD_REQUEST,
      );

    request.status = 'rejected';
    return await this.saveFriendRequest(request);
  }

  async deleteById(params: TFriendRequestParams): Promise<FriendRequest> {
    const { id, userId } = params;
    const request = await this.findfRequestById(id);

    if (request.status == 'accepted')
      throw new HttpException(
        'Friend Request Already Accepted',
        HttpStatus.BAD_REQUEST,
      );

    if (request.sender.id !== userId)
      throw new HttpException(
        'Can not deleted friends request or You not sender request',
        HttpStatus.BAD_REQUEST,
      );
    await this._friendRequestRepository.delete({ id });
    return request;
  }

  async findfRequestById(id: string): Promise<FriendRequest | undefined> {
    const request = await this._friendRequestRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });
    if (!request)
      throw new HttpException('Friend request not found', HttpStatus.NOT_FOUND);

    return request;
  }

  async findOneRequest(
    senderId: string,
    receiverId: string,
  ): Promise<FriendRequest | undefined> {
    return await this._friendRequestRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { receiver: { id: senderId }, sender: { id: receiverId } },
      ],
      relations: ['receiver', 'sender'],
    });
  }

  async saveFriendRequest(request: FriendRequest): Promise<FriendRequest> {
    return await this._friendRequestRepository.save(request);
  }
}
