import { Group, GroupMessage } from '../../utils/typeorm';
import { TGetMessagesResponse } from '../../utils/types/message.type';

export type TCreateGroupMessageResponse = {
  message: GroupMessage;
  group: Group;
};

export type TGetMessagesGroupResponse = TGetMessagesResponse & {
  groupId: string;
  messages: GroupMessage[];
};

// PAYLOAD EMITER

export type TMessageGroupPayload = {
  groupId: string;
  message: GroupMessage;
};
