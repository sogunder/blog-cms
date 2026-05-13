import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { Tag, TagSchema } from '../tags/schemas/tag.schema';
import { Post, PostSchema } from './schemas/post.schema';
import { PostsService } from './posts.service';
import { PostsPublicController } from './posts-public.controller';
import { PostsAdminController } from './posts-admin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
    ]),
  ],
  controllers: [PostsPublicController, PostsAdminController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
