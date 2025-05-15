import { User } from '../typeorm';

export type TFriendRequestStatusType = 'pending' | 'accepted' | 'rejected';

export type TCreateFriendParams = {
  sender: User;
  receiverId: string;
};
