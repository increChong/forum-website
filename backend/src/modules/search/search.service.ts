import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic, TopicStatus } from '../../entities/topic.entity';
import { Resource, ResourceStatus } from '../../entities/resource.entity';
import { User, UserStatus } from '../../entities/user.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async search(
    keyword: string,
    type: 'all' | 'topic' | 'resource' | 'user' = 'all',
    page: number = 1,
    limit: number = 20,
  ) {
    const results: any = {
      keyword,
      total: 0,
    };

    const skip = (page - 1) * limit;

    // 搜索话题
    if (type === 'all' || type === 'topic') {
      const topicsQuery = this.topicRepository
        .createQueryBuilder('topic')
        .leftJoinAndSelect('topic.author', 'author')
        .leftJoinAndSelect('topic.board', 'board')
        .where('topic.status = :status', { status: TopicStatus.PUBLISHED })
        .andWhere(
          '(topic.title ILIKE :keyword OR topic.content ILIKE :keyword)',
          { keyword: `%${keyword}%` }
        )
        .orderBy('topic.createdAt', 'DESC');

      const [topics, topicsTotal] = await topicsQuery
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      results.topics = topics.map(topic => ({
        id: topic.id,
        title: topic.title,
        content: topic.content.substring(0, 200) + '...',
        author: topic.author ? {
          id: topic.author.id,
          username: topic.author.username,
          nickname: topic.author.nickname,
          avatar: topic.author.avatar,
        } : null,
        board: topic.board,
        viewCount: topic.viewCount,
        likeCount: topic.likeCount,
        replyCount: topic.replyCount,
        createdAt: topic.createdAt,
      }));
      results.topicsTotal = topicsTotal;
      results.total += topicsTotal;
    }

    // 搜索资源
    if (type === 'all' || type === 'resource') {
      const resourcesQuery = this.resourceRepository
        .createQueryBuilder('resource')
        .leftJoinAndSelect('resource.author', 'author')
        .leftJoinAndSelect('resource.category', 'category')
        .where('resource.status = :status', { status: ResourceStatus.PUBLISHED })
        .andWhere(
          '(resource.title ILIKE :keyword OR resource.description ILIKE :keyword)',
          { keyword: `%${keyword}%` }
        )
        .orderBy('resource.createdAt', 'DESC');

      const [resources, resourcesTotal] = await resourcesQuery
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      results.resources = resources.map(resource => ({
        id: resource.id,
        title: resource.title,
        description: resource.description?.substring(0, 200) || '',
        cover: resource.cover,
        author: resource.author ? {
          id: resource.author.id,
          username: resource.author.username,
          nickname: resource.author.nickname,
          avatar: resource.author.avatar,
        } : null,
        category: resource.category,
        downloadCount: resource.downloadCount,
        ratingAvg: resource.ratingAvg,
        pointsRequired: resource.pointsRequired,
        createdAt: resource.createdAt,
      }));
      results.resourcesTotal = resourcesTotal;
      results.total += resourcesTotal;
    }

    // 搜索用户
    if (type === 'all' || type === 'user') {
      const usersQuery = this.userRepository
        .createQueryBuilder('user')
        .where('user.status = :status', { status: UserStatus.ACTIVE })
        .andWhere(
          '(user.username ILIKE :keyword OR user.nickname ILIKE :keyword OR user.bio ILIKE :keyword)',
          { keyword: `%${keyword}%` }
        )
        .orderBy('user.createdAt', 'DESC');

      const [users, usersTotal] = await usersQuery
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      results.users = users.map(user => ({
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
        bio: user.bio?.substring(0, 100) || '',
        level: user.level,
        points: user.points,
        createdAt: user.createdAt,
      }));
      results.usersTotal = usersTotal;
      results.total += usersTotal;
    }

    // 分页信息
    results.page = page;
    results.limit = limit;
    results.hasMore = results.total > page * limit;

    return results;
  }

  // 搜索建议（自动补全）
  async getSuggestions(keyword: string, limit: number = 5) {
    if (!keyword || keyword.trim().length < 2) {
      return { topics: [], resources: [] };
    }

    const searchKeyword = keyword.trim();

    // 话题建议
    const topics = await this.topicRepository
      .createQueryBuilder('topic')
      .select(['topic.id', 'topic.title'])
      .where('topic.status = :status', { status: TopicStatus.PUBLISHED })
      .andWhere('topic.title ILIKE :keyword', { keyword: `${searchKeyword}%` })
      .orderBy('topic.viewCount', 'DESC')
      .limit(limit)
      .getMany();

    // 资源建议
    const resources = await this.resourceRepository
      .createQueryBuilder('resource')
      .select(['resource.id', 'resource.title'])
      .where('resource.status = :status', { status: ResourceStatus.PUBLISHED })
      .andWhere('resource.title ILIKE :keyword', { keyword: `${searchKeyword}%` })
      .orderBy('resource.downloadCount', 'DESC')
      .limit(limit)
      .getMany();

    return {
      topics,
      resources,
    };
  }
}
