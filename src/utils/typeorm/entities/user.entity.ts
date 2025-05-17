import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  @Expose()
  password: string;

  @Column()
  username: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: Boolean, default: false, select: false })
  @Expose()
  isVerify: boolean;
}
