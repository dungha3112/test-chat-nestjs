import {
  TAddRecipientToGroupParams,
  TAddRecipientToGroupResponse,
  TRemoveRecipientToGroupParams,
  TRemoveRecipientToGroupResponse,
} from '../types';

export interface IGroupRecipientsService {
  addRecipientToGroup(
    params: TAddRecipientToGroupParams,
  ): Promise<TAddRecipientToGroupResponse>;

  removeRecipientToGroup(
    params: TRemoveRecipientToGroupParams,
  ): Promise<TRemoveRecipientToGroupResponse>;
}
