import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'friends' })
@Index(['sender.id', 'receiver.id'], { unique: true })
export class Friend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  sender: Relation<User>;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  receiver: Relation<User>;

  @CreateDateColumn()
  createdAt: Date;
}
