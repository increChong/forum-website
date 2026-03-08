import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('point_logs')
export class PointLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 50 })
  type: string; // 'register', 'login', 'download_resource', 'resource_downloaded', etc.

  @Column()
  points: number; // 正数表示获得，负数表示扣除

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ name: 'related_type', length: 50, nullable: true })
  relatedType: string;

  @Column({ name: 'related_id', type: 'uuid', nullable: true })
  relatedId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
