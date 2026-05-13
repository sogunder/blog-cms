import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PostStatus } from '../../common/enums';
import { Category } from '../../categories/schemas/category.schema';
import { Tag } from '../../tags/schemas/tag.schema';
import { User } from '../../users/schemas/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, maxlength: 200 })
  slug: string;

  @Prop({ type: String, default: '' })
  content: string;

  @Prop({ type: String, default: '' })
  summary: string;

  @Prop({ type: String, enum: Object.values(PostStatus), default: PostStatus.Draft })
  status: PostStatus;

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: Tag.name }], default: [] })
  tags: Types.ObjectId[];

  @Prop({ type: Date, default: null })
  publishedAt: Date | null;
}

export const PostSchema = SchemaFactory.createForClass(Post);
