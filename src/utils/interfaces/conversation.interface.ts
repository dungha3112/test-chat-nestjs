import { Conversation } from '../typeorm';
import { TAccessConversationParams, TConversationCreateParams } from '../types';

export interface IConversationService {
  createNewConversation(
    params: TConversationCreateParams,
  ): Promise<Conversation>;

  userGetConversations(userId: string): Promise<Conversation[]>;
  findConversationById(id: string): Promise<Conversation | null>;

  hasAccess(params: TAccessConversationParams): Promise<boolean>;

  isCreated(
    creatorId: string,
    recipientId: string,
  ): Promise<Conversation | undefined>;

  saveConversation(conversation: Conversation): Promise<Conversation>;
}
