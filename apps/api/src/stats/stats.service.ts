import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentStatus, PostStatus } from '../common/enums';
import { Comment, CommentDocument } from '../comments/schemas/comment.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Post.name) private readonly posts: Model<PostDocument>,
    @InjectModel(Comment.name) private readonly comments: Model<CommentDocument>,
  ) {}

  async dashboard() {
    const [totalPosts, publishedPosts, pendingComments, viewsSum] =
      await Promise.all([
        this.posts.countDocuments().exec(),
        this.posts.countDocuments({ status: PostStatus.Published }).exec(),
        this.comments.countDocuments({ status: CommentStatus.Pending }).exec(),
        this.posts
          .aggregate<{ t: number }>([{ $group: { _id: null, t: { $sum: '$views' } } }])
          .then((r) => r[0]?.t ?? 0),
      ]);

    return {
      totalPosts,
      publishedPosts,
      pendingComments,
      totalViews: viewsSum,
    };
  }
}
