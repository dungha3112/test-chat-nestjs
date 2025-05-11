import { Group, GroupMessage } from '../typeorm';
import { TGetMessagesResponse } from './message.type';

export type TCreateGroupMessageResponse = {
  message: GroupMessage;
  group: Group;
};

export type TGetMessagesGroupResponse = TGetMessagesResponse & {
  groupId: string;
  messages: GroupMessage[];
};
