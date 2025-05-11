import { Group, User } from '../typeorm';

export type TAddRecipientToGroupParams = {
  recipientId: string;
  id: string;
  ownerId: string;
};

export type TAddRecipientToGroupResponse = {
  group: Group;
  recipient: User;
};

export type TRemoveRecipientToGroupParams = {
  recipientId: string;
  id: string;
  ownerId: string;
};

export type TRemoveRecipientToGroupResponse = {
  group: Group;
  recipient: User;
};
