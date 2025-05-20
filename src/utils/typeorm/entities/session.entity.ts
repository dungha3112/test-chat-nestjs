import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index(['userId', 'jit'], { unique: true })
@Entity({ name: 'sessions' })
export class Sessions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'uuid', unique: true, nullable: true })
  jit: string;

  @Column({ nullable: true })
  deviceName: string;

  @Column({ nullable: true })
  deviceId: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
