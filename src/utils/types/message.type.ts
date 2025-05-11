import { User } from '../typeorm';

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
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TDeleteMessageParams = {
  authorId: string;
  id: string;
  messageId: string;
};

export type TEditMessageParams = {
  authorId: string;
  id: string;
  messageId: string;
  content: string;
};
