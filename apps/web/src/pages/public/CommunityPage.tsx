import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Users,
  PenTool,
  Code2,
  Heart,
  MessageSquare,
  ShieldCheck,
  Mail,
  Sparkles,
} from 'lucide-react';

const audiences = [
  {
    icon: PenTool,
    title: 'Creadores de contenido',
    color: 'from-blue-50 to-indigo-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    description:
      'Bloggers, periodistas y escritores que buscan una herramienta sencilla, rápida y enfocada en el contenido. Sin distracciones, sin curva de aprendizaje.',
    bullets: [
      'Editor enriquecido con formato, listas y enlaces',
      'Categorías y etiquetas para organizar tu trabajo',
      'Borradores ilimitados antes de publicar',
    ],
  },
  {
    icon: Users,
    title: 'Lectores',
    color: 'from-emerald-50 to-teal-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    description:
      'Personas que disfrutan leyendo contenido de calidad. Diseño limpio, tiempos de carga rápidos y una experiencia agradable en cualquier dispositivo.',
    bullets: [
      'Explora artículos por categoría o etiqueta',
      'Comenta y participa en cada post',
      'Lectura cómoda en móvil y escritorio',
    ],
  },
  {
    icon: Code2,
    title: 'Desarrolladores',
    color: 'from-purple-50 to-pink-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    description:
      'Equipos técnicos que quieren un CMS moderno, abierto y fácil de extender. Stack actual, código tipado y API REST documentada con OpenAPI.',
    bullets: [
      'React 19 + NestJS + MongoDB',
      'API REST documentada con Swagger',
      'Arquitectura modular y código abierto',
    ],
  },
];

const ways = [
  {
    icon: MessageSquare,
    title: 'Participa con comentarios',
    body: 'Lee los posts y deja tu opinión. Los comentarios son moderados para mantener un espacio respetuoso y de calidad.',
  },
  {
    icon: PenTool,
    title: 'Conviértete en creador',
    body: 'Si quieres publicar contenido, pide a un administrador que te asigne el rol de editor. Tendrás acceso completo al editor de posts.',
  },
  {
    icon: Code2,
    title: 'Contribuye al código',
    body: 'El proyecto está construido con tecnologías abiertas. Si encuentras un bug o tienes una idea, abre un issue o envía un pull request.',
  },
  {
    icon: Heart,
    title: 'Comparte el proyecto',
    body: 'Recomienda BlogCMS a otros creadores. Cuanta más gente lo use, mejor podremos hacerlo entre todos.',
  },
];

const conductRules = [
  'Trata a todos con respeto, independientemente de su experiencia, opinión o background.',
  'Mantén las críticas constructivas y centradas en las ideas, no en las personas.',
  'No se tolera lenguaje ofensivo, discriminatorio, spam ni autopromoción excesiva.',
  'Si ves contenido inapropiado, repórtalo a un moderador.',
];

export const CommunityPage = () => {
  return (
    <div className="space-y-24 py-12 md:py-20">
      <Helmet>
        <title>Comunidad | Blog CMS</title>
        <meta
          name="description"
          content="La comunidad de Blog CMS: para creadores de contenido, lectores y desarrolladores que valoran un blog moderno, abierto y bien diseñado."
        />
      </Helmet>

      {/* Hero */}
      <section className="text-center space-y-8 px-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          <Users size={14} className="text-blue-600" />
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            Comunidad
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Un espacio para<br />
          <span className="text-blue-600">crear y compartir</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
          BlogCMS no es solo una herramienta: es una comunidad de creadores,
          lectores y desarrolladores que creen que publicar contenido en
          internet debería ser simple, rápido y agradable.
        </p>
      </section>

      {/* ¿Para quién? */}
      <section className="space-y-12 px-4">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            Audiencia
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 tracking-tight">
            ¿Para quién está pensado?
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            Tres perfiles, una misma plataforma. Cada uno con las herramientas
            que necesita.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {audiences.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.title}
                className={`bg-gradient-to-br ${a.color} rounded-2xl border border-white/50 p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1`}
              >
                <div
                  className={`${a.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center mb-5`}
                >
                  <Icon size={26} className={a.iconColor} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {a.title}
                </h3>
                <p className="text-gray-700 font-medium text-sm leading-relaxed mb-5">
                  {a.description}
                </p>
                <ul className="space-y-2">
                  {a.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start text-sm text-gray-700 font-medium"
                    >
                      <span className="text-blue-600 mr-2 mt-0.5">·</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cómo participar */}
      <section className="space-y-12 px-4">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            Cómo participar
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 tracking-tight">
            Formas de sumarte
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            No importa si tienes 5 minutos o 5 horas: hay un sitio para ti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {ways.map((way) => {
            const Icon = way.icon;
            return (
              <div
                key={way.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={22} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      {way.title}
                    </h3>
                    <p className="text-gray-600 font-medium text-sm leading-relaxed">
                      {way.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Código de conducta */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={26} className="text-blue-600" />
            </div>
            <div>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                Reglas
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Código de conducta
              </h2>
            </div>
          </div>
          <p className="text-gray-600 font-medium leading-relaxed mb-6">
            Para que esta comunidad sea un buen lugar para todos, te pedimos
            seguir unas reglas básicas:
          </p>
          <ul className="space-y-4">
            {conductRules.map((rule, idx) => (
              <li
                key={idx}
                className="flex items-start space-x-3 text-gray-700 font-medium leading-relaxed"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-extrabold">
                  {idx + 1}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contacto */}
      <section className="px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8">
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles size={22} className="text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">
                ¿Tienes una idea?
              </h3>
            </div>
            <p className="text-gray-700 font-medium leading-relaxed mb-6">
              Escríbenos con tu propuesta de feature, mejora o colaboración.
              Leemos todos los mensajes.
            </p>
            <button
              onClick={() => alert('blogCMS@gmail.com')}
              className="inline-flex items-center px-6 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5"
            >
              <Mail size={16} className="mr-2" />
              Contactar
            </button>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Code2 size={22} className="text-white" />
              <h3 className="text-xl font-bold">Código abierto</h3>
            </div>
            <p className="text-gray-300 font-medium leading-relaxed mb-6">
              Mira el código, abre issues o contribuye con un pull request.
              Toda ayuda es bienvenida.
            </p>
            <Link
              to="/api-reference"
              className="inline-flex items-center px-6 py-3 rounded-full bg-white text-gray-900 font-bold hover:bg-blue-50 transition-all hover:-translate-y-0.5"
            >
              Ver la API
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl px-8 md:px-16 py-16 md:py-20 text-center max-w-4xl mx-4 md:mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Únete a la comunidad
        </h2>
        <p className="text-xl text-blue-100 mb-8 font-medium">
          Crea tu cuenta y empieza a participar hoy mismo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition-all hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-1"
          >
            Crear cuenta
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all"
          >
            Explorar contenido
          </Link>
        </div>
      </section>
    </div>
  );
};
