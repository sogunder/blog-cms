import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '../../common/enums';

export class CreatePostDto {
  @ApiProperty({ example: 'My first post', description: 'Post title' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: 'my-first-post', description: 'Custom slug' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  slug?: string;

  @ApiPropertyOptional({ example: 'Post content here...', description: 'Full content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: 'Short summary', description: 'Post summary' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional({ enum: PostStatus, default: PostStatus.DRAFT })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiProperty({ example: '60d0fe4f5311236168a109ca', description: 'Category ID' })
  @IsMongoId()
  category: string;

  @ApiPropertyOptional({ example: ['60d0fe4f5311236168a109cb'], description: 'Tag IDs', type: [String] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tags?: string[];
}
