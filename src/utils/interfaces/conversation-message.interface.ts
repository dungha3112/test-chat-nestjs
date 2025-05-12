import { ConversationMessage } from '../typeorm';
import {
  TCreateConversationResponse,
  TCreateMessageParams,
  TDeleteMessageParams,
  TEditMessageParams,
  TGetMessagesConversationResponse,
  TGetMessagesParams,
} from '../types';

export interface IConversationMessageService {
  createMessageConver(
    params: TCreateMessageParams,
  ): Promise<TCreateConversationResponse>;

  getMessagesByConversationId(
    params: TGetMessagesParams,
  ): Promise<TGetMessagesConversationResponse>;

  editMessage(params: TEditMessageParams): Promise<ConversationMessage>;

  deleteMessageGroupById(
    params: TDeleteMessageParams,
  ): Promise<ConversationMessage>;

  saveMessageGroup(
    groupMessage: ConversationMessage,
  ): Promise<ConversationMessage>;
}
