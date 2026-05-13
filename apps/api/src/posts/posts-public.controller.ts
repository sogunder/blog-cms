import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PaginationQueryDto,
} from '../common/dto/pagination-query.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsPublicController {
  constructor(private readonly posts: PostsService) {}

  @Public()
  @Get()
  listPublished(@Query() query: PaginationQueryDto) {
    const page = query.page ?? PAGINATION_DEFAULT_PAGE;
    const limit = query.limit ?? PAGINATION_DEFAULT_LIMIT;
    return this.posts.findPublished(page, limit);
  }

  @Public()
  @Get('slug/:slug')
  bySlug(@Param('slug') slug: string) {
    return this.posts.findBySlugPublic(slug);
  }
}
