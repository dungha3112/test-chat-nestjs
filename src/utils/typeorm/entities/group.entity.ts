import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { GroupMessage } from './group-message.entity';

@Entity({ name: 'groups' })
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: Relation<User[]>;

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  owner: Relation<User>;

  @Column()
  title: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @OneToOne(() => GroupMessage, { createForeignKeyConstraints: false })
  @JoinColumn()
  lastMessageSent: GroupMessage;

  @UpdateDateColumn({ name: 'updated_at' })
  lastMessageSentAt: Date;
}
