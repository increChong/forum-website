import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id, status: UserStatus.ACTIVE },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username, status: UserStatus.ACTIVE },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, status: UserStatus.ACTIVE },
    });
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [
        { username: usernameOrEmail, status: UserStatus.ACTIVE },
        { email: usernameOrEmail, status: UserStatus.ACTIVE },
      ],
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.userRepository.update(id, data);
    return this.findById(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }

  async updatePoints(id: string, points: number): Promise<void> {
    await this.userRepository.increment({ id }, 'points', points);
  }

  async findByPage(
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: User[]; total: number }> {
    const [items, total] = await this.userRepository.findAndCount({
      where: { status: UserStatus.ACTIVE },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total };
  }
}
