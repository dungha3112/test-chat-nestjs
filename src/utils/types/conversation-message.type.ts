import { Conversation, ConversationMessage } from '../typeorm';
import { TGetMessagesResponse } from './message.type';

export type TCreateConversationResponse = {
  message: ConversationMessage;
  conversation: Conversation;
};

export type TGetMessagesConversationResponse = TGetMessagesResponse & {
  conversationId: string;
  messages: ConversationMessage[];
};

// PAYLOAD EMITER
export type TMessageConverPayload = {
  conversationId: string;
  message: ConversationMessage;
};
