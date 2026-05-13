import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PaginationQueryDto,
} from '../common/dto/pagination-query.dto';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesPublicController {
  constructor(private readonly categories: CategoriesService) {}

  @Public()
  @Get()
  list() {
    return this.categories.findAllPublic();
  }

  @Public()
  @Get(':slug/posts')
  postsBySlug(
    @Param('slug') slug: string,
    @Query() query: PaginationQueryDto,
  ) {
    const page = query.page ?? PAGINATION_DEFAULT_PAGE;
    const limit = query.limit ?? PAGINATION_DEFAULT_LIMIT;
    return this.categories.findPostsBySlug(slug, page, limit);
  }
}
