import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Resource, ResourceStatus } from '../../entities/resource.entity';
import { ResourceCategory } from '../../entities/resource-category.entity';
import { CreateResourceDto, UpdateResourceDto, CreateReviewDto } from './dto/resource.dto';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(ResourceCategory)
    private readonly categoryRepository: Repository<ResourceCategory>,
  ) {}

  async create(authorId: string, createResourceDto: CreateResourceDto): Promise<Resource> {
    const resource = this.resourceRepository.create({
      ...createResourceDto,
      authorId,
      status: ResourceStatus.PUBLISHED,
    });
    return this.resourceRepository.save(resource);
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    categoryId?: string,
    sortBy: 'latest' | 'popular' | 'downloads' = 'latest',
  ): Promise<{ items: Resource[]; total: number }> {
    const queryBuilder = this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.author', 'author')
      .leftJoinAndSelect('resource.category', 'category')
      .where('resource.status = :status', { status: ResourceStatus.PUBLISHED });

    if (categoryId) {
      queryBuilder.andWhere('resource.categoryId = :categoryId', { categoryId });
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        queryBuilder.orderBy('resource.ratingAvg', 'DESC');
        break;
      case 'downloads':
        queryBuilder.orderBy('resource.downloadCount', 'DESC');
        break;
      default:
        queryBuilder.orderBy('resource.createdAt', 'DESC');
    }

    queryBuilder
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  async findOne(id: string): Promise<Resource> {
    const resource = await this.resourceRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
    });

    if (!resource) {
      throw new NotFoundException('资源不存在');
    }

    return resource;
  }

  async update(id: string, authorId: string, updateResourceDto: UpdateResourceDto): Promise<Resource> {
    const resource = await this.findOne(id);
    if (resource.authorId !== authorId) {
      throw new NotFoundException('无权修改此资源');
    }

    Object.assign(resource, updateResourceDto);
    return this.resourceRepository.save(resource);
  }

  async remove(id: string, authorId: string): Promise<void> {
    const resource = await this.findOne(id);
    if (resource.authorId !== authorId) {
      throw new NotFoundException('无权删除此资源');
    }

    await this.resourceRepository.update(id, { status: ResourceStatus.DELETED });
  }

  async getDownloadLink(id: string, userId: string): Promise<{ link: string; extractCode?: string }> {
    const resource = await this.findOne(id);

    // Increment download count
    await this.resourceRepository.increment({ id }, 'downloadCount', 1);

    return {
      link: resource.link,
      extractCode: resource.extractCode,
    };
  }

  async getCategories(): Promise<ResourceCategory[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }
}
