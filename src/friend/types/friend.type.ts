import { Friend, User } from '../../utils/typeorm';

export type TCreateFriendParams = {
  sender: User;
  receiver: User;
};

export type TFriendParams = {
  id: string;
  userId: string;
};

export type TGetFriendParams = {
  userId: string;
  page: number;
  limit: number;
};

export type TGetFriendResponse = {
  userId: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  friends: Friend[];
};
