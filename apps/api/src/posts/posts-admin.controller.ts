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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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

@ApiTags('posts')
@ApiBearerAuth()
@Controller('admin/posts')
export class PostsAdminController {
  constructor(private readonly posts: PostsService) {}

  @Roles(UserRole.Admin, UserRole.Editor)
  @Get()
  @ApiOperation({ summary: 'List all posts (admin)' })
  @ApiResponse({ status: 200, description: 'Return all posts' })
  list(
    @CurrentUser() user: JwtPayload,
    @Query() query: PaginationQueryDto,
  ) {
    const page = query.page ?? PAGINATION_DEFAULT_PAGE;
    const limit = query.limit ?? PAGINATION_DEFAULT_LIMIT;
    return this.posts.findAdmin(page, limit, user.sub, user.role);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by ID (admin)' })
  @ApiResponse({ status: 200, description: 'Return post data' })
  one(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.posts.findOneAdmin(id, user.sub, user.role);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreatePostDto,
  ) {
    return this.posts.create(
      user.sub,
      dto,
      user.role,
    );
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.posts.update(id, dto, user.sub, user.role);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  remove(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.posts.remove(id, user.sub, user.role);
  }
}
