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
import { TopicService } from './topic.service';
import { CreateTopicDto, UpdateTopicDto, CreateReplyDto } from './dto/topic.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('话题')
@Controller('topics')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '获取话题列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'boardId', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['latest', 'hot', 'essence'] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('boardId') boardId?: string,
    @Query('sortBy') sortBy?: 'latest' | 'hot' | 'essence',
  ) {
    return this.topicService.findAll(page, limit, boardId, sortBy);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: '获取话题详情' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.topicService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建话题' })
  async create(@Request() req: any, @Body() createTopicDto: CreateTopicDto) {
    return this.topicService.create(req.user.id, createTopicDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新话题' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
    @Body() updateTopicDto: UpdateTopicDto,
  ) {
    return this.topicService.update(id, req.user.id, updateTopicDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除话题' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    await this.topicService.remove(id, req.user.id);
    return { message: '删除成功' };
  }

  @Post(':id/like')
  @ApiBearerAuth()
  @ApiOperation({ summary: '点赞话题' })
  async like(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.topicService.toggleLike(id, req.user.id);
  }

  @Post(':id/favorite')
  @ApiBearerAuth()
  @ApiOperation({ summary: '收藏话题' })
  async favorite(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    return this.topicService.toggleFavorite(id, req.user.id);
  }

  @Public()
  @Get(':id/replies')
  @ApiOperation({ summary: '获取话题回复列表' })
  async getReplies(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.topicService.getReplies(id, page, limit);
  }

  @Post(':id/replies')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建回复' })
  async createReply(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
    @Body() createReplyDto: CreateReplyDto,
  ) {
    return this.topicService.createReply(id, req.user.id, createReplyDto);
  }
}
