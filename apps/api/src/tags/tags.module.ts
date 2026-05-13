import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import { PostsModule } from '../posts/posts.module';
import { Tag, TagSchema } from './schemas/tag.schema';
import { TagsAdminController } from './tags-admin.controller';
import { TagsPublicController } from './tags-public.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    PostsModule,
  ],
  controllers: [TagsPublicController, TagsAdminController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
