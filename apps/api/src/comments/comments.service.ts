import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentStatus, PostStatus, UserRole } from '../common/enums';
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

  async findAdmin(page: number, limit: number, authorId?: string, userRole?: UserRole): Promise<PaginatedResult<unknown>> {
    const skip = (page - 1) * limit;

    // Si es editor, filtrar comentarios solo de sus posts
    let filter: Record<string, unknown> = {};
    if (userRole === UserRole.Editor && authorId) {
      const userPostIds = await this.posts
        .find({ author: new Types.ObjectId(authorId) })
        .select('_id')
        .lean()
        .exec()
        .then((posts) => posts.map((p) => p._id));

      if (userPostIds.length > 0) {
        filter = { post: { $in: userPostIds } };
      } else {
        // Si el editor no tiene posts, retornar vacío
        return {
          data: [],
          total: 0,
          page,
          limit,
          totalPages: 1,
        };
      }
    }

    const [total, rows] = await Promise.all([
      this.comments.countDocuments(filter).exec(),
      this.comments
        .find(filter)
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

  async updateStatus(id: string, dto: UpdateCommentDto, authorId?: string, userRole?: UserRole) {
    const comment = await this.comments
      .findById(id)
      .populate({
        path: 'post',
        select: 'author',
        populate: { path: 'author', select: '_id' }
      })
      .exec();
    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    // Si es editor, validar que el comentario pertenece a uno de sus posts
    if (userRole === UserRole.Editor && authorId) {
      const postAuthorId = (comment.post as any)?.author?._id?.toString?.() ||
                           String((comment.post as any)?.author?._id);
      if (postAuthorId !== authorId) {
        throw new ForbiddenException('No puedes moderar comentarios de posts ajenos');
      }
    }

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

  async remove(id: string, authorId?: string, userRole?: UserRole) {
    const comment = await this.comments
      .findById(id)
      .populate({
        path: 'post',
        select: 'author',
        populate: { path: 'author', select: '_id' }
      })
      .exec();
    if (!comment) {
      throw new NotFoundException('Comentario no encontrado');
    }

    // Si es editor, validar que el comentario pertenece a uno de sus posts
    if (userRole === UserRole.Editor && authorId) {
      const postAuthorId = (comment.post as any)?.author?._id?.toString?.() ||
                           String((comment.post as any)?.author?._id);
      if (postAuthorId !== authorId) {
        throw new ForbiddenException('No puedes eliminar comentarios de posts ajenos');
      }
    }

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
