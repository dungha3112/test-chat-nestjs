import { TCreateFriendParams } from 'src/utils/types';
import { IFriendRequestService } from './../../utils/interfaces/friend-request.interface';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { IUserService } from 'src/utils/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { Friend } from 'src/utils/typeorm';

@Injectable()
export class FriendReuestService implements IFriendRequestService {
  constructor(
    @Inject(Services.USER) private readonly _userService: IUserService,

    @InjectRepository(Friend)
    private readonly _friendRequestRepository: Repository<Friend>,
  ) {}

  async create(params: TCreateFriendParams): Promise<Friend> {
    const { receiverId, sender } = params;
    if (!isUUID(receiverId)) {
      throw new HttpException(
        `Invalid UUID format receiverId`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (sender.id === receiverId)
      throw new HttpException(
        'Can not send friend request with myself.',
        HttpStatus.BAD_REQUEST,
      );

    const receiver = await this._userService.findOne({
      options: { selectAll: false },
      params: { id: receiverId },
    });
    if (!receiver)
      throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);

    const friendRequestExists = await this.findOneRequest(
      sender.id,
      receiverId,
    );

    if (friendRequestExists) {
      if (friendRequestExists.status === 'pending')
        throw new HttpException(
          'Friend Requesting Pending',
          HttpStatus.BAD_REQUEST,
        );
      if (friendRequestExists.status === 'rejected')
        throw new HttpException(
          'Friend Requesting Rejected',
          HttpStatus.BAD_REQUEST,
        );
    }

    const newRequest = this._friendRequestRepository.create({
      sender,
      receiver,
    });

    const savedRequest = await this.saveFriendRequest(newRequest);
    return savedRequest;
  }

  async findOneRequest(
    senderId: string,
    receiverId: string,
  ): Promise<Friend | undefined> {
    return await this._friendRequestRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } },
      ],
      relations: ['sender', 'receiverId'],
    });
  }

  async saveFriendRequest(friend: Friend): Promise<Friend> {
    return await this._friendRequestRepository.save(friend);
  }
}
