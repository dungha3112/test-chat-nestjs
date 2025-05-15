import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
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
  creator: Relation<User>;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  recipient: Relation<User>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => ConversationMessage, { createForeignKeyConstraints: false })
  @JoinColumn()
  lastMessageSent: ConversationMessage;

  @UpdateDateColumn({ name: 'updated_at' })
  lastMessageSentAt: Date;
}
