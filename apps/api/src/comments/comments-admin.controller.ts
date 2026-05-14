import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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

@ApiTags('comments')
@ApiBearerAuth()
@Controller('admin/comments')
export class CommentsAdminController {
  constructor(private readonly comments: CommentsService) {}

  @Roles(UserRole.Admin, UserRole.Editor)
  @Get()
  @ApiOperation({ summary: 'List all comments (admin)' })
  @ApiResponse({ status: 200, description: 'Return all comments' })
  findAll(@Query() query: PaginationQueryDto) {
    const page = query.page ?? PAGINATION_DEFAULT_PAGE;
    const limit = query.limit ?? PAGINATION_DEFAULT_LIMIT;
    return this.comments.findAdmin(page, limit);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Patch(':id')
  @ApiOperation({ summary: 'Update comment status' })
  @ApiResponse({ status: 200, description: 'Comment status updated successfully' })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.comments.updateStatus(id, dto);
  }

  @Roles(UserRole.Admin, UserRole.Editor)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.comments.remove(id);
  }
}
