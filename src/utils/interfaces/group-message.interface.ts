import { GroupMessage } from '../typeorm';
import {
  TCreateGroupMessageResponse,
  TCreateMessageParams,
  TGetMessagesParams,
  TGetMessagesResponse,
} from '../types';

export interface IGroupMessageService {
  createMessageGroup(
    params: TCreateMessageParams,
  ): Promise<TCreateGroupMessageResponse>;

  getMessagesByGroupId(
    params: TGetMessagesParams,
  ): Promise<TGetMessagesResponse>;

  saveMessageGroup(groupMessage: GroupMessage): Promise<GroupMessage>;
}
