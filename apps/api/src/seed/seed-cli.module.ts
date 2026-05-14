import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { Comment, CommentSchema } from '../comments/schemas/comment.schema';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { Tag, TagSchema } from '../tags/schemas/tag.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { DemoSeedService } from './demo-seed.service';

/** Contexto mínimo Nest + Mongo solo para scripts `pnpm seed:*`. */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/blog-cms',
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  providers: [DemoSeedService],
})
export class SeedCliModule {}
