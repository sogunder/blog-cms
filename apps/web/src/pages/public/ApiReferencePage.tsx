import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Terminal,
  ExternalLink,
  KeyRound,
  Lock,
  Globe,
  FileJson,
  Copy,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface Endpoint {
  method: Method;
  path: string;
  description: string;
  auth?: 'public' | 'user' | 'editor' | 'admin';
}

interface EndpointGroup {
  tag: string;
  description: string;
  endpoints: Endpoint[];
}

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:3000/api';

const SWAGGER_URL = API_BASE.replace(/\/api\/?$/, '/docs');
const OPENAPI_JSON_URL = API_BASE.replace(/\/api\/?$/, '/docs-json');

const groups: EndpointGroup[] = [
  {
    tag: 'auth',
    description: 'Registro, login y verificación de sesión con JWT.',
    endpoints: [
      { method: 'POST', path: '/auth/register', description: 'Crear una cuenta nueva', auth: 'public' },
      { method: 'POST', path: '/auth/login', description: 'Iniciar sesión y obtener token JWT', auth: 'public' },
      { method: 'POST', path: '/auth/logout', description: 'Cerrar sesión del usuario actual', auth: 'user' },
      { method: 'GET', path: '/auth/profile', description: 'Obtener el perfil del usuario autenticado', auth: 'user' },
      { method: 'GET', path: '/auth/verify', description: 'Verificar que el token JWT es válido', auth: 'user' },
    ],
  },
  {
    tag: 'posts',
    description: 'Lectura pública de posts y CRUD completo para administradores.',
    endpoints: [
      { method: 'GET', path: '/posts', description: 'Listar posts publicados (paginado)', auth: 'public' },
      { method: 'GET', path: '/posts/slug/:slug', description: 'Obtener un post por su slug', auth: 'public' },
      { method: 'GET', path: '/admin/posts', description: 'Listar todos los posts incluyendo borradores', auth: 'editor' },
      { method: 'GET', path: '/admin/posts/:id', description: 'Obtener un post por ID', auth: 'editor' },
      { method: 'POST', path: '/admin/posts', description: 'Crear un post nuevo', auth: 'editor' },
      { method: 'PATCH', path: '/admin/posts/:id', description: 'Actualizar un post existente', auth: 'editor' },
      { method: 'DELETE', path: '/admin/posts/:id', description: 'Eliminar un post', auth: 'editor' },
    ],
  },
  {
    tag: 'categories',
    description: 'Categorías para organizar posts. Lectura pública, gestión privada.',
    endpoints: [
      { method: 'GET', path: '/categories', description: 'Listar todas las categorías', auth: 'public' },
      { method: 'GET', path: '/categories/:slug/posts', description: 'Posts de una categoría', auth: 'public' },
      { method: 'GET', path: '/admin/categories', description: 'Listar categorías (vista admin)', auth: 'editor' },
      { method: 'POST', path: '/admin/categories', description: 'Crear una categoría', auth: 'editor' },
      { method: 'PATCH', path: '/admin/categories/:id', description: 'Actualizar una categoría', auth: 'editor' },
      { method: 'DELETE', path: '/admin/categories/:id', description: 'Eliminar una categoría', auth: 'editor' },
    ],
  },
  {
    tag: 'tags',
    description: 'Etiquetas transversales para agrupar contenido.',
    endpoints: [
      { method: 'GET', path: '/tags', description: 'Listar todas las etiquetas', auth: 'public' },
      { method: 'GET', path: '/tags/:slug/posts', description: 'Posts de una etiqueta', auth: 'public' },
      { method: 'GET', path: '/admin/tags', description: 'Listar etiquetas (vista admin)', auth: 'editor' },
      { method: 'POST', path: '/admin/tags', description: 'Crear una etiqueta', auth: 'editor' },
      { method: 'PATCH', path: '/admin/tags/:id', description: 'Actualizar una etiqueta', auth: 'editor' },
      { method: 'DELETE', path: '/admin/tags/:id', description: 'Eliminar una etiqueta', auth: 'editor' },
    ],
  },
  {
    tag: 'comments',
    description: 'Comentarios en posts. Creación pública, moderación privada.',
    endpoints: [
      { method: 'POST', path: '/comments', description: 'Crear un comentario (sesión opcional)', auth: 'public' },
      { method: 'GET', path: '/comments/post/:postId', description: 'Comentarios aprobados de un post', auth: 'public' },
      { method: 'GET', path: '/admin/comments', description: 'Listar todos los comentarios', auth: 'editor' },
      { method: 'PATCH', path: '/admin/comments/:id', description: 'Aprobar o rechazar un comentario', auth: 'editor' },
      { method: 'DELETE', path: '/admin/comments/:id', description: 'Eliminar un comentario', auth: 'editor' },
    ],
  },
  {
    tag: 'users',
    description: 'Gestión de usuarios. Reservado para administradores.',
    endpoints: [
      { method: 'GET', path: '/users/me', description: 'Obtener mis datos de usuario', auth: 'user' },
      { method: 'GET', path: '/users', description: 'Listar todos los usuarios', auth: 'admin' },
      { method: 'GET', path: '/users/:id', description: 'Obtener un usuario por ID', auth: 'admin' },
      { method: 'POST', path: '/users', description: 'Crear un usuario manualmente', auth: 'admin' },
      { method: 'PATCH', path: '/users/:id', description: 'Actualizar rol, estado o datos', auth: 'admin' },
      { method: 'DELETE', path: '/users/:id', description: 'Eliminar un usuario', auth: 'admin' },
    ],
  },
  {
    tag: 'stats',
    description: 'Estadísticas agregadas del dashboard de administración.',
    endpoints: [
      { method: 'GET', path: '/admin/stats/dashboard', description: 'Conteos de posts, comentarios, etc.', auth: 'editor' },
    ],
  },
];

