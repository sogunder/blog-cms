import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { PostsService } from '../posts/posts.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag, TagDocument } from './schemas/tag.schema';

type TagRow = {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type TagSingle = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tags: Model<TagDocument>,
    @InjectModel(Post.name) private readonly posts: Model<PostDocument>,
    private readonly postsService: PostsService,
  ) {}

  async create(dto: CreateTagDto): Promise<TagSingle> {
    try {
      const doc = await this.tags.create({
        name: dto.name.trim(),
        slug: dto.slug.trim().toLowerCase(),
      });
      const o = doc.toObject();
      return {
        id: String(doc._id),
        name: o.name,
        slug: o.slug,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      };
    } catch (e) {
      this.throwIfDup(e);
      throw e;
    }
  }

  async findAllPublic(): Promise<TagRow[]> {
    const list = await this.tags.find().sort({ name: 1 }).lean().exec();
    const counts = await this.posts.aggregate<{ _id: string; count: number }>([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
    ]);
    const map = new Map(counts.map((c) => [String(c._id), c.count]));
    return list.map((t) => ({
      id: String(t._id),
      name: t.name,
      slug: t.slug,
      postCount: map.get(String(t._id)) ?? 0,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }

  async findAllAdmin(): Promise<TagRow[]> {
    return this.findAllPublic();
  }

  async update(id: string, dto: UpdateTagDto): Promise<TagSingle> {
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }
    if (dto.slug !== undefined) {
      data.slug = dto.slug.trim().toLowerCase();
    }
    try {
      const updated = await this.tags
        .findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .lean()
        .exec();
      if (!updated) {
        throw new NotFoundException('Tag no encontrado');
      }
      return {
        id: String(updated._id),
        name: updated.name,
        slug: updated.slug,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
    } catch (e) {
      this.throwIfDup(e);
      throw e;
    }
  }

  async remove(id: string) {
    const inUse = await this.posts.exists({ tags: id }).exec();
    if (inUse) {
      throw new ConflictException('No se puede eliminar: hay posts con este tag');
    }
    const deleted = await this.tags.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Tag no encontrado');
    }
    return { ok: true };
  }

  async findPostsBySlug(slug: string, page: number, limit: number) {
    return this.postsService.findPublishedByTagSlug(slug, page, limit);
  }

  private throwIfDup(error: unknown) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? (error as { code: number }).code
        : undefined;
    if (code === 11000) {
      throw new ConflictException('Slug de tag duplicado');
    }
  }
}
