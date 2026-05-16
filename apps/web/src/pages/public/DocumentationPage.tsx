import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  BookOpen,
  UserPlus,
  LogIn,
  PenSquare,
  FolderTree,
  Tags,
  MessageSquare,
  Shield,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const sections = [
  { id: 'empezar', label: 'Empezando' },
  { id: 'roles', label: 'Roles y permisos' },
  { id: 'crear-post', label: 'Crear un post' },
  { id: 'organizar', label: 'Organizar contenido' },
  { id: 'comentarios', label: 'Moderar comentarios' },
  { id: 'tips', label: 'Buenas prácticas' },
];

const steps = [
  {
    icon: UserPlus,
    title: 'Crear una cuenta',
    description:
      'Pulsa "Empezar" en la barra superior para registrarte con tu nombre, email y contraseña. Por defecto se crea como lector.',
  },
  {
    icon: LogIn,
    title: 'Iniciar sesión',
    description:
      'Una vez creada la cuenta, usa "Entrar" con tu email y contraseña. La sesión se mantiene activa con un token JWT seguro.',
  },
  {
    icon: BookOpen,
    title: 'Explorar contenido',
    description:
      'Visita "Inicio" para ver las últimas entradas o "Explorar" para navegar por todos los posts publicados, categorías y etiquetas.',
  },
];

const roles = [
  {
    name: 'Lector',
    color: 'bg-gray-100 text-gray-700',
    description:
      'Puede leer todos los posts publicados y dejar comentarios. Es el rol por defecto al registrarse.',
  },
  {
    name: 'Editor',
    color: 'bg-blue-100 text-blue-700',
    description:
      'Acceso al panel /admin. Puede crear, editar y publicar posts, gestionar categorías, etiquetas y moderar comentarios.',
  },
  {
    name: 'Admin',
    color: 'bg-purple-100 text-purple-700',
    description:
      'Mismas capacidades que el editor, más la gestión de usuarios: cambiar roles, activar/desactivar y eliminar cuentas.',
  },
];

const createPostSteps = [
  {
    n: 1,
    title: 'Entra al panel de administración',
    body: 'Inicia sesión con una cuenta de editor o admin y abre /admin desde el menú de usuario.',
  },
  {
    n: 2,
    title: 'Pulsa "Nuevo Post"',
    body: 'Desde la sección "Posts" del panel encontrarás el botón para abrir el editor.',
  },
  {
    n: 3,
    title: 'Completa la información',
    body: 'Título (3-200 caracteres), resumen opcional, categoría (obligatoria) y etiquetas (opcionales). El slug se genera automáticamente.',
  },
  {
    n: 4,
    title: 'Redacta con el editor enriquecido',
    body: 'Usa el editor TipTap para dar formato: negritas, listas, enlaces, encabezados, citas, código y más.',
  },
  {
    n: 5,
    title: 'Guarda como borrador o publica',
    body: 'Cambia el estado a "Publicado" cuando esté listo. Los borradores son privados y nunca aparecen en la web pública.',
  },
];

