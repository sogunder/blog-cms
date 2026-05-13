import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CommentStatus } from '../../common/enums';
import { Post } from '../../posts/schemas/post.schema';
import { User } from '../../users/schemas/user.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: Post.name, required: true })
  post: Types.ObjectId;

  @Prop({ required: true, maxlength: 8000 })
  content: string;

  @Prop({ type: String, enum: Object.values(CommentStatus), default: CommentStatus.Pending })
  status: CommentStatus;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  author: Types.ObjectId | null;

  @Prop({ trim: true, default: '' })
  guestName: string;

  @Prop({ trim: true, lowercase: true, default: '' })
  guestEmail: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
