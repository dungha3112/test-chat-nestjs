import { GroupMessage } from '../typeorm';
import { TCreateGroupMessageResponse, TCreateMessageParams } from '../types';

export interface IGroupMessageService {
  createMessageGroup(
    params: TCreateMessageParams,
  ): Promise<TCreateGroupMessageResponse>;

  saveMessageGroup(groupMessage: GroupMessage): Promise<GroupMessage>;
}
