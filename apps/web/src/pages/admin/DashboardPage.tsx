import { useState, useEffect } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Eye, 
  TrendingUp, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { type ReactNode } from 'react';
import { statsService, type DashboardStats } from '../../services/stats.service';
import { postService } from '../../services/post.service';
import { commentService } from '../../services/comment.service';
import type { Post, Comment } from '../../types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../app/store/useAuthStore';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  color: string;
}

const StatCard = ({ title, value, icon, trend, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      {trend && (
        <span className="flex items-center text-xs font-bold text-google-green bg-green-50 px-2 py-1 rounded-full">
          <TrendingUp size={12} className="mr-1" />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-sm font-bold text-gray-500">{title}</h3>
    <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
  </div>
);

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsData, postsData, commentsData] = await Promise.all([
          statsService.getDashboardStats(),
          postService.getAdminPosts(1, 5),
          commentService.getAdminComments(1, 5),
        ]);
        setStats(statsData);
        setRecentPosts(postsData.data);
        setRecentComments(commentsData.data);
      } catch (error) {
        toast.error('Error al cargar datos del dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Entradas',
      value: stats?.totalPosts ?? 0,
      icon: <FileText size={20} className="text-google-blue" />,
      color: 'bg-blue-50',
    },
    {
      title: 'Publicadas',
      value: stats?.publishedPosts ?? 0,
      icon: <CheckCircle2 size={20} className="text-google-green" />,
      color: 'bg-green-50',
    },
    {
      title: 'Comentarios Pendientes',
      value: stats?.pendingComments ?? 0,
      icon: <Clock size={20} className="text-google-yellow" />,
      color: 'bg-yellow-50',
    },
    {
      title: 'Vistas Totales',
      value: stats?.totalViews ? `${(stats.totalViews / 1000).toFixed(1)}k` : '0',
      icon: <Eye size={20} className="text-google-blue" />,
      color: 'bg-blue-50',
    },
  ];

  if (isLoading) {
    return <div className="p-12 text-center text-gray-500 font-bold">Cargando resumen...</div>;
  }

  const isEditor = user?.role === 'editor';
  const pageTitle = isEditor ? 'Mi Panel' : 'Resumen del Panel';
  const pageSubtitle = isEditor
    ? 'Aquí están tus estadísticas personales.'
    : '¡Bienvenido de nuevo! Esto es lo que está pasando hoy.';

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{pageTitle}</h1>
        <p className="text-gray-500 font-medium mt-1">{pageSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText size={20} className="mr-3 text-google-blue" />
            {isEditor ? 'Tus Entradas' : 'Entradas Recientes'}
          </h2>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-google-blue transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{post.title}</p>
                    <p className="text-xs text-gray-500 font-medium">Actualizado: {new Date(post.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  post.status === 'published' ? 'bg-green-50 text-google-green' : 'bg-yellow-50 text-google-yellow'
                }`}>
                  {post.status === 'published' ? 'Publicado' : 'Borrador'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <MessageSquare size={20} className="mr-3 text-google-blue" />
              {isEditor ? 'Tus Comentarios' : 'Comentarios recientes'}
            </h2>
            <Link
              to="/admin/comments"
              className="text-xs font-bold text-google-blue hover:text-blue-700 uppercase tracking-wider"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {recentComments.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed">
                Sin comentarios recientes
              </div>
            ) : (
              recentComments.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col gap-1 p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100"
                >
                  <p className="text-sm font-bold text-gray-900">{c.user.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{c.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate max-w-[60%]">
                      {c.post?.title ?? '—'}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        c.status === 'approved'
                          ? 'bg-green-50 text-google-green'
                          : c.status === 'spam'
                            ? 'bg-red-50 text-google-red'
                            : 'bg-yellow-50 text-google-yellow'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
