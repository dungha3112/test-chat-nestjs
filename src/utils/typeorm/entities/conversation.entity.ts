import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ConversationMessage } from './conversation-message.entity';

@Entity({ name: 'conversations' })
@Index(['creator.id', 'recipient.id'], { unique: true })
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  creator: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  recipient: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;

  @OneToOne(() => ConversationMessage)
  @JoinColumn({ name: 'last_message_sent' })
  lastMessageSent: ConversationMessage;

  @UpdateDateColumn({ name: 'updated_at' })
  lastMessageSentAt: Date;
}
