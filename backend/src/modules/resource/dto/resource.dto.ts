import { IsString, MinLength, MaxLength, IsOptional, IsUUID, IsNumber, Min, Max, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResourceDto {
  @ApiProperty({ description: '资源标题' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ description: '资源描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '资源链接' })
  @IsString()
  link: string;

  @ApiPropertyOptional({ description: '提取码' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  extractCode?: string;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: '所需积分', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointsRequired?: number;
}

export class UpdateResourceDto {
  @ApiPropertyOptional({ description: '资源标题' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ description: '资源描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '资源链接' })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiPropertyOptional({ description: '提取码' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  extractCode?: string;

  @ApiPropertyOptional({ description: '分类ID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ description: '所需积分' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointsRequired?: number;
}

export class CreateReviewDto {
  @ApiProperty({ description: '评分 (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: '评价内容' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  content?: string;

  @ApiPropertyOptional({ description: '资源是否有效' })
  @IsOptional()
  isValid?: boolean;
}
