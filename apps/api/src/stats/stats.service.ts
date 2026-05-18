import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentStatus, PostStatus, UserRole } from '../common/enums';
import { Comment, CommentDocument } from '../comments/schemas/comment.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Post.name) private readonly posts: Model<PostDocument>,
    @InjectModel(Comment.name) private readonly comments: Model<CommentDocument>,
  ) {}

  async dashboard(userId?: string, userRole?: UserRole) {
    // Si es editor, obtener solo sus estadísticas
    const authorFilter = userRole === UserRole.Editor && userId
      ? { author: new Types.ObjectId(userId) }
      : {};

    const [totalPosts, publishedPosts, pendingComments, viewsSum] =
      await Promise.all([
        this.posts.countDocuments(authorFilter).exec(),
        this.posts.countDocuments({ ...authorFilter, status: PostStatus.Published }).exec(),
        this.getEditorPendingComments(userId, userRole),
        this.getViewsSum(authorFilter),
      ]);

    return {
      totalPosts,
      publishedPosts,
      pendingComments,
      totalViews: viewsSum,
    };
  }

  private async getEditorPendingComments(userId?: string, userRole?: UserRole) {
    if (userRole === UserRole.Editor && userId) {
      // Comentarios pendientes solo en posts del editor
      const authorId = new Types.ObjectId(userId);
      return this.comments.countDocuments({
        $and: [
          { status: CommentStatus.Pending },
          {
            post: {
              $in: await this.posts
                .find({ author: authorId })
                .select('_id')
                .lean()
                .exec()
                .then((posts) => posts.map((p) => p._id)),
            },
          },
        ],
      }).exec();
    }

    return this.comments
      .countDocuments({ status: CommentStatus.Pending })
      .exec();
  }

  private async getViewsSum(filter: Record<string, unknown>) {
    return this.posts
      .aggregate<{ t: number }>([
        { $match: filter },
        { $group: { _id: null, t: { $sum: '$views' } } },
      ])
      .then((r) => r[0]?.t ?? 0);
  }
}
