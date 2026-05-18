import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { Tag, TagDocument } from '../tags/schemas/tag.schema';
import { PaginatedResult } from '../common/interfaces/paginated-result.interface';
import { PostStatus, UserRole } from '../common/enums';
import { slugify } from '../common/utils/slug';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schemas/post.schema';

const populate = [
  { path: 'author', select: 'email name role' },
  { path: 'category' },
  { path: 'tags' },
];

function mapAuthor(a: unknown) {
  if (!a || typeof a !== 'object') {
    return null;
  }
  const o = a as Record<string, unknown>;
  return {
    id: String(o._id),
    email: o.email,
    name: o.name,
    role: o.role,
    createdAt: o.createdAt ?? new Date().toISOString(),
  };
}

function mapCategory(c: unknown) {
  if (!c || typeof c !== 'object') {
    return null;
  }
  const o = c as Record<string, unknown>;
  return {
    id: String(o._id),
    name: o.name,
    slug: o.slug,
  };
}

function mapTags(tags: unknown) {
  if (!Array.isArray(tags)) {
    return [];
  }
  return tags.map((t) => {
    const o = t as Record<string, unknown>;
    return {
      id: String(o._id),
      name: o.name,
      slug: o.slug,
    };
  });
}

function mapPost(doc: unknown) {
  const d = doc as Record<string, unknown>;
  return {
    id: String(d._id),
    title: d.title,
    slug: d.slug,
    content: d.content ?? '',
    summary: d.summary ?? '',
    status: d.status,
    views: d.views ?? 0,
    author: mapAuthor(d.author),
    category: mapCategory(d.category),
    tags: mapTags(d.tags),
    publishedAt: d.publishedAt,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly posts: Model<PostDocument>,
    @InjectModel(Category.name) private readonly categories: Model<CategoryDocument>,
    @InjectModel(Tag.name) private readonly tags: Model<TagDocument>,
  ) {}

  async create(
  authorId: string,
  dto: CreatePostDto,
  userRole?: UserRole,
) {
    await this.ensureCategory(dto.category);
    const tagIds = await this.resolveTags(dto.tags ?? []);
    const slug = await this.uniqueSlug(dto.slug?.trim() || slugify(dto.title));
    const status =
  userRole === UserRole.Admin
    ? dto.status ?? PostStatus.Published
    : PostStatus.Pending;
    const publishedAt =
      status === PostStatus.Published ? new Date() : null;

    try {
      const doc = await this.posts.create({
        title: dto.title.trim(),
        slug,
        content: dto.content ?? '',
        summary: dto.summary ?? '',
        status,
        views: 0,
        author: new Types.ObjectId(authorId),
        category: new Types.ObjectId(dto.category),
        tags: tagIds,
        publishedAt,
      });
      const populated = await doc.populate(populate);
      return mapPost(populated.toObject());
    } catch (e) {
      this.throwIfDup(e);
      throw e;
    }
  }

  async update(id: string, dto: UpdatePostDto, authorId?: string, userRole?: UserRole) {
    const existing = await this.posts.findById(id).exec();
    if (!existing) {
      throw new NotFoundException('Post no encontrado');
    }

    // Si es editor, validar que es propietario del post
    if (userRole === UserRole.Editor && existing.author.toString() !== authorId) {
      throw new ForbiddenException('No puedes editar posts de otros usuarios');
    }

    const data: Record<string, unknown> = {};

    if (dto.title !== undefined) {
      data.title = dto.title.trim();
    }
    if (dto.content !== undefined) {
      data.content = dto.content;
    }
    if (dto.summary !== undefined) {
      data.summary = dto.summary;
    }
    if (dto.category !== undefined) {
      await this.ensureCategory(dto.category);
      data.category = new Types.ObjectId(dto.category);
    }
    if (dto.tags !== undefined) {
      data.tags = await this.resolveTags(dto.tags);
    }

    if (dto.slug !== undefined && dto.slug.trim()) {
      data.slug = await this.uniqueSlug(dto.slug.trim(), id);
    } else if (dto.title !== undefined && !dto.slug) {
      data.slug = await this.uniqueSlug(slugify(dto.title), id);
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
      if (dto.status === PostStatus.Published && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
      if (dto.status === PostStatus.Draft) {
        data.publishedAt = null;
      }
    }

    try {
      const updated = await this.posts
        .findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .populate(populate)
        .lean()
        .exec();
      if (!updated) {
        throw new NotFoundException('Post no encontrado');
      }
      return mapPost(updated);
    } catch (e) {
      this.throwIfDup(e);
      throw e;
    }
  }

  async remove(id: string, authorId?: string, userRole?: UserRole) {
    const post = await this.posts.findById(id).exec();
    if (!post) {
      throw new NotFoundException('Post no encontrado');
    }

    // Si es editor, validar que es propietario del post
    if (userRole === UserRole.Editor && post.author.toString() !== authorId) {
      throw new ForbiddenException('No puedes eliminar posts de otros usuarios');
    }

    const deleted = await this.posts.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Post no encontrado');
    }
    return { ok: true };
  }

  async findPublished(page: number, limit: number): Promise<PaginatedResult<unknown>> {
    const filter = { status: PostStatus.Published };
    const skip = (page - 1) * limit;
    const [total, rows] = await Promise.all([
      this.posts.countDocuments(filter).exec(),
      this.posts
        .find(filter)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(populate)
        .lean()
        .exec(),
    ]);
    return {
      data: rows.map((r) => mapPost(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findBySlugPublic(slug: string) {
    const doc = await this.posts
      .findOneAndUpdate(
        { slug: slug.toLowerCase(), status: PostStatus.Published },
        { $inc: { views: 1 } },
        { new: true },
      )
      .populate(populate)
      .lean()
      .exec();
    if (!doc) {
      throw new NotFoundException('Post no encontrado');
    }
    return mapPost(doc);
  }

  async findAdmin(page: number, limit: number, authorId?: string, userRole?: UserRole): Promise<PaginatedResult<unknown>> {
    const skip = (page - 1) * limit;
    
    // Si es editor, filtrar por author
    const filter = userRole === UserRole.Editor && authorId
      ? { author: new Types.ObjectId(authorId) }
      : {};
    
    const [total, rows] = await Promise.all([
      this.posts.countDocuments(filter).exec(),
      this.posts
        .find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(populate)
        .lean()
        .exec(),
    ]);
    return {
      data: rows.map((r) => mapPost(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOneAdmin(id: string, authorId?: string, userRole?: UserRole) {
    const doc = await this.posts.findById(id).populate(populate).lean().exec();
    if (!doc) {
      throw new NotFoundException('Post no encontrado');
    }

    // Si es editor, validar que es propietario del post
    if (userRole === UserRole.Editor && authorId) {
      const docAuthorId = typeof (doc.author as any)?._id === 'object'
        ? (doc.author as any)._id.toString()
        : String((doc.author as any)?._id);
      if (docAuthorId !== authorId) {
        throw new ForbiddenException('No puedes ver este post');
      }
    }

    return mapPost(doc);
  }

  async findPublishedByCategorySlug(
    categorySlug: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<unknown>> {
    const cat = await this.categories
      .findOne({ slug: categorySlug.toLowerCase() })
      .lean()
      .exec();
    if (!cat) {
      throw new NotFoundException('Categoría no encontrada');
    }
    const filter = {
      category: cat._id,
      status: PostStatus.Published,
    };
    const skip = (page - 1) * limit;
    const [total, rows] = await Promise.all([
      this.posts.countDocuments(filter).exec(),
      this.posts
        .find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(populate)
        .lean()
        .exec(),
    ]);
    return {
      data: rows.map((r) => mapPost(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findPublishedByTagSlug(
    tagSlug: string,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<unknown>> {
    const tag = await this.tags
      .findOne({ slug: tagSlug.toLowerCase() })
      .lean()
      .exec();
    if (!tag) {
      throw new NotFoundException('Tag no encontrado');
    }
    const filter = {
      tags: tag._id,
      status: PostStatus.Published,
    };
    const skip = (page - 1) * limit;
    const [total, rows] = await Promise.all([
      this.posts.countDocuments(filter).exec(),
      this.posts
        .find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(populate)
        .lean()
        .exec(),
    ]);
    return {
      data: rows.map((r) => mapPost(r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  private async ensureCategory(id: string) {
    const exists = await this.categories.exists({ _id: id }).exec();
    if (!exists) {
      throw new BadRequestException('Categoría inválida');
    }
  }

  private async resolveTags(ids: string[]) {
    if (!ids.length) {
      return [];
    }
    const found = await this.tags.find({ _id: { $in: ids } }).select('_id').lean().exec();
    if (found.length !== ids.length) {
      throw new BadRequestException('Uno o más tags no existen');
    }
    return ids.map((id) => new Types.ObjectId(id));
  }

  private async uniqueSlug(base: string, excludeId?: string) {
    let slug = base || 'post';
    let n = 0;
    while (true) {
      const q: Record<string, unknown> = { slug };
      if (excludeId) {
        q._id = { $ne: new Types.ObjectId(excludeId) };
      }
      const exists = await this.posts.exists(q).exec();
      if (!exists) {
        return slug;
      }
      n += 1;
      slug = `${base}-${n}`;
    }
  }

  private throwIfDup(error: unknown) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? (error as { code: number }).code
        : undefined;
    if (code === 11000) {
      throw new ConflictException('Slug de post duplicado');
    }
  }
}
