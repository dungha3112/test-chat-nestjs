import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';
import { TFriendRequestStatusType } from 'src/utils/types';

@Entity({ name: 'friends' })
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

  @Column({
    type: 'varchar',
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: TFriendRequestStatusType;
}
