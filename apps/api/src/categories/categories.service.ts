import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { PostsService } from '../posts/posts.service';
import { PostStatus } from '../common/enums';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private readonly categories: Model<CategoryDocument>,
    @InjectModel(Post.name) private readonly posts: Model<PostDocument>,
    private readonly postsService: PostsService,
  ) {}

  async create(dto: CreateCategoryDto) {
    try {
      const doc = await this.categories.create({
        name: dto.name.trim(),
        slug: dto.slug.trim().toLowerCase(),
      });
      return doc.toObject();
    } catch (e) {
      this.throwIfDup(e);
      throw e;
    }
  }

  async findAllPublic() {
    const cats = await this.categories.find().sort({ name: 1 }).lean().exec();
    const counts = await this.posts.aggregate<{ _id: string; count: number }>([
      { $match: { status: PostStatus.Published } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const map = new Map(counts.map((c) => [String(c._id), c.count]));
    return cats.map((c) => ({
      ...c,
      id: String(c._id),
      postCount: map.get(String(c._id)) ?? 0,
    }));
  }

  async findAllAdmin() {
    const cats = await this.categories.find().sort({ name: 1 }).lean().exec();
    const counts = await this.posts.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const map = new Map(counts.map((c) => [String(c._id), c.count]));
    return cats.map((c) => ({
      ...c,
      id: String(c._id),
      postCount: map.get(String(c._id)) ?? 0,
    }));
  }

  async findPostsBySlug(slug: string, page: number, limit: number) {
    return this.postsService.findPublishedByCategorySlug(slug, page, limit);
  }

  async findBySlug(slug: string) {
    const cat = await this.categories
      .findOne({ slug: slug.toLowerCase() })
      .lean()
      .exec();
    if (!cat) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return { ...cat, id: String(cat._id) };
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }
    if (dto.slug !== undefined) {
      data.slug = dto.slug.trim().toLowerCase();
    }
    try {
      const updated = await this.categories
        .findByIdAndUpdate(id, data, { new: true, runValidators: true })
        .lean()
        .exec();
      if (!updated) {
        throw new NotFoundException('Categoría no encontrada');
      }
      return { ...updated, id: String(updated._id) };
    } catch (e) {
      this.throwIfDup(e);
      throw e;
    }
  }

  async remove(id: string) {
    const inUse = await this.posts.exists({ category: id }).exec();
    if (inUse) {
      throw new ConflictException(
        'No se puede eliminar: hay posts usando esta categoría',
      );
    }
    const deleted = await this.categories.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return { ok: true };
  }

  private throwIfDup(error: unknown) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? (error as { code: number }).code
        : undefined;
    if (code === 11000) {
      throw new ConflictException('Slug de categoría duplicado');
    }
  }
}
