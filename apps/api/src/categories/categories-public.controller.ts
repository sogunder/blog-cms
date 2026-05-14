import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PaginationQueryDto,
} from '../common/dto/pagination-query.dto';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesPublicController {
  constructor(private readonly categories: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all public categories' })
  @ApiResponse({ status: 200, description: 'Return all categories' })
  list() {
    return this.categories.findAllPublic();
  }

  @Public()
  @Get(':slug/posts')
  @ApiOperation({ summary: 'Get posts by category slug' })
  @ApiResponse({ status: 200, description: 'Return paginated posts for the category' })
  postsBySlug(
    @Param('slug') slug: string,
    @Query() query: PaginationQueryDto,
  ) {
    const page = query.page ?? PAGINATION_DEFAULT_PAGE;
    const limit = query.limit ?? PAGINATION_DEFAULT_LIMIT;
    return this.categories.findPostsBySlug(slug, page, limit);
  }
}
