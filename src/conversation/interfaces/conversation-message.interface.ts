import {
  TCreateMessageParams,
  TDeleteMessageParams,
  TEditMessageParams,
  TGetMessagesParams,
} from 'src/utils/types/message.type';
import { ConversationMessage } from '../../utils/typeorm';
import {
  TCreateConversationResponse,
  TGetMessagesConversationResponse,
} from '../types/conversation-message.type';

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
