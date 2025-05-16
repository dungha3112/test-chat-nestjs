import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'sessions' })
export class Sessions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'uuid', unique: true })
  jit: string;

  @Column({ unique: true })
  refresh_token: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @Column({ nullable: true })
  deviceName: string;

  @Column({ nullable: true })
  deviceId: string;
}
