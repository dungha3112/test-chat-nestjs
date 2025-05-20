import { FriendRequest } from '../../utils/typeorm';
import {
  TCreateFriendRequestParams,
  TFriendRequestAcceptedRes,
  TFriendRequestParams,
  TGetFriendRequestParams,
  TGetFriendsRequestResponse,
} from '../types/friend-request.type';

export interface IFriendRequestService {
  create(params: TCreateFriendRequestParams): Promise<FriendRequest>;
  acceptById(params: TFriendRequestParams): Promise<TFriendRequestAcceptedRes>;
  rejectById(params: TFriendRequestParams): Promise<FriendRequest>;

  getRequests(
    params: TGetFriendRequestParams,
  ): Promise<TGetFriendsRequestResponse>;

  deleteById(params: TFriendRequestParams): Promise<FriendRequest>;

  findfRequestById(id: string): Promise<FriendRequest | undefined>;

  findOneRequest(
    senderId: string,
    receiverId: string,
  ): Promise<FriendRequest | undefined>;

  saveFriendRequest(friend: FriendRequest): Promise<FriendRequest>;
}
