import { GroupMessage, User } from '../typeorm';

export type TCreateMessageParams = {
  id: string;
  content: string;
  author: User;
};

export type TGetMessagesParams = {
  id: string;
  page: number;
  limit: number;
};

export type TGetMessagesResponse = {
  messages: GroupMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
