import { useState, useEffect } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Eye, 
  TrendingUp, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { ReactNode } from 'react';
import { statsService, DashboardStats } from '../../services/stats.service';
import { postService } from '../../services/post.service';
import type { Post } from '../../types';
import { toast } from 'sonner';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsData, postsData] = await Promise.all([
          statsService.getDashboardStats(),
          postService.getAdminPosts(1, 5),
        ]);
        setStats(statsData);
        setRecentPosts(postsData.data);
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

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Resumen del Panel</h1>
        <p className="text-gray-500 font-medium mt-1">¡Bienvenido de nuevo! Esto es lo que está pasando hoy.</p>
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
            Entradas Recientes
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
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageSquare size={20} className="mr-3 text-google-blue" />
            Comentarios Recientes
          </h2>
          <div className="space-y-4">
            <div className="p-8 text-center text-gray-400 font-medium bg-gray-50 rounded-2xl border border-dashed">
              Próximamente: Actividad de comentarios en tiempo real
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
