import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PaginationQueryDto,
} from '../common/dto/pagination-query.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsPublicController {
  constructor(private readonly tags: TagsService) {}

  @Public()
  @Get()
  list() {
    return this.tags.findAllPublic();
  }

  @Public()
  @Get(':slug/posts')
  postsBySlug(
    @Param('slug') slug: string,
    @Query() query: PaginationQueryDto,
  ) {
    const page = query.page ?? PAGINATION_DEFAULT_PAGE;
    const limit = query.limit ?? PAGINATION_DEFAULT_LIMIT;
    return this.tags.findPostsBySlug(slug, page, limit);
  }
}
