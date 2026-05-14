import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PaginationQueryDto,
} from '../common/dto/pagination-query.dto';
import { TagsService } from './tags.service';

@ApiTags('tags')
@Controller('tags')
export class TagsPublicController {
  constructor(private readonly tags: TagsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all public tags' })
  @ApiResponse({ status: 200, description: 'Return all tags' })
  list() {
    return this.tags.findAllPublic();
  }

  @Public()
  @Get(':slug/posts')
  @ApiOperation({ summary: 'Get posts by tag slug' })
  @ApiResponse({ status: 200, description: 'Return paginated posts for the tag' })
  postsBySlug(
    @Param('slug') slug: string,
    @Query() query: PaginationQueryDto,
  ) {
    const page = query.page ?? PAGINATION_DEFAULT_PAGE;
    const limit = query.limit ?? PAGINATION_DEFAULT_LIMIT;
    return this.tags.findPostsBySlug(slug, page, limit);
  }
}
