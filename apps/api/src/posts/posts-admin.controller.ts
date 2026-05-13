import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PaginationQueryDto,
} from '../common/dto/pagination-query.dto';
import { UserRole } from '../common/enums';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('admin/posts')
export class PostsAdminController {
  constructor(private readonly posts: PostsService) {}

  @Roles(UserRole.Admin, UserRole.Editor)
  @Get()
  list(@Query() query: PaginationQueryDto) {
    const page = query.page ?? PAGINATION_DEFAULT_PAGE;
    const limit = query.limit ?? PAGINATION_DEFAULT_LIMIT;
    return this.posts.findAdmin(page, limit);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Get(':id')
  one(@Param('id', ParseObjectIdPipe) id: string) {
    return this.posts.findOneAdmin(id);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreatePostDto) {
    return this.posts.create(user.sub, dto);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.posts.update(id, dto);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.posts.remove(id);
  }
}
