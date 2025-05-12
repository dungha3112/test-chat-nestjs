import { Entity, ManyToOne } from 'typeorm';
import { BaseMessage } from './base-message.entity';
import { Conversation } from './conversation.entity';

@Entity({ name: 'conversation_messages' })
export class ConversationMessage extends BaseMessage {
  @ManyToOne(() => Conversation)
  conversation: Conversation;
}
