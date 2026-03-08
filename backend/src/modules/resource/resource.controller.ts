import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ResourceService } from './resource.service';
import { CreateResourceDto, UpdateResourceDto } from './dto/resource.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('资源')
@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取资源列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['latest', 'popular', 'downloads'] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoryId') categoryId?: string,
    @Query('sortBy') sortBy?: 'latest' | 'popular' | 'downloads',
  ) {
    return this.resourceService.findAll(page, limit, categoryId, sortBy);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: '获取资源分类' })
  async getCategories() {
    return this.resourceService.getCategories();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '获取资源详情' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.resourceService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建资源' })
  async create(@Request() req: any, @Body() createResourceDto: CreateResourceDto) {
    return this.resourceService.create(req.user.id, createResourceDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新资源' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourceService.update(id, req.user.id, updateResourceDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除资源' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    await this.resourceService.remove(id, req.user.id);
    return { message: '删除成功' };
  }

  @Post(':id/download')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取下载链接' })
  async getDownloadLink(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.resourceService.getDownloadLink(id, req.user.id);
  }
}
