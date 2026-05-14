import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentStatus, PostStatus, UserRole } from '../common/enums';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { Comment, CommentDocument } from '../comments/schemas/comment.schema';
import { Post, PostDocument } from '../posts/schemas/post.schema';
import { Tag, TagDocument } from '../tags/schemas/tag.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { hashUserPassword } from '../users/users.crypto';

const DEMO_PASSWORD = '123456';
const MARKER_SLUG = 'seed-demo-bienvenida';

@Injectable()
export class DemoSeedService {
  private readonly logger = new Logger(DemoSeedService.name);

  constructor(
    @InjectModel(User.name) private readonly users: Model<UserDocument>,
    @InjectModel(Category.name) private readonly categories: Model<CategoryDocument>,
    @InjectModel(Tag.name) private readonly tags: Model<TagDocument>,
    @InjectModel(Post.name) private readonly posts: Model<PostDocument>,
    @InjectModel(Comment.name) private readonly comments: Model<CommentDocument>,
  ) {}

  /** Solo admin@admin.cl + user@user.cl (contraseña 123456). */
  async seedUsers(): Promise<void> {
    const hash = await hashUserPassword(DEMO_PASSWORD);
    await this.upsertUser(
      'admin@admin.cl',
      'Administrador demo',
      UserRole.Admin,
      hash,
    );
    await this.upsertUser('user@user.cl', 'Usuario demo', UserRole.Reader, hash);
    this.logger.log('Usuarios: admin@admin.cl (admin), user@user.cl (reader) — 123456');
  }

  /** Usuarios + categorías, tags, posts y comentarios (idempotente por post marcador). */
  async seedDemo(): Promise<void> {
    await this.seedUsers();
    await this.seedDemoContent();
  }

  private async seedDemoContent(): Promise<void> {
    if (await this.posts.exists({ slug: MARKER_SLUG }).exec()) {
      this.logger.log('Contenido demo ya existe (slug marcador). Omitido.');
      return;
    }

    const admin = await this.users.findOne({ email: 'admin@admin.cl' }).lean();
    const reader = await this.users.findOne({ email: 'user@user.cl' }).lean();
    if (!admin?._id || !reader?._id) {
      throw new Error('Ejecuta antes seed:users o seed:demo con usuarios creados');
    }
    const adminId = admin._id as Types.ObjectId;
    const readerId = reader._id as Types.ObjectId;

    const cat = await this.ensureCategories();
    const tag = await this.ensureTags();
    const now = new Date();

    const p1 = await this.posts.create({
      title: 'Bienvenida al blog (demo)',
      slug: MARKER_SLUG,
      summary:
        'Post de ejemplo: categorías, tags y comentarios de prueba (pnpm seed:demo).',
      content:
        '<p>Este contenido es <strong>HTML</strong> de demostración.</p><p>Úsalo para probar listados, detalle y moderación.</p>',
      status: PostStatus.Published,
      views: 42,
      author: adminId,
      category: cat.tutoriales,
      tags: [tag.nestjs, tag.react],
      publishedAt: now,
    });

    const p2 = await this.posts.create({
      title: 'React 19 y el panel admin',
      slug: 'seed-demo-react-admin',
      summary: 'Segundo artículo publicado con varios tags.',
      content:
        '<h2>Introducción</h2><p>Texto ficticio para rellenar el cuerpo del artículo.</p>',
      status: PostStatus.Published,
      views: 18,
      author: adminId,
      category: cat.noticias,
      tags: [tag.react, tag.typescript],
      publishedAt: now,
    });

    const p3 = await this.posts.create({
      title: 'Índices en MongoDB',
      slug: 'seed-demo-mongodb-indices',
      summary: 'Tercer post en categoría Opinión.',
      content:
        '<p>Los índices aceleran consultas frecuentes. En este demo solo hay texto placeholder.</p>',
      status: PostStatus.Published,
      views: 7,
      author: adminId,
      category: cat.opinion,
      tags: [tag.mongodb],
      publishedAt: now,
    });

    await this.posts.create({
      title: 'Borrador interno (no visible en público)',
      slug: 'seed-demo-borrador',
      summary: 'Solo aparece en el listado admin.',
      content: '<p>Contenido en borrador.</p>',
      status: PostStatus.Draft,
      views: 0,
      author: readerId,
      category: cat.tutoriales,
      tags: [tag.nestjs],
      publishedAt: null,
    });

    await this.comments.insertMany([
      {
        post: p1._id,
        content: '¡Excelente primer artículo! (comentario invitado, pendiente)',
        status: CommentStatus.Pending,
        author: null,
        guestName: 'Visitante',
        guestEmail: 'visitante@example.com',
      },
      {
        post: p1._id,
        content: 'Comentario del usuario reader, aprobado.',
        status: CommentStatus.Approved,
        author: readerId,
        guestName: '',
        guestEmail: '',
      },
      {
        post: p1._id,
        content: 'Posible spam enlazando cosas...',
        status: CommentStatus.Spam,
        author: null,
        guestName: 'Bot',
        guestEmail: 'spam@example.com',
      },
      {
        post: p2._id,
        content: 'Muy útil, gracias.',
        status: CommentStatus.Approved,
        author: adminId,
        guestName: '',
        guestEmail: '',
      },
      {
        post: p2._id,
        content: '¿Tienes más ejemplos?',
        status: CommentStatus.Pending,
        author: readerId,
        guestName: '',
        guestEmail: '',
      },
      {
        post: p3._id,
        content: 'Buen resumen sobre índices.',
        status: CommentStatus.Pending,
        author: null,
        guestName: 'Lector anónimo',
        guestEmail: 'anon@example.com',
      },
    ]);

    this.logger.log(
      'Contenido demo: categorías, tags, 4 posts (3 publicados), 6 comentarios.',
    );
  }

  private async upsertUser(
    email: string,
    name: string,
    role: UserRole,
    passwordHash: string,
  ) {
    const normalized = email.trim().toLowerCase();
    await this.users.findOneAndUpdate(
      { email: normalized },
      {
        $set: {
          email: normalized,
          name,
          role,
          passwordHash,
          isActive: true,
          lastAccess: null,
        },
      },
      { upsert: true },
    );
  }

  private async ensureCategories(): Promise<{
    tutoriales: Types.ObjectId;
    noticias: Types.ObjectId;
    opinion: Types.ObjectId;
  }> {
    const upsert = async (name: string, slug: string) => {
      const doc = await this.categories.findOneAndUpdate(
        { slug },
        { $set: { name: name.trim(), slug } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      if (!doc) throw new Error(`Categoría ${slug}`);
      return doc._id as Types.ObjectId;
    };
    return {
      tutoriales: await upsert('Tutoriales', 'tutoriales'),
      noticias: await upsert('Noticias', 'noticias'),
      opinion: await upsert('Opinión', 'opinion'),
    };
  }

  private async ensureTags(): Promise<{
    nestjs: Types.ObjectId;
    react: Types.ObjectId;
    mongodb: Types.ObjectId;
    typescript: Types.ObjectId;
  }> {
    const upsert = async (name: string, slug: string) => {
      const doc = await this.tags.findOneAndUpdate(
        { slug },
        { $set: { name: name.trim(), slug } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      if (!doc) throw new Error(`Tag ${slug}`);
      return doc._id as Types.ObjectId;
    };
    return {
      nestjs: await upsert('NestJS', 'nestjs'),
      react: await upsert('React', 'react'),
      mongodb: await upsert('MongoDB', 'mongodb'),
      typescript: await upsert('TypeScript', 'typescript'),
    };
  }
}
