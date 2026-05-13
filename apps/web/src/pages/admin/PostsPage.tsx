import { DataTable } from '../../components/ui/DataTable';
import { Post } from '../../types';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Primeros pasos con React 19',
    slug: 'primeros-pasos-react-19',
    content: '',
    summary: 'Una guía rápida sobre las nuevas características de React 19.',
    status: 'published',
    views: 1250,
    author: { id: 'v1', name: 'Vicente Admin', email: '', role: 'admin', createdAt: '' },
    category: { id: 'c1', name: 'Desarrollo', slug: 'dev' },
    tags: [],
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-05-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'CSS Moderno con Tailwind v4',
    slug: 'css-moderno-tailwind-v4',
    content: '',
    summary: 'Dominando el nuevo motor CSS-first de Tailwind v4.',
    status: 'draft',
    views: 0,
    author: { id: 'v1', name: 'Vicente Admin', email: '', role: 'admin', createdAt: '' },
    category: { id: 'c1', name: 'Diseño', slug: 'design' },
    tags: [],
    createdAt: '2026-05-12T14:30:00Z',
    updatedAt: '2026-05-12T14:30:00Z',
  },
];

export const PostsPage = () => {
  const columns = [
    { header: 'Título', accessor: 'title' as keyof Post },
    { 
      header: 'Estado', 
      accessor: (post: Post) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          post.status === 'published' ? 'bg-green-50 text-google-green' : 'bg-yellow-50 text-google-yellow'
        }`}>
          {post.status === 'published' ? 'PUBLICADO' : 'BORRADOR'}
        </span>
      )
    },
    { header: 'Autor', accessor: (post: Post) => post.author.name },
    { header: 'Vistas', accessor: 'views' as keyof Post },
    { 
      header: 'Fecha', 
      accessor: (post: Post) => new Date(post.createdAt).toLocaleDateString() 
    },
    {
      header: 'Acciones',
      accessor: (post: Post) => (
        <div className="flex space-x-3">
          <Link to={`/post/${post.slug}`} className="p-1.5 text-gray-400 hover:text-google-blue transition-colors">
            <Eye size={18} />
          </Link>
          <Link to={`/admin/posts/${post.id}/edit`} className="p-1.5 text-gray-400 hover:text-google-blue transition-colors">
            <Edit size={18} />
          </Link>
          <button className="p-1.5 text-gray-400 hover:text-google-red transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Entradas</h1>
          <p className="text-gray-500 font-medium">Gestiona el contenido de tu blog y borradores.</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center px-6 py-3 bg-google-blue text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} className="mr-2" />
          Nueva Entrada
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={MOCK_POSTS} />
      </div>
    </div>
  );
};
