import { Friend } from '../../utils/typeorm';
import {
  TCreateFriendParams,
  TFriendParams,
  TGetFriendParams,
  TGetFriendResponse,
} from '../types/friend.type';

export interface IFriendService {
  deleteFriendById(params: TFriendParams): Promise<Friend>;
  searchFriend(query: string): Promise<Friend[]>;
  getFriends(params: TGetFriendParams): Promise<TGetFriendResponse>;
  isFriend(userId: string, receiverId: string): Promise<Friend | undefined>;

  createNewFriend(params: TCreateFriendParams): Promise<Friend>;
  findById(id: string): Promise<Friend | null>;

  hasFriend(params: TFriendParams): Promise<Friend>;

  saveFriend(friend: Friend): Promise<Friend>;
}
