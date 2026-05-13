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

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tags: Model<TagDocument>,
    @InjectModel(Post.name) private readonly posts: Model<PostDocument>,
    private readonly postsService: PostsService,
  ) {}

  async create(dto: CreateTagDto) {
    try {
      const doc = await this.tags.create({
        name: dto.name.trim(),
        slug: dto.slug.trim().toLowerCase(),
      });
      return { ...doc.toObject(), id: String(doc._id) };
    } catch (e) {
      this.throwIfDup(e);
      throw e;
    }
  }

  async findAllPublic() {
    const list = await this.tags.find().sort({ name: 1 }).lean().exec();
    const counts = await this.posts.aggregate<{ _id: string; count: number }>([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
    ]);
    const map = new Map(counts.map((c) => [String(c._id), c.count]));
    return list.map((t) => ({
      ...t,
      id: String(t._id),
      postCount: map.get(String(t._id)) ?? 0,
    }));
  }

  async findAllAdmin() {
    return this.findAllPublic();
  }

  async update(id: string, dto: UpdateTagDto) {
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
      return { ...updated, id: String(updated._id) };
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
