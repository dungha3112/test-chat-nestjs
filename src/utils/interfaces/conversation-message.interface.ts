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

  getMessagesByConverId(
    params: TGetMessagesParams,
  ): Promise<TGetMessagesConversationResponse>;

  editMessage(params: TEditMessageParams): Promise<ConversationMessage>;

  deleteMessageConverById(
    params: TDeleteMessageParams,
  ): Promise<ConversationMessage>;

  saveMessageConver(
    converMessage: ConversationMessage,
  ): Promise<ConversationMessage>;
}
