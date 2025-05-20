import {
  TCreateMessageParams,
  TDeleteMessageParams,
  TEditMessageParams,
  TGetMessagesParams,
} from 'src/utils/types/message.type';
import { GroupMessage } from '../../utils/typeorm';
import {
  TCreateGroupMessageResponse,
  TGetMessagesGroupResponse,
} from '../types/group-message.type';

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
