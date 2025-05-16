import { Friend, FriendRequest, User } from '../typeorm';

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
