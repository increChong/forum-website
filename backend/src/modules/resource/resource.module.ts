import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from '../../entities/resource.entity';
import { ResourceCategory } from '../../entities/resource-category.entity';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Resource, ResourceCategory])],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
