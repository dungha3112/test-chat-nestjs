import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('IDX_userId', ['userId'])
@Index('IDX_refresh_token', ['refresh_token'])
@Index('IDX_userId_refresh_token', ['userId', 'refresh_token'])
@Entity({ name: 'sessions' })
export class Sessions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ unique: true })
  refresh_token: string;

  @Column({ nullable: true })
  deviceName: string;

  @Column({ nullable: true })
  deviceId: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