const methodColors: Record<Method, string> = {
  GET: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  POST: 'bg-blue-100 text-blue-700 border-blue-200',
  PATCH: 'bg-amber-100 text-amber-700 border-amber-200',
  DELETE: 'bg-red-100 text-red-700 border-red-200',
};

const authLabels: Record<NonNullable<Endpoint['auth']>, { label: string; color: string }> = {
  public: { label: 'público', color: 'bg-gray-100 text-gray-600' },
  user: { label: 'auth', color: 'bg-blue-50 text-blue-600' },
  editor: { label: 'editor', color: 'bg-purple-50 text-purple-600' },
  admin: { label: 'admin', color: 'bg-red-50 text-red-600' },
};

const CodeBlock = ({ code }: { code: string }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Copiado al portapapeles');
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  return (
    <div className="relative group">
      <pre className="bg-gray-900 text-gray-100 rounded-2xl p-5 overflow-x-auto text-sm font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copiar"
      >
        <Copy size={14} />
      </button>
    </div>
  );
};

export const ApiReferencePage = () => {
  const [activeTag, setActiveTag] = useState<string>('auth');

  return (
    <div className="space-y-24 py-12 md:py-20">
      <Helmet>
        <title>Referencia API | Blog CMS</title>
        <meta
          name="description"
          content="Documentación completa de la API REST de Blog CMS con todos los endpoints, autenticación JWT y enlace a Swagger UI interactivo."
        />
      </Helmet>

      {/* Hero */}
      <section className="text-center space-y-8 px-4">
        <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          <Terminal size={14} className="text-blue-600" />
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            Referencia API
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight">
          API REST de<br />
          <span className="text-blue-600">Blog CMS</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
          Una API construida con NestJS, autenticación JWT y documentación
          OpenAPI. Todos los endpoints están disponibles también de forma
          interactiva con Swagger UI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href={SWAGGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5"
          >
            Abrir Swagger UI
            <ExternalLink size={16} className="ml-2" />
          </a>
          <a
            href={OPENAPI_JSON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-gray-200 text-gray-900 font-bold hover:border-blue-600 hover:text-blue-600 transition-all"
          >
            <FileJson size={18} className="mr-2" />
            OpenAPI JSON
          </a>
        </div>
      </section>

      {/* Información rápida */}
      <section className="px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Globe size={18} className="text-blue-600" />
              <h3 className="font-bold text-gray-900">Base URL</h3>
            </div>
            <code className="block bg-gray-50 px-3 py-2 rounded-lg text-xs font-mono text-gray-800 break-all">
              {API_BASE}
            </code>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-3">
              <KeyRound size={18} className="text-blue-600" />
              <h3 className="font-bold text-gray-900">Autenticación</h3>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Bearer JWT en la cabecera{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                Authorization
              </code>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Lock size={18} className="text-blue-600" />
              <h3 className="font-bold text-gray-900">Roles</h3>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                user
              </code>{' '}
              ·{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                editor
              </code>{' '}
              ·{' '}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-xs">
                admin
              </code>
            </p>
          </div>
        </div>
      </section>

      {/* Autenticación: ejemplo */}
      <section className="px-4 space-y-8">
        <div className="max-w-4xl mx-auto">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            Autenticación
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
            Obtén un token JWT
          </h2>
          <p className="text-gray-600 font-medium mt-4 leading-relaxed">
            La mayoría de endpoints requieren autenticación. Primero haz login
            con tus credenciales y obtendrás un token que debes incluir en cada
            petición siguiente.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              1. Login
            </p>
            <CodeBlock
              code={`curl -X POST ${API_BASE}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@admin.cl",
    "password": "123456"
  }'`}
            />
          </div>
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              2. Petición autenticada
            </p>
            <CodeBlock
              code={`curl ${API_BASE}/admin/posts \\
  -H "Authorization: Bearer <TU_TOKEN>"`}
            />
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="px-4 space-y-8">
        <div className="max-w-6xl mx-auto">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            Endpoints
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 tracking-tight">
            Todos los recursos disponibles
          </h2>
        </div>

        {/* Tag selector */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => (
              <button
                key={g.tag}
                onClick={() => setActiveTag(g.tag)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeTag === g.tag
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                {g.tag}
              </button>
            ))}
          </div>
        </div>

        {/* Endpoints list */}
        <div className="max-w-6xl mx-auto space-y-4">
          {groups
            .filter((g) => g.tag === activeTag)
            .map((g) => (
              <div key={g.tag} className="space-y-4">
                <p className="text-gray-600 font-medium leading-relaxed">
                  {g.description}
                </p>
                <div className="space-y-3">
                  {g.endpoints.map((ep) => (
                    <div
                      key={`${ep.method}-${ep.path}`}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-md transition-shadow"
                    >
                      <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-extrabold border self-start ${methodColors[ep.method]}`}
                      >
                        {ep.method}
                      </span>
                      <code className="font-mono text-sm text-gray-900 font-semibold flex-shrink-0">
                        {ep.path}
                      </code>
                      <p className="text-sm text-gray-600 font-medium flex-1 md:text-right">
                        {ep.description}
                      </p>
                      {ep.auth && (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest self-start md:self-center ${authLabels[ep.auth].color}`}
                        >
                          {authLabels[ep.auth].label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* CTA Swagger */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl px-8 md:px-16 py-16 md:py-20 text-center max-w-4xl mx-4 md:mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
          <Terminal size={28} className="text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Pruébala en vivo
        </h2>
        <p className="text-xl text-gray-300 mb-8 font-medium max-w-2xl mx-auto">
          Abre Swagger UI para enviar peticiones reales, ver esquemas completos
          de cada DTO y descargar la especificación OpenAPI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={SWAGGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-gray-900 font-bold text-lg hover:bg-blue-50 transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            Abrir Swagger UI
            <ExternalLink size={18} className="ml-2" />
          </a>
          <Link
            to="/documentation"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 transition-all"
          >
            Ver Documentación
          </Link>
        </div>
      </section>
    </div>
  );
};
