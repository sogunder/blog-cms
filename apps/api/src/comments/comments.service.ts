import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentStatus, PostStatus } from '../common/enums';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

const populateList = [
  { path: 'post', select: 'title slug' },
  { path: 'author', select: 'email name role' },
];

function mapComment(doc: unknown) {
  const d = doc as Record<string, unknown>;
  const post = d.post as Record<string, unknown> | undefined;
  const author = d.author as Record<string, unknown> | undefined;
  return {
    id: String(d._id),
    content: d.content,
    status: d.status,
    createdAt: d.createdAt,
    post: post
      ? { id: String(post._id), title: post.title, slug: post.slug }
      : null,
    user: author
      ? {
          id: String(author._id),
          name: author.name,
          email: author.email,
          role: author.role,
          createdAt: author.createdAt ?? '',
        }
      : {
          id: 'guest',
          name: (d.guestName as string) || 'Anónimo',
          email: (d.guestEmail as string) || '',
          role: 'reader',
          createdAt: '',
        },
    guestName: d.guestName,
    guestEmail: d.guestEmail,
  };
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly comments: Model<CommentDocument>,
    @InjectModel(Post.name) private readonly posts: Model<PostDocument>,
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
  ) {}

  async createPublic(dto: CreateCommentDto, user?: JwtPayload) {
    const post = await this.posts.findById(dto.post).lean().exec();
    if (!post || post.status !== PostStatus.Published) {
      throw new NotFoundException('Post no disponible para comentarios');
    }

    if (user) {
      const u = await this.users.findById(user.sub).lean().exec();
      if (!u) {
        throw new BadRequestException('Usuario no válido');
      }
      const doc = await this.comments.create({
        post: new Types.ObjectId(dto.post),
        content: dto.content.trim(),
        status: CommentStatus.Pending,
        author: new Types.ObjectId(user.sub),
        guestName: '',
        guestEmail: '',
      });
      const populated = await doc.populate(populateList);
      return mapComment(populated.toObject());
    }

    const guestName = dto.guestName?.trim();
    const guestEmail = dto.guestEmail?.trim();
    if (!guestName || !guestEmail) {
      throw new BadRequestException('Nombre y email son obligatorios');
    }

    const doc = await this.comments.create({
      post: new Types.ObjectId(dto.post),
      content: dto.content.trim(),
      status: CommentStatus.Pending,
      author: null,
      guestName,
      guestEmail: guestEmail.toLowerCase(),
    });
    const populated = await doc.populate(populateList);
    return mapComment(populated.toObject());
  }

  async findAdmin(page: number, limit: number): Promise<PaginatedResult<unknown>> {
    const skip = (page - 1) * limit;
    const [total, rows] = await Promise.all([
      this.comments.countDocuments().exec(),
      this.comments
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(populateList)
        .lean()
        .exec(),
    ]);
    return {
      data: rows.map((r) => mapComment(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async updateStatus(id: string, dto: UpdateCommentDto) {
    const updated = await this.comments
      .findByIdAndUpdate(
        id,
        { status: dto.status },
        { new: true, runValidators: true },
      )
      .populate(populateList)
      .lean()
      .exec();
    if (!updated) {
      throw new NotFoundException('Comentario no encontrado');
    }
    return mapComment(updated);
  }

  async remove(id: string) {
    const deleted = await this.comments.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Comentario no encontrado');
    }
    return { ok: true };
  }

  async countPending() {
    return this.comments.countDocuments({ status: CommentStatus.Pending }).exec();
  }

  async findByPostPublic(postId: string) {
    const rows = await this.comments
      .find({ post: new Types.ObjectId(postId), status: CommentStatus.Approved })
      .sort({ createdAt: 1 })
      .populate(populateList)
      .lean()
      .exec();
    return rows.map((r) => mapComment(r));
  }
}
