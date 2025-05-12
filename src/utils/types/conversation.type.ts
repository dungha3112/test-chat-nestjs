import { User } from '../typeorm';

export type TConversationCreateParams = {
  creator: User;
  message: string;
  recipientId: string;
};
