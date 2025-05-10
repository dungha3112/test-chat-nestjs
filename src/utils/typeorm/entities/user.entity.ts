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

  @Column({ nullable: true, select: false })
  @Expose()
  refreshToken?: string;

  @Column({ unique: true })
  username: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
