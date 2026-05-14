import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PaginationQueryDto,
} from '../common/dto/pagination-query.dto';
import { PostsService } from './posts.service';

@ApiTags('posts')
@Controller('posts')
export class PostsPublicController {
  constructor(private readonly posts: PostsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List published posts with pagination' })
  @ApiResponse({ status: 200, description: 'Return paginated list of posts' })
  listPublished(@Query() query: PaginationQueryDto) {
    const page = query.page ?? PAGINATION_DEFAULT_PAGE;
    const limit = query.limit ?? PAGINATION_DEFAULT_LIMIT;
    return this.posts.findPublished(page, limit);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a single post by its slug' })
  @ApiResponse({ status: 200, description: 'Return the post data' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  bySlug(@Param('slug') slug: string) {
    return this.posts.findBySlugPublic(slug);
  }
}
