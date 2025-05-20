import {
  TAddRecipientToGroupParams,
  TAddRecipientToGroupResponse,
  TRemoveRecipientToGroupParams,
  TRemoveRecipientToGroupResponse,
} from '../types/group-recipients.type';

export interface IGroupRecipientsService {
  addRecipientToGroup(
    params: TAddRecipientToGroupParams,
  ): Promise<TAddRecipientToGroupResponse>;

  removeRecipientToGroup(
    params: TRemoveRecipientToGroupParams,
  ): Promise<TRemoveRecipientToGroupResponse>;
}
