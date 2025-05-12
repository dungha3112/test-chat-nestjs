import { Conversation } from '../typeorm';
import {
  TAccessConversationParams,
  TConversationCreateParams,
  TUpdateLastMessageConverParams,
} from '../types';

export interface IConversationService {
  createNewConversation(
    params: TConversationCreateParams,
  ): Promise<Conversation>;

  userGetConversations(userId: string): Promise<Conversation[]>;
  findConversationById(id: string): Promise<Conversation | null>;

  hasAccess(params: TAccessConversationParams): Promise<boolean>;

  updateLastMessageConver(params: TUpdateLastMessageConverParams);

  isCreated(
    creatorId: string,
    recipientId: string,
  ): Promise<Conversation | undefined>;

  saveConversation(conversation: Conversation): Promise<Conversation>;
}
