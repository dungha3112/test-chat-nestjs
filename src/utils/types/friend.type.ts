import { User } from '../typeorm';

export type TCreateFriendParams = {
  sender: User;
  receiver: User;
};

export type TFriendParams = {
  id: string;
  userId: string;
};
