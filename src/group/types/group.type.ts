import { GroupMessage, User } from '../../utils/typeorm';

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

export type TUpdateLastMessageGroupParams = Partial<{
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
