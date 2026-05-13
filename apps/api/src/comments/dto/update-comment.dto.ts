import { IsEnum, IsOptional } from 'class-validator';
import { CommentStatus } from '../../common/enums';

export class UpdateCommentDto {
  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;
}
