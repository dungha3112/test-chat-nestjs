import { Group, GroupMessage } from '../typeorm';

export type TCreateGroupMessageResponse = {
  message: GroupMessage;
  group: Group;
};
