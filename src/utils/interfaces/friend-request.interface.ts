import { FriendRequest } from '../typeorm';
import {
  TCreateFriendRequestParams,
  TFriendRequestAcceptedRes,
  TFriendRequestParams,
} from '../types';

export interface IFriendRequestService {
  create(params: TCreateFriendRequestParams): Promise<FriendRequest>;
  acceptById(params: TFriendRequestParams): Promise<TFriendRequestAcceptedRes>;
  rejectById(params: TFriendRequestParams): Promise<FriendRequest>;

  deleteById(params: TFriendRequestParams): Promise<FriendRequest>;

  findfRequestById(id: string): Promise<FriendRequest | undefined>;

  findOneRequest(
    senderId: string,
    receiverId: string,
  ): Promise<FriendRequest | undefined>;

  saveFriendRequest(friend: FriendRequest): Promise<FriendRequest>;
}
