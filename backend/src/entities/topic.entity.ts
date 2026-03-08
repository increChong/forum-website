import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Board } from './board.entity';

export enum TopicStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  HIDDEN = 'hidden',
  DELETED = 'deleted',
}

@Entity('topics')
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'board_id', type: 'uuid', nullable: true })
  boardId: string;

  @ManyToOne(() => Board, { nullable: true })
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @Index()
  @Column({ name: 'author_id', type: 'uuid', nullable: true })
  authorId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'view_count', default: 0 })
  viewCount: number;

  @Column({ name: 'like_count', default: 0 })
  likeCount: number;

  @Column({ name: 'reply_count', default: 0 })
  replyCount: number;

  @Column({ name: 'favorite_count', default: 0 })
  favoriteCount: number;

  @Column({ name: 'is_pinned', default: false })
  isPinned: boolean;

  @Column({ name: 'is_essence', default: false })
  isEssence: boolean;

  @Column({
    type: 'enum',
    enum: TopicStatus,
    default: TopicStatus.PUBLISHED,
  })
  status: TopicStatus;

  @Column({ name: 'last_reply_at', type: 'timestamptz', nullable: true })
  lastReplyAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