const Section = ({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="space-y-8 px-4 scroll-mt-32">
    <div className="max-w-3xl">
      <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
        {eyebrow}
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
        {title}
      </h2>
    </div>
    {children}
  </section>
);

export const DocumentationPage = () => {
  return (
    <div className="space-y-24 py-12 md:py-20">
      <Helmet>
        <title>Documentación | Blog CMS</title>
        <meta
          name="description"
          content="Guía completa para usar Blog CMS: cómo registrarse, crear posts, gestionar categorías, etiquetas y comentarios."
        />
      </Helmet>

      {/* Hero */}
      <section className="text-center space-y-8 px-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          <BookOpen size={14} className="text-blue-600" />
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            Documentación
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Todo lo que necesitas<br />para empezar
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
          Una guía paso a paso para sacar el máximo provecho de{' '}
          <span className="text-blue-600 font-bold">BlogCMS</span>:
          desde crear tu cuenta hasta publicar tu primer artículo.
        </p>
      </section>

      {/* Tabla de contenidos */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
            Contenido
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
              >
                <span className="font-bold text-gray-900 group-hover:text-blue-600">
                  {s.label}
                </span>
                <ChevronRight
                  size={16}
                  className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Empezando */}
      <Section id="empezar" eyebrow="Primeros pasos" title="Empezando">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <span className="text-xs font-extrabold text-gray-400">
                    PASO {idx + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 font-medium text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Roles */}
      <Section id="roles" eyebrow="Permisos" title="Roles y permisos">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          {roles.map((role) => (
            <div
              key={role.name}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <Shield size={20} className="text-gray-700" />
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest ${role.color}`}
                >
                  {role.name}
                </span>
              </div>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                {role.description}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 font-medium max-w-3xl">
          Solo un usuario con rol <strong>admin</strong> puede cambiar el rol de
          otros usuarios desde el panel{' '}
          <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
            /admin/users
          </code>
          .
        </p>
      </Section>

      {/* Crear un post */}
      <Section id="crear-post" eyebrow="Tutorial" title="Cómo crear un post">
        <div className="max-w-3xl space-y-4">
          {createPostSteps.map((step) => (
            <div
              key={step.n}
              className="flex items-start space-x-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-extrabold">
                {step.n}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-gray-600 font-medium text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 flex items-start space-x-4">
          <PenSquare size={24} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-gray-900 mb-1">
              ¿Aún no tienes permisos de editor?
            </h3>
            <p className="text-gray-700 font-medium text-sm leading-relaxed">
              Pide a un administrador que actualice tu rol desde{' '}
              <code className="bg-white px-2 py-0.5 rounded text-xs font-mono">
                /admin/users
              </code>
              . Sin rol de editor o admin no podrás acceder al editor de posts.
            </p>
          </div>
        </div>
      </Section>

      {/* Organizar contenido */}
      <Section
        id="organizar"
        eyebrow="Contenido"
        title="Organiza con categorías y etiquetas"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <FolderTree size={22} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Categorías</h3>
            <p className="text-gray-600 font-medium text-sm leading-relaxed mb-3">
              Cada post pertenece a <strong>una sola categoría</strong>. Se usan
              para la navegación principal del sitio.
            </p>
            <p className="text-gray-500 font-medium text-xs">
              Gestiónalas en{' '}
              <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">
                /admin/categories
              </code>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Tags size={22} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Etiquetas</h3>
            <p className="text-gray-600 font-medium text-sm leading-relaxed mb-3">
              Un post puede tener <strong>varias etiquetas</strong>. Son útiles
              para agrupar contenido transversal.
            </p>
            <p className="text-gray-500 font-medium text-xs">
              Las etiquetas se crean al vuelo desde el editor de posts.
            </p>
          </div>
        </div>
      </Section>

      {/* Comentarios */}
      <Section
        id="comentarios"
        eyebrow="Moderación"
        title="Comentarios y moderación"
      >
        <div className="max-w-3xl bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-4">
            <MessageSquare size={22} className="text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Cómo funciona</h3>
          </div>
          <ul className="space-y-3 text-gray-600 font-medium text-sm leading-relaxed list-disc pl-5">
            <li>
              Cualquier visitante (con o sin sesión) puede comentar en un post
              publicado.
            </li>
            <li>
              Los comentarios entran en estado <strong>pendiente</strong> y no
              son visibles hasta ser aprobados.
            </li>
            <li>
              Desde{' '}
              <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                /admin/comments
              </code>{' '}
              los editores pueden aprobar, rechazar o eliminar comentarios.
            </li>
            <li>
              Los comentarios aprobados aparecen al final de cada post,
              ordenados por fecha.
            </li>
          </ul>
        </div>
      </Section>

      {/* Buenas prácticas */}
      <Section id="tips" eyebrow="Tips" title="Buenas prácticas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {[
            {
              title: 'Escribe un buen resumen',
              body: 'El resumen aparece en los listados y en los metadatos para redes. Mantenlo claro y conciso (máx. 500 caracteres).',
            },
            {
              title: 'Usa títulos descriptivos',
              body: 'Entre 3 y 200 caracteres. Un buen título mejora el SEO y la tasa de clics desde la home.',
            },
            {
              title: 'Reutiliza categorías',
              body: 'Evita crear una categoría por cada post. Pocas categorías bien definidas funcionan mejor que muchas dispersas.',
            },
            {
              title: 'Publica cuando esté listo',
              body: 'Trabaja en borrador cuanto necesites. Solo cambia el estado a "Publicado" cuando el contenido esté revisado.',
            },
          ].map((tip) => (
            <div
              key={tip.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all"
            >
              <div className="flex items-center space-x-3 mb-2">
                <Sparkles size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900">{tip.title}</h3>
              </div>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                {tip.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl px-8 md:px-16 py-16 md:py-20 text-center max-w-4xl mx-4 md:mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          ¿Listo para escribir?
        </h2>
        <p className="text-xl text-blue-100 mb-8 font-medium">
          Crea tu cuenta y publica tu primer artículo en minutos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition-all hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-1"
          >
            Crear cuenta
          </Link>
          <Link
            to="/api-reference"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all"
          >
            Ver Referencia API
          </Link>
        </div>
      </section>
    </div>
  );
};
