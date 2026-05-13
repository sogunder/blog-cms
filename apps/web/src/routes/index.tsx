import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/public/LoginPage';
import { DashboardPage } from '../pages/admin/DashboardPage';
import { PostsPage } from '../pages/admin/PostsPage';
import { PostDetailPage } from '../pages/public/PostDetailPage';

// Additional placeholders for missing pages
const Home = () => (
  <div className="text-center py-20">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Blog CMS</h1>
    <p className="text-gray-600 max-w-2xl mx-auto">
      This is a modern, high-performance blog platform built with React 19, NestJS, and MongoDB.
    </p>
  </div>
);
const Unauthorized = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-red-600">403</h1>
      <p className="text-2xl font-medium mt-4">Unauthorized Access</p>
      <p className="text-gray-500 mt-2">You don't have permission to view this page.</p>
    </div>
  </div>
);
const NotFound = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      <p className="text-2xl font-medium mt-4">Page Not Found</p>
      <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
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
          { path: 'posts/new', element: <div>New Post Editor (TipTap)</div> },
          { path: 'posts/:id/edit', element: <div>Edit Post Editor (TipTap)</div> },
          { path: 'comments', element: <div>Admin Comments Table</div> },
          {
            path: 'users',
            element: <ProtectedRoute roles={['admin']} />,
            children: [{ index: true, element: <div>Admin Users Table</div> }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
