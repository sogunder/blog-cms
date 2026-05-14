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
const MARKER_SLUG = 'el-futuro-de-la-ia-generativa-en-el-desarrollo-de-software';

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
      'Administrador Principal',
      UserRole.Admin,
      hash,
    );
    await this.upsertUser('editor@demo.cl', 'Editor de Contenido', UserRole.Admin, hash);
    await this.upsertUser('lector@demo.cl', 'Lector Frecuente', UserRole.Reader, hash);
    this.logger.log('Usuarios: admin@admin.cl, editor@demo.cl, lector@demo.cl — Pass: 123456');
  }

  /** Usuarios + categorías, tags, posts y comentarios (idempotente por post marcador). */
  async seedDemo(): Promise<void> {
    await this.seedUsers();
    await this.seedDemoContent();
  }

  private async seedDemoContent(): Promise<void> {
    if (await this.posts.exists({ slug: MARKER_SLUG }).exec()) {
      this.logger.log('Contenido demo ya existe. Omitido.');
      return;
    }

    const admin = await this.users.findOne({ email: 'admin@admin.cl' }).lean();
    const editor = await this.users.findOne({ email: 'editor@demo.cl' }).lean();
    const reader = await this.users.findOne({ email: 'lector@demo.cl' }).lean();

    if (!admin?._id || !editor?._id || !reader?._id) {
      throw new Error('Ejecuta antes seed:users o seed:demo con usuarios creados');
    }

    const adminId = admin._id as Types.ObjectId;
    const editorId = editor._id as Types.ObjectId;
    const readerId = reader._id as Types.ObjectId;

    const cat = await this.ensureCategories();
    const tag = await this.ensureTags();
    const now = new Date();

    const p1 = await this.posts.create({
      title: 'El futuro de la IA generativa en el desarrollo de software',
      slug: MARKER_SLUG,
      summary:
        'Exploramos cómo las herramientas de IA están transformando la productividad de los desarrolladores y el ciclo de vida del software.',
      content: `
        <p>La Inteligencia Artificial generativa ha dejado de ser una promesa para convertirse en una herramienta cotidiana en el flujo de trabajo de ingeniería.</p>
        <h3>Impacto en la Productividad</h3>
        <p>Desde la autocompletación de código hasta la generación de pruebas unitarias, la IA permite a los desarrolladores centrarse en problemas de arquitectura de alto nivel.</p>
        <blockquote>"La IA no reemplazará a los programadores, pero los programadores que usan IA reemplazarán a los que no la usan."</blockquote>
        <p>En este artículo analizamos las tendencias para 2024 y más allá.</p>
      `,
      status: PostStatus.Published,
      views: 1250,
      author: adminId,
      category: cat.ia,
      tags: [tag.ai, tag.typescript],
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5),
    });

    const p2 = await this.posts.create({
      title: 'Arquitecturas escalables con Microservicios y NestJS',
      slug: 'arquitecturas-escalables-nestjs-microservicios',
      summary: 'Aprende a diseñar sistemas robustos y desacoplados utilizando patrones modernos de comunicación entre servicios.',
      content: `
        <p>Construir sistemas que puedan crecer sin romperse es uno de los mayores desafíos en la ingeniería de software actual.</p>
        <h3>¿Por qué NestJS?</h3>
        <p>NestJS proporciona una estructura modular que facilita la implementación de microservicios mediante transportadores como RabbitMQ, Kafka o Redis.</p>
        <ul>
          <li>Inyección de dependencias sólida.</li>
          <li>Soporte nativo para microservicios.</li>
          <li>Ecosistema compatible con TypeScript.</li>
        </ul>
        <p>Descubre cómo migrar de un monolito a una arquitectura distribuida paso a paso.</p>
      `,
      status: PostStatus.Published,
      views: 840,
      author: editorId,
      category: cat.web,
      tags: [tag.nestjs, tag.docker, tag.typescript],
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10),
    });

    const p3 = await this.posts.create({
      title: 'Guía definitiva de React 19: Server Components y más',
      slug: 'guia-react-19-server-components',
      summary: 'Un análisis profundo de las nuevas funcionalidades de React 19 y cómo cambiarán la forma en que construimos interfaces.',
      content: `
        <p>React 19 marca un hito en la evolución de la biblioteca más popular de frontend. La introducción estable de Server Components cambia las reglas del juego.</p>
        <h3>Principales Novedades</h3>
        <p>Desde mejoras en los hooks hasta una gestión de formularios más intuitiva, React 19 se enfoca en el rendimiento y la experiencia del desarrollador.</p>
        <p>Exploramos ejemplos prácticos de cómo implementar estas mejoras en tus proyectos existentes.</p>
      `,
      status: PostStatus.Published,
      views: 2100,
      author: adminId,
      category: cat.web,
      tags: [tag.react, tag.typescript, tag.nextjs],
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2),
    });

    const p4 = await this.posts.create({
      title: 'Ciberseguridad en 2024: Protegiendo aplicaciones modernas',
      slug: 'ciberseguridad-2024-proteccion-aplicaciones',
      summary: 'Las amenazas evolucionan y nuestras defensas también deben hacerlo. Repasamos las mejores prácticas de seguridad hoy.',
      content: `
        <p>En un mundo cada vez más conectado, la seguridad no puede ser una ocurrencia tardía. Debe estar integrada en cada fase del desarrollo (DevSecOps).</p>
        <h3>Zero Trust Architecture</h3>
        <p>El modelo de "nunca confiar, siempre verificar" se ha convertido en el estándar de oro para proteger infraestructuras críticas.</p>
        <p>Analizamos las vulnerabilidades más comunes del OWASP Top 10 y cómo mitigarlas eficazmente.</p>
      `,
      status: PostStatus.Published,
      views: 560,
      author: editorId,
      category: cat.seguridad,
      tags: [tag.security, tag.nodejs],
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15),
    });

    const p5 = await this.posts.create({
      title: 'Estrategias efectivas para la gestión de proyectos ágiles',
      slug: 'estrategias-gestion-proyectos-agile',
      summary: 'Más allá de Scrum: cómo adaptar metodologías ágiles a equipos distribuidos y de alto rendimiento.',
      content: `
        <p>La agilidad no se trata solo de hacer reuniones diarias. Se trata de entregar valor de forma continua y adaptarse al cambio.</p>
        <h3>Equipos Remotos y Agilidad</h3>
        <p>¿Cómo mantenemos la cohesión y la velocidad en equipos que trabajan en diferentes zonas horarias?</p>
        <p>Compartimos herramientas y técnicas que han demostrado éxito en empresas líderes tecnológicas.</p>
      `,
      status: PostStatus.Published,
      views: 320,
      author: adminId,
      category: cat.negocios,
      tags: [tag.agile],
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20),
    });

    const p6 = await this.posts.create({
      title: 'Optimización de consultas en MongoDB para grandes volúmenes de datos',
      slug: 'optimizacion-consultas-mongodb-alto-rendimiento',
      summary: 'Descubre técnicas avanzadas de indexación y agregación para mantener tus aplicaciones rápidas y escalables.',
      content: `
        <p>A medida que tus colecciones crecen, las consultas que antes eran instantáneas pueden volverse cuellos de botella.</p>
        <h3>Índices Compuestos</h3>
        <p>No basta con indexar campos individuales. Entender el orden de los campos en un índice compuesto es clave para el rendimiento.</p>
        <p>También exploramos el uso del Explain Plan para diagnosticar consultas lentas.</p>
      `,
      status: PostStatus.Published,
      views: 1100,
      author: editorId,
      category: cat.cloud,
      tags: [tag.mongodb, tag.nodejs],
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3),
    });

    const p7 = await this.posts.create({
      title: 'Diseño UX: De la empatía a la interfaz final',
      slug: 'diseno-ux-empatia-interfaz-final',
      summary: 'Por qué el diseño centrado en el usuario es la inversión más rentable que puede hacer tu startup.',
      content: `
        <p>El diseño UX no es "poner las cosas bonitas". Es entender los problemas del usuario y resolverlos de la forma más sencilla posible.</p>
        <h3>User Research</h3>
        <p>Hablamos sobre metodologías de investigación cualitativa y cómo los hallazgos deben guiar cada decisión de diseño.</p>
      `,
      status: PostStatus.Published,
      views: 450,
      author: adminId,
      category: cat.web,
      tags: [tag.react, tag.nextjs],
      publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7),
    });

    await this.posts.create({
      title: 'Próximas tendencias en Cloud Computing para 2025',
      slug: 'tendencias-cloud-computing-2025',
      summary: 'Un vistazo a lo que viene en el mundo de la nube: Edge Computing, Serverless 2.0 y sostenibilidad.',
      content: `
        <p>El contenido de este artículo está actualmente bajo investigación. Analizaremos cómo el Edge Computing reducirá la latencia a niveles sin precedentes.</p>
      `,
      status: PostStatus.Draft,
      views: 0,
      author: adminId,
      category: cat.cloud,
      tags: [tag.aws, tag.docker],
      publishedAt: null,
    });

    await this.comments.insertMany([
      {
        post: p1._id,
        content: 'Excelente artículo. La IA realmente está cambiando cómo escribimos código cada día.',
        status: CommentStatus.Approved,
        author: readerId,
        guestName: '',
        guestEmail: '',
      },
      {
        post: p1._id,
        content: '¿Crees que la IA afectará los salarios de los juniors?',
        status: CommentStatus.Pending,
        author: null,
        guestName: 'Carlos Ruiz',
        guestEmail: 'carlos@example.com',
      },
      {
        post: p3._id,
        content: '¡React 19 se ve increíble! Los Server Components finalmente tienen sentido para mí.',
        status: CommentStatus.Approved,
        author: editorId,
        guestName: '',
        guestEmail: '',
      },
      {
        post: p2._id,
        content: 'Buen resumen, aunque me gustaría ver un ejemplo con Kafka.',
        status: CommentStatus.Approved,
        author: readerId,
        guestName: '',
        guestEmail: '',
      },
      {
        post: p4._id,
        content: 'La seguridad es fundamental. Gracias por recordar el OWASP Top 10.',
        status: CommentStatus.Approved,
        author: null,
        guestName: 'SeguridadPro',
        guestEmail: 'security@pro.com',
      },
    ]);

    this.logger.log(
      'Contenido demo generado con éxito: categorías, tags, posts profesionales y comentarios.',
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

  private async ensureCategories(): Promise<Record<string, Types.ObjectId>> {
    const categories = [
      { name: 'Inteligencia Artificial', slug: 'ia' },
      { name: 'Desarrollo Web', slug: 'web' },
      { name: 'Infraestructura y Cloud', slug: 'cloud' },
      { name: 'Ciberseguridad', slug: 'seguridad' },
      { name: 'Gestión y Negocios', slug: 'negocios' },
    ];

    const result: Record<string, Types.ObjectId> = {};
    for (const cat of categories) {
      const doc = await this.categories.findOneAndUpdate(
        { slug: cat.slug },
        { $set: { name: cat.name, slug: cat.slug } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      if (doc) result[cat.slug] = doc._id as Types.ObjectId;
    }
    return result;
  }

  private async ensureTags(): Promise<Record<string, Types.ObjectId>> {
    const tags = [
      { name: 'AI', slug: 'ai' },
      { name: 'React', slug: 'react' },
      { name: 'Node.js', slug: 'nodejs' },
      { name: 'AWS', slug: 'aws' },
      { name: 'MongoDB', slug: 'mongodb' },
      { name: 'Seguridad', slug: 'security' },
      { name: 'Agile', slug: 'agile' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'Docker', slug: 'docker' },
      { name: 'NestJS', slug: 'nestjs' },
      { name: 'Next.js', slug: 'nextjs' },
    ];

    const result: Record<string, Types.ObjectId> = {};
    for (const t of tags) {
      const doc = await this.tags.findOneAndUpdate(
        { slug: t.slug },
        { $set: { name: t.name, slug: t.slug } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      if (doc) result[t.slug] = doc._id as Types.ObjectId;
    }
    return result;
  }
}
