import { IsString, MinLength, MaxLength, IsOptional, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTopicDto {
  @ApiProperty({ description: '话题标题' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: '话题内容' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({ description: '板块ID' })
  @IsOptional()
  @IsUUID()
  boardId?: string;

  @ApiPropertyOptional({ description: '标签', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateTopicDto {
  @ApiPropertyOptional({ description: '话题标题' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ description: '话题内容' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;

  @ApiPropertyOptional({ description: '板块ID' })
  @IsOptional()
  @IsUUID()
  boardId?: string;

  @ApiPropertyOptional({ description: '标签', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class CreateReplyDto {
  @ApiProperty({ description: '回复内容' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({ description: '父回复ID（楼中楼）' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
