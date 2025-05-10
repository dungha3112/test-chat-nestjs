import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'groups' })
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable()
  users: User[];

  @OneToOne(() => User, { createForeignKeyConstraints: false })
  @JoinColumn()
  owner: User;

  @Column()
  title: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;
}
