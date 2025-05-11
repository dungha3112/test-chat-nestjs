import { GroupMessage } from '../typeorm';

export type TCreateGroupParams = {
  users: string[];
  title: string;
  ownerId: string;
};
export type TCheckUserInGroupParams = {
  id: string;
  userId: string;
};

export type TUpdateLastMessageParams = Partial<{
  id: string;
  lastMessageSent: GroupMessage;
}>;
