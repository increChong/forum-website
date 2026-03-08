import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Topic, TopicStatus } from '../../entities/topic.entity';
import { Reply } from '../../entities/reply.entity';
import { CreateTopicDto, UpdateTopicDto, CreateReplyDto } from './dto/topic.dto';

@Injectable()
export class TopicService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
  ) {}

  async create(authorId: string, createTopicDto: CreateTopicDto): Promise<Topic> {
    const topic = this.topicRepository.create({
      ...createTopicDto,
      authorId,
      status: TopicStatus.PUBLISHED,
    });
    return this.topicRepository.save(topic);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    boardId?: string,
    sortBy: 'latest' | 'hot' | 'essence' = 'latest',
  ): Promise<{ items: Topic[]; total: number }> {
    const queryBuilder = this.topicRepository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.author', 'author')
      .leftJoinAndSelect('topic.board', 'board')
      .where('topic.status = :status', { status: TopicStatus.PUBLISHED });

    if (boardId) {
      queryBuilder.andWhere('topic.boardId = :boardId', { boardId });
    }

    // Sort
    switch (sortBy) {
      case 'hot':
        queryBuilder.orderBy(
          'topic.likeCount + topic.replyCount * 2 + topic.viewCount / 10',
          'DESC',
        );
        break;
      case 'essence':
        queryBuilder.andWhere('topic.isEssence = true').orderBy('topic.createdAt', 'DESC');
        break;
      default:
        queryBuilder.orderBy('topic.isPinned', 'DESC').addOrderBy('topic.lastReplyAt', 'DESC');
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  async findOne(id: string): Promise<Topic> {
    const topic = await this.topicRepository.findOne({
      where: { id },
      relations: ['author', 'board'],
    });

    if (!topic) {
      throw new NotFoundException('话题不存在');
    }

    // Increment view count
    await this.topicRepository.increment({ id }, 'viewCount', 1);

    return topic;
  }

  async update(id: string, authorId: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const topic = await this.findOne(id);
    if (topic.authorId !== authorId) {
      throw new NotFoundException('无权修改此话题');
    }

    Object.assign(topic, updateTopicDto);
    return this.topicRepository.save(topic);
  }

  async remove(id: string, authorId: string): Promise<void> {
    const topic = await this.findOne(id);
    if (topic.authorId !== authorId) {
      throw new NotFoundException('无权删除此话题');
    }

    await this.topicRepository.update(id, { status: TopicStatus.DELETED });
  }

  async createReply(topicId: string, authorId: string, createReplyDto: CreateReplyDto): Promise<Reply> {
    const topic = await this.findOne(topicId);
    
    // Get current max floor
    const maxFloorReply = await this.replyRepository.findOne({
      where: { topicId },
      order: { floor: 'DESC' },
    });
    const floor = (maxFloorReply?.floor || 0) + 1;

    const reply = this.replyRepository.create({
      ...createReplyDto,
      topicId,
      authorId,
      floor,
    });

    const savedReply = await this.replyRepository.save(reply);

    // Update topic reply count and last reply time
    await this.topicRepository.update(topicId, {
      replyCount: () => 'reply_count + 1',
      lastReplyAt: new Date(),
    });

    return savedReply;
  }

  async getReplies(
    topicId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: Reply[]; total: number }> {
    const [items, total] = await this.replyRepository.findAndCount({
      where: { topicId },
      relations: ['author'],
      order: { floor: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total };
  }

  async toggleLike(topicId: string, userId: string): Promise<{ liked: boolean }> {
    // This would normally check a likes table
    // For now, just increment the like count
    await this.topicRepository.increment({ id: topicId }, 'likeCount', 1);
    return { liked: true };
  }

  async toggleFavorite(topicId: string, userId: string): Promise<{ favorited: boolean }> {
    // This would normally check a favorites table
    // For now, just increment the favorite count
    await this.topicRepository.increment({ id: topicId }, 'favoriteCount', 1);
    return { favorited: true };
  }
}
