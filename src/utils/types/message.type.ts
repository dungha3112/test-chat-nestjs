import { User } from '../typeorm';

export type TCreateMessageParams = {
  id: string;
  content: string;
  author: User;
};
