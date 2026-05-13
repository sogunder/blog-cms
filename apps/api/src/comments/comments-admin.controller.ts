import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_PAGE,
  PaginationQueryDto,
} from '../common/dto/pagination-query.dto';
import { UserRole } from '../common/enums';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('admin/comments')
export class CommentsAdminController {
  constructor(private readonly comments: CommentsService) {}

  @Roles(UserRole.Admin, UserRole.Editor)
  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    const page = query.page ?? PAGINATION_DEFAULT_PAGE;
    const limit = query.limit ?? PAGINATION_DEFAULT_LIMIT;
    return this.comments.findAdmin(page, limit);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Patch(':id')
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.comments.updateStatus(id, dto);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.comments.remove(id);
  }
}
