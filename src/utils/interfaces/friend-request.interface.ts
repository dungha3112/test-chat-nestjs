import { Friend } from '../typeorm';
import { TCreateFriendParams } from '../types';

export interface IFriendRequestService {
  create(params: TCreateFriendParams): Promise<Friend>;

  findOneRequest(
    senderId: string,
    receiverId: string,
  ): Promise<Friend | undefined>;

  saveFriendRequest(friend: Friend): Promise<Friend>;
}
