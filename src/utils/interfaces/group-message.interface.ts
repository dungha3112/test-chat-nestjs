import { GroupMessage } from '../typeorm';
import {
  TCreateGroupMessageResponse,
  TCreateMessageParams,
  TGetMessagesParams,
  TGetMessagesGroupResponse,
  TDeleteMessageParams,
  TEditMessageParams,
} from '../types';

export interface IGroupMessageService {
  createMessageGroup(
    params: TCreateMessageParams,
  ): Promise<TCreateGroupMessageResponse>;

  getMessagesByGroupId(
    params: TGetMessagesParams,
  ): Promise<TGetMessagesGroupResponse>;

  editMessage(params: TEditMessageParams): Promise<GroupMessage>;

  deleteMessageGroupById(params: TDeleteMessageParams): Promise<GroupMessage>;

  saveMessageGroup(groupMessage: GroupMessage): Promise<GroupMessage>;
}
