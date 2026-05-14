import { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import type { Post } from '../../types';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { postService } from '../../services/post.service';
import { toast } from 'sonner';
import { useAuthStore } from '../../app/store/useAuthStore';

export const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  
  const canModify = user?.role === 'admin' || user?.role === 'editor';

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await postService.getAdminPosts(1, 100);
      setPosts(response.data);
    } catch (error) {
      toast.error('Error al cargar las entradas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta entrada?')) return;
    try {
      await postService.deletePost(id);
      toast.success('Entrada eliminada');
      loadPosts();
    } catch (error) {
      toast.error('No se pudo eliminar la entrada');
    }
  };

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
    { header: 'Autor', accessor: (post: Post) => post.author?.name ?? '—' },
    { header: 'Vistas', accessor: 'views' as keyof Post },
    { 
      header: 'Fecha', 
      accessor: (post: Post) => new Date(post.createdAt).toLocaleDateString() 
    },
    {
      header: 'Acciones',
      accessor: (post: Post) => (
        <div className="flex space-x-3">
          <Link to={`/post/${post.slug}`} className="p-1.5 text-gray-400 hover:text-google-blue transition-colors" title="Ver publicación">
            <Eye size={18} />
          </Link>
          {canModify && (
            <>
              <Link to={`/admin/posts/${post.id}/edit`} className="p-1.5 text-gray-400 hover:text-google-blue transition-colors" title="Editar">
                <Edit size={18} />
              </Link>
              <button 
                onClick={() => handleDelete(post.id)}
                className="p-1.5 text-gray-400 hover:text-google-red transition-colors"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
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
        {canModify && (
          <Link
            to="/admin/posts/new"
            className="inline-flex items-center px-6 py-3 bg-google-blue text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} className="mr-2" />
            Nueva Entrada
          </Link>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 font-medium">Cargando entradas...</div>
        ) : (
          <DataTable columns={columns} data={posts} />
        )}
      </div>
    </div>
  );
};
