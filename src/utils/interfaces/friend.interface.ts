import { Friend } from '../typeorm';
import { TCreateFriendParams, TFriendParams } from '../types';

export interface IFriendService {
  createNewFriend(params: TCreateFriendParams): Promise<Friend>;
  findById(id: string): Promise<Friend | null>;
  deleteFriendById(params: TFriendParams): Promise<Friend>;
  searchFriend(query: string): Promise<Friend[]>;

  isFriend(userId: string, receiverId: string): Promise<Friend | undefined>;

  hasFriend(params: TFriendParams): Promise<Friend>;

  saveFriend(friend: Friend): Promise<Friend>;
}
