import { Conversation } from '../typeorm';
import { TConversationCreateParams } from '../types/conversation.type';

export interface IConversationService {
  createNewConversation(
    params: TConversationCreateParams,
  ): Promise<Conversation>;

  isCreated(
    creatorId: string,
    recipientId: string,
  ): Promise<Conversation | undefined>;

  saveConversation(conversation: Conversation): Promise<Conversation>;
}
