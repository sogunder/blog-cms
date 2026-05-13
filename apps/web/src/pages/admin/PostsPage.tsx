import { DataTable } from '../../components/ui/DataTable';
import type { Post } from '../../types';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Getting Started with React 19',
    slug: 'getting-started-react-19',
    content: '',
    summary: 'A brief guide to the new features in React 19.',
    status: 'published',
    views: 1250,
    author: { id: 'u1', name: 'John Doe', email: '', role: 'admin', createdAt: '' },
    category: { id: 'c1', name: 'Development', slug: 'dev' },
    tags: [],
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-05-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Modern CSS with Tailwind v4',
    slug: 'modern-css-tailwind-v4',
    content: '',
    summary: 'Mastering the new CSS-first engine of Tailwind v4.',
    status: 'draft',
    views: 0,
    author: { id: 'u1', name: 'John Doe', email: '', role: 'admin', createdAt: '' },
    category: { id: 'c1', name: 'Design', slug: 'design' },
    tags: [],
    createdAt: '2026-05-12T14:30:00Z',
    updatedAt: '2026-05-12T14:30:00Z',
  },
];

export const PostsPage = () => {
  const columns = [
    { header: 'Title', accessor: 'title' as keyof Post },
    { 
      header: 'Status', 
      accessor: (post: Post) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {post.status.toUpperCase()}
        </span>
      )
    },
    { header: 'Author', accessor: (post: Post) => post.author.name },
    { header: 'Views', accessor: 'views' as keyof Post },
    { 
      header: 'Date', 
      accessor: (post: Post) => new Date(post.createdAt).toLocaleDateString() 
    },
    {
      header: 'Actions',
      accessor: (post: Post) => (
        <div className="flex space-x-2">
          <Link to={`/post/${post.slug}`} className="p-1 text-gray-500 hover:text-indigo-600">
            <Eye size={18} />
          </Link>
          <Link to={`/admin/posts/${post.id}/edit`} className="p-1 text-gray-500 hover:text-indigo-600">
            <Edit size={18} />
          </Link>
          <button className="p-1 text-gray-500 hover:text-red-600">
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-500">Manage your blog content and drafts.</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create Post
        </Link>
      </div>

      <DataTable columns={columns} data={MOCK_POSTS} />
    </div>
  );
};
