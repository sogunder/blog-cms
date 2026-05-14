import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsPublicController {
  constructor(private readonly comments: CommentsService) {}

  @Public()
  @UseGuards(OptionalJwtGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  create(
    @Body() dto: CreateCommentDto,
    @Req() req: Request & { user?: JwtPayload },
  ) {
    return this.comments.createPublic(dto, req.user);
  }

  @Public()
  @Get('post/:postId')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiResponse({ status: 200, description: 'Return all public comments for the post' })
  getByPost(@Param('postId') postId: string) {
    return this.comments.findByPostPublic(postId);
  }
}
