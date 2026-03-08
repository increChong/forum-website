import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { ResourceCategory } from './resource-category.entity';

export enum ResourceStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  HIDDEN = 'hidden',
  DELETED = 'deleted',
}

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'author_id', type: 'uuid', nullable: true })
  authorId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Index()
  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string;

  @ManyToOne(() => ResourceCategory, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: ResourceCategory;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 500, nullable: true })
  cover: string;

  @Column({ type: 'text' })
  link: string;

  @Column({ name: 'extract_code', length: 50, nullable: true })
  extractCode: string;

  @Column({ name: 'points_required', default: 0 })
  pointsRequired: number;

  @Column({ name: 'download_count', default: 0 })
  downloadCount: number;

  @Column({ name: 'favorite_count', default: 0 })
  favoriteCount: number;

  @Column({ name: 'rating_avg', type: 'decimal', precision: 3, scale: 2, default: 0 })
  ratingAvg: number;

  @Column({ name: 'rating_count', default: 0 })
  ratingCount: number;

  @Column({
    type: 'enum',
    enum: ResourceStatus,
    default: ResourceStatus.PUBLISHED,
  })
  status: ResourceStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
