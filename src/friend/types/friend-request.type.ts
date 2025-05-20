import { Friend, FriendRequest, User } from '../../utils/typeorm';

export type TFriendRequestStatusType = 'pending' | 'accepted' | 'rejected';

export type TCreateFriendRequestParams = {
  sender: User;
  receiverId: string;
};

export type TFriendRequestParams = {
  id: string;
  userId: string;
};

export type TFriendRequestAcceptedRes = {
  friend: Friend;
  friendRequest: FriendRequest;
};

export type TGetFriendRequestParams = {
  userId: string;
  page: number;
  limit: number;
  status: TFriendRequestStatusType;
};

export type TGetFriendsRequestResponse = {
  userId: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  friendsRequest: FriendRequest[];
};
