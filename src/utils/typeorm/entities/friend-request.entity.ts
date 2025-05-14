import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TFriendRequestStatusType } from 'src/utils/types';

@Entity({ name: 'friend_requests' })
export class FriendRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  sender: User;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  receiver: User;

  @CreateDateColumn()
  createdAt: number;

  @Column({
    type: 'varchar',
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: TFriendRequestStatusType;
}
