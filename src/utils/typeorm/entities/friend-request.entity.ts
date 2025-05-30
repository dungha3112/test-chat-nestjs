import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';
import { TFriendRequestStatusType } from 'src/friend/types/friend-request.type';

@Entity({ name: 'friend_requests' })
@Index(['sender.id', 'receiver.id'], { unique: true })
export class FriendRequest {
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
