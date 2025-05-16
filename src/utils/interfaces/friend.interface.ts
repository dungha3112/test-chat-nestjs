import { Friend } from '../typeorm';
import {
  TCreateFriendParams,
  TFriendParams,
  TGetFriendParams,
  TGetFriendResponse,
} from '../types';

export interface IFriendService {
  deleteFriendById(params: TFriendParams): Promise<Friend>;
  searchFriend(query: string): Promise<Friend[]>;
  getFriends(params: TGetFriendParams): Promise<TGetFriendResponse>;

  createNewFriend(params: TCreateFriendParams): Promise<Friend>;
  findById(id: string): Promise<Friend | null>;

  isFriend(userId: string, receiverId: string): Promise<Friend | undefined>;

  hasFriend(params: TFriendParams): Promise<Friend>;

  saveFriend(friend: Friend): Promise<Friend>;
}
