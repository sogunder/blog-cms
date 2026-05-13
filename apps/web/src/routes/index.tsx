import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/public/LoginPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { PostsPage } from '../pages/admin/PostsPage';
import { PostDetailPage } from '../pages/public/PostDetailPage';

// Componentes adicionales en español con estilo Google
const Home = () => (
  <div className="text-center py-24">
    <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full mb-8 border border-blue-100">
      <span className="flex h-2 w-2 rounded-full bg-google-blue animate-pulse"></span>
      <span className="text-sm font-bold text-google-blue uppercase tracking-widest">Plataforma de Nueva Generación</span>
    </div>
    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-tight">
      Bienvenido a <span className="text-google-blue">Blog CMS</span>
    </h1>
    <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium mb-12">
      Una plataforma de blog moderna y de alto rendimiento construida con React 19, NestJS y MongoDB. 
      Diseñada para ofrecer velocidad, diseño y una experiencia de usuario excepcional.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
      <button className="bg-google-blue text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 hover:-translate-y-1">
        Explorar Entradas
      </button>
      <button className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all hover:-translate-y-1">
        Saber Más
      </button>
    </div>
  </div>
);

const Unauthorized = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <h1 className="text-8xl font-extrabold text-google-red tracking-tighter">403</h1>
      <p className="text-3xl font-bold text-gray-900 mt-6 tracking-tight">Acceso No Autorizado</p>
      <p className="text-gray-500 mt-3 font-medium text-lg">No tienes permisos para ver esta sección del panel.</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <h1 className="text-8xl font-extrabold text-google-blue tracking-tighter">404</h1>
      <p className="text-3xl font-bold text-gray-900 mt-6 tracking-tight">Página No Encontrada</p>
      <p className="text-gray-500 mt-3 font-medium text-lg">Parece que el contenido que buscas ha sido movido o no existe.</p>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'post/:slug', element: <PostDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'unauthorized', element: <Unauthorized /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute roles={['admin', 'editor']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'posts', element: <PostsPage /> },
          { path: 'posts/new', element: <div className="p-8 text-center text-gray-500 font-bold bg-white rounded-3xl border border-dashed">Editor de Nueva Entrada (TipTap)</div> },
          { path: 'posts/:id/edit', element: <div className="p-8 text-center text-gray-500 font-bold bg-white rounded-3xl border border-dashed">Editor de Entrada Existente (TipTap)</div> },
          { path: 'comments', element: <div className="p-8 text-center text-gray-500 font-bold bg-white rounded-3xl border border-dashed">Tabla de Comentarios Administrativa</div> },
          {
            path: 'users',
            element: <ProtectedRoute roles={['admin']} />,
            children: [{ index: true, element: <div className="p-8 text-center text-gray-500 font-bold bg-white rounded-3xl border border-dashed">Tabla de Gestión de Usuarios</div> }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
