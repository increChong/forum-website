import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('搜索')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '全站搜索' })
  @ApiQuery({ name: 'q', required: true, description: '搜索关键词' })
  @ApiQuery({ name: 'type', required: false, description: '搜索类型: all/topic/resource/user', example: 'all' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async search(
    @Query('q') keyword: string,
    @Query('type') type: 'all' | 'topic' | 'resource' | 'user' = 'all',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    if (!keyword || keyword.trim().length === 0) {
      return { topics: [], resources: [], users: [], total: 0 };
    }

    return this.searchService.search(keyword.trim(), type, page, limit);
  }
}
