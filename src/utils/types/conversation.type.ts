import { User } from '../typeorm';

export type TConversationCreateParams = {
  creator: User;
  message: string;
  recipientId: string;
};

export type TAccessConversationParams = {
  userId: string;
  id: string;
};
