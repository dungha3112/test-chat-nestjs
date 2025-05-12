import { GroupMessage, User } from '../typeorm';

export type TCreateGroupParams = {
  users: string[];
  title: string;
  owner: User;
  message: string;
};

export type TCheckUserInGroupParams = {
  id: string;
  userId: string;
};

export type TUpdateLastMessageParams = Partial<{
  id: string;
  lastMessageSent: GroupMessage;
}>;

export type TEditGroupParams = {
  id: string;
  ownerId: string;
  title: string;
};

export type TUpdateOwnerGroupPrams = {
  id: string;
  newOwnerId: string;
  ownerId: string;
};

export type TUserLeaveGroup = {
  id: string;
  userId: string;
};
