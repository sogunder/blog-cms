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
  const stats = [
    {
      title: 'Total Entradas',
      value: '24',
      icon: <FileText size={20} className="text-google-blue" />,
      trend: '+12%',
      color: 'bg-blue-50',
    },
    {
      title: 'Publicadas',
      value: '18',
      icon: <CheckCircle2 size={20} className="text-google-green" />,
      color: 'bg-green-50',
    },
    {
      title: 'Comentarios Pendientes',
      value: '12',
      icon: <Clock size={20} className="text-google-yellow" />,
      color: 'bg-yellow-50',
    },
    {
      title: 'Vistas Totales',
      value: '45.2k',
      icon: <Eye size={20} className="text-google-blue" />,
      trend: '+8%',
      color: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Resumen del Panel</h1>
        <p className="text-gray-500 font-medium mt-1">¡Bienvenido de nuevo! Esto es lo que está pasando hoy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts Activity */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText size={20} className="mr-3 text-google-blue" />
            Entradas Recientes
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-google-blue transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Guía de Hooks en React 19</p>
                    <p className="text-xs text-gray-500 font-medium">Publicado hace 2 horas</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-google-green bg-green-50 px-3 py-1 rounded-full">
                  Publicado
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Comments Activity */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageSquare size={20} className="mr-3 text-google-blue" />
            Comentarios Recientes
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-google-blue flex-shrink-0 font-bold">
                  <Users size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">Alex Johnson</p>
                    <p className="text-xs text-gray-500 font-medium">hace 10m</p>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1 font-medium">
                    "¡Excelente artículo! Tengo muchas ganas de probar las nuevas..."
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
