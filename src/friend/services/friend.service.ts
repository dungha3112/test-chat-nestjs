import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/utils/constants';
import { Friend, FriendRequest } from 'src/utils/typeorm';

import { Brackets, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { IFriendService } from '../interfaces/friend.interface';
import { IFriendRequestService } from '../interfaces/friend-request.interface';
import {
  TCreateFriendParams,
  TFriendParams,
  TGetFriendParams,
  TGetFriendResponse,
} from '../types/friend.type';

@Injectable()
export class FriendService implements IFriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly _friendRepository: Repository<Friend>,

    @InjectRepository(FriendRequest)
    private readonly _friendRequestRepository: Repository<FriendRequest>,

    @Inject(Services.FRIEND_REQUEST)
    private readonly _friendRequestService: IFriendRequestService,
  ) {}

  async createNewFriend(params: TCreateFriendParams): Promise<Friend> {
    const { sender, receiver } = params;
    const newFriend = this._friendRepository.create({ sender, receiver });

    return await this.saveFriend(newFriend);
  }

  async findById(id: string): Promise<Friend | null> {
    if (!isUUID(id)) {
      throw new HttpException(`Invalid UUID format`, HttpStatus.BAD_REQUEST);
    }

    const friend = await this._friendRepository.findOne({
      where: { id },
      relations: ['sender', 'receiver'],
    });

    if (!friend)
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);

    return friend;
  }

  async deleteFriendById(params: TFriendParams): Promise<Friend> {
    const friend = await this.hasFriend(params);

    const request = await this._friendRequestService.findOneRequest(
      friend.sender.id,
      friend.receiver.id,
    );

    if (!request)
      throw new HttpException(
        'Friends not found or can not delete friends',
        HttpStatus.NOT_FOUND,
      );

    const senderId = friend.sender.id;
    const receiverId = friend.receiver.id;

    const friendRequest = await this._friendRequestRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
      relations: ['sender', 'receiver'],
    });

    if (!friendRequest)
      throw new HttpException('Friend request not found', HttpStatus.NOT_FOUND);
    await this._friendRequestRepository.delete({ id: friendRequest.id });

    const deleted = await this._friendRepository.delete({ id: params.id });

    return friend;
  }

  async hasFriend(params: TFriendParams): Promise<Friend> {
    const { id, userId } = params;
    const friend = await this.findById(id);

    const senderId = friend.sender.id;
    const receiverId = friend.receiver.id;

    if (senderId !== userId && receiverId !== userId)
      throw new HttpException('They are not friends', HttpStatus.BAD_REQUEST);

    return friend;
  }

  async isFriend(
    userId: string,
    receiverId: string,
  ): Promise<Friend | undefined> {
    return await this._friendRepository.findOne({
      where: [
        { sender: { id: userId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: userId } },
      ],
    });
  }

  async getFriends(params: TGetFriendParams): Promise<TGetFriendResponse> {
    const { limit, userId, page } = params;
    const [data, total] = await this._friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.sender', 'sender')
      .leftJoinAndSelect('friend.receiver', 'receiver')

      .where(
        new Brackets((qb) => {
          qb.where('sender.id = :userId', { userId }).orWhere(
            'receiver.id = :userId',
            { userId },
          );
        }),
      )
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      userId,
      friends: data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchFriend(query: string): Promise<Friend[]> {
    if (!query)
      throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);

    const statement =
      '(sender.username LIKE :query OR sender.email LIKE :query OR receiver.username LIKE :query OR receiver.email LIKE :query)';

    return await this._friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.sender', 'sender')
      .leftJoinAndSelect('friend.receiver', 'receiver')
      .where(statement, { query: `%${query}%` })
      .addSelect([
        'sender.email',
        'sender.username',
        'sender.id',
        'receiver.email',
        'receiver.username',
        'receiver.id',
      ])
      .limit(10)
      .getMany();
  }

  async saveFriend(friend: Friend): Promise<Friend> {
    return this._friendRepository.save(friend);
  }
}
