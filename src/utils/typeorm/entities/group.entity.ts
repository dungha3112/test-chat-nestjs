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
} from 'typeorm';
import { User } from './user.entity';

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
  createdAt: number;
}
