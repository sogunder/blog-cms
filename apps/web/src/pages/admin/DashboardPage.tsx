import { 
  FileText, 
  MessageSquare, 
  Users, 
  Eye, 
  TrendingUp, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  color: string;
}

const StatCard = ({ title, value, icon, trend, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      {trend && (
        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <TrendingUp size={12} className="mr-1" />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

export const DashboardPage = () => {
  const stats = [
    {
      title: 'Total Posts',
      value: '24',
      icon: <FileText size={20} className="text-indigo-600" />,
      trend: '+12%',
      color: 'bg-indigo-50',
    },
    {
      title: 'Published',
      value: '18',
      icon: <CheckCircle2 size={20} className="text-green-600" />,
      color: 'bg-green-50',
    },
    {
      title: 'Pending Comments',
      value: '12',
      icon: <Clock size={20} className="text-yellow-600" />,
      color: 'bg-yellow-50',
    },
    {
      title: 'Total Views',
      value: '45.2k',
      icon: <Eye size={20} className="text-blue-600" />,
      trend: '+8%',
      color: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts Activity */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText size={18} className="mr-2 text-indigo-600" />
            Recent Posts
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">React 19 Hooks Guide</p>
                    <p className="text-xs text-gray-500">Published 2 hours ago</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Published
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Comments Activity */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare size={18} className="mr-2 text-indigo-600" />
            Recent Comments
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <Users size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Alex Johnson</p>
                    <p className="text-xs text-gray-500">10m ago</p>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-0.5">
                    "Great article! I'm really looking forward to trying out the new..."
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
