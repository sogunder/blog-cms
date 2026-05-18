import { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import type { Comment } from '../../types';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';
import { commentService } from '../../services/comment.service';
import { toast } from 'sonner';
import { useAuthStore } from '../../app/store/useAuthStore';

export const CommentsPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const isEditor = user?.role === 'editor';

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const data = await commentService.getAdminComments(1, 100);
      setComments(data.data);
    } catch (error) {
      toast.error('Error al cargar comentarios');
    } finally {
      setIsLoading(false);
    }
  };

  const canModerateComment = (comment: Comment): boolean => {
    if (user?.role === 'admin') return true;
    if (isEditor) return comment.post?.id !== undefined; // Si editor, solo sus posts (filtrado en backend)
    return false;
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await commentService.updateCommentStatus(id, status);
      toast.success(`Comentario ${status === 'approved' ? 'aprobado' : 'marcado como spam'}`);
      loadComments();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast.error('No tienes permiso para moderar este comentario');
      } else {
        toast.error('Error al actualizar el estado');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este comentario permanentemente?')) return;
    try {
      await commentService.deleteComment(id);
      toast.success('Comentario eliminado');
      loadComments();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        toast.error('No tienes permiso para eliminar este comentario');
      } else {
        toast.error('No se pudo eliminar');
      }
    }
  };

  const columns = [
    { 
      header: 'Autor', 
      accessor: (c: Comment) => (
        <div>
          <p className="font-bold text-gray-900">{c.user.name}</p>
          <p className="text-xs text-gray-500">{c.user.email}</p>
        </div>
      )
    },
    { 
      header: 'Comentario', 
      accessor: (c: Comment) => (
        <p className="max-w-md truncate text-gray-600 font-medium">{c.content}</p>
      )
    },
    { 
      header: 'Post', 
      accessor: (c: Comment) => c.post?.title ?? 'N/A'
    },
    { 
      header: 'Estado', 
      accessor: (c: Comment) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
          c.status === 'approved' ? 'bg-green-50 text-google-green' : 
          c.status === 'pending' ? 'bg-yellow-50 text-google-yellow' : 'bg-red-50 text-google-red'
        }`}>
          {c.status}
        </span>
      )
    },
    {
      header: 'Acciones',
      accessor: (c: Comment) => (
        <div className="flex space-x-2">
          {canModerateComment(c) && (
            <>
              {c.status !== 'approved' && (
                <button 
                  onClick={() => handleUpdateStatus(c.id, 'approved')}
                  className="p-1.5 text-gray-400 hover:text-google-green transition-colors"
                  title="Aprobar"
                >
                  <CheckCircle size={18} />
                </button>
              )}
              {c.status !== 'spam' && (
                <button 
                  onClick={() => handleUpdateStatus(c.id, 'spam')}
                  className="p-1.5 text-gray-400 hover:text-google-yellow transition-colors"
                  title="Marcar Spam"
                >
                  <XCircle size={18} />
                </button>
              )}
              <button 
                onClick={() => handleDelete(c.id)}
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
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {isEditor ? 'Comentarios en mis posts' : 'Comentarios'}
        </h1>
        <p className="text-gray-500 font-medium">
          {isEditor ? 'Modera los comentarios en tus entradas.' : 'Gestiona la conversación en tu blog.'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 font-bold">Cargando comentarios...</div>
        ) : comments.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            {isEditor ? 'No hay comentarios en tus posts' : 'Sin comentarios'}
          </div>
        ) : (
          <DataTable columns={columns} data={comments} />
        )}
      </div>
    </div>
  );
};
