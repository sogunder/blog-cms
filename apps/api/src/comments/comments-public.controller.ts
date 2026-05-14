import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { OptionalJwtGuard } from '../auth/optional-jwt.guard';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsPublicController {
  constructor(private readonly comments: CommentsService) {}

  @Public()
  @UseGuards(OptionalJwtGuard)
  @Post()
  create(
    @Body() dto: CreateCommentDto,
    @Req() req: Request & { user?: JwtPayload },
  ) {
    return this.comments.createPublic(dto, req.user);
  }

  @Public()
  @Get('post/:postId')
  getByPost(@Param('postId') postId: string) {
    return this.comments.findByPostPublic(postId);
  }
}
