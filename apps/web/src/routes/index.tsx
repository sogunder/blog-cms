import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/public/LoginPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { PostsPage } from '../pages/admin/PostsPage';
import { PostDetailPage } from '../pages/public/PostDetailPage';
import { HomePage } from '../pages/public/HomePage';
import { PostEditorPage } from '../pages/admin/PostEditorPage';
import { CommentsPage } from '../pages/admin/CommentsPage';
import { UsersPage } from '../pages/admin/UsersPage';
import { CategoriesPage } from '../pages/admin/CategoriesPage';

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
      { index: true, element: <HomePage /> },
      { path: 'post/:slug', element: <PostDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'unauthorized', element: <Unauthorized /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute roles={['admin', 'editor', 'reader']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'posts', element: <PostsPage /> },
          {
            element: <ProtectedRoute roles={['admin', 'editor']} />,
            children: [
              { path: 'posts/new', element: <PostEditorPage /> },
              { path: 'posts/:id/edit', element: <PostEditorPage /> },
              { path: 'categories', element: <CategoriesPage /> },
              { path: 'comments', element: <CommentsPage /> },
            ],
          },
          {
            path: 'users',
            element: <ProtectedRoute roles={['admin']} />,
            children: [{ index: true, element: <UsersPage /> }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
