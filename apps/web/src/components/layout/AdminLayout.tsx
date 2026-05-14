import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../app/store/useAuthStore';
import { authService } from '../../services/auth.service';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Users, 
  Tags, 
  LogOut,
  User as UserIcon,
  Search,
  Bell
} from 'lucide-react';
import { clsx } from 'clsx';

export const AdminLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      /* sesión ya inválida */
    }
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Panel Control', icon: LayoutDashboard, path: '/admin' },
    { label: 'Entradas', icon: FileText, path: '/admin/posts' },
    { label: 'Comentarios', icon: MessageSquare, path: '/admin/comments' },
    { label: 'Categorías', icon: Tags, path: '/admin/categories' },
    { label: 'Usuarios', icon: Users, path: '/admin/users', roles: ['admin'] },
  ].filter(item => !item.roles || (user && item.roles.includes(user.role)));

  return (
    <div className="flex h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r hidden lg:flex flex-col shadow-sm">
        <div className="h-20 flex items-center px-8 border-b">
          <Link to="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-google-blue rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-100">
              <span className="text-sm font-bold">B</span>
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
              Blog<span className="text-google-blue">CMS</span>
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 p-6 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-4">
            Menú Principal
          </p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive 
                    ? 'bg-blue-50 text-google-blue shadow-sm shadow-blue-100/50' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon size={20} className={clsx(
                  'transition-colors',
                  isActive ? 'text-google-blue' : 'text-gray-400 group-hover:text-gray-900'
                )} />
                <span className="font-bold text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t bg-gray-50/50">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-4">
             <div className="flex items-center space-x-3 mb-3">
               <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-google-blue">
                 <UserIcon size={16} />
               </div>
               <div className="min-w-0">
                 <p className="text-xs font-bold text-gray-900 truncate">{user?.name}</p>
                 <p className="text-[10px] text-gray-500 truncate capitalize">
                   {user?.role === 'admin' ? 'Administrador' : 'Editor'}
                 </p>
               </div>
             </div>
             <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 w-full px-3 py-2 text-xs font-bold text-google-red bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut size={14} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-8 z-30">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar entradas, usuarios, analíticas..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100/50 border-transparent focus:bg-white focus:border-google-blue focus:ring-4 focus:ring-blue-100 rounded-xl text-sm transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-google-red rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <Link to="/" className="text-[10px] font-bold text-google-blue hover:text-blue-700 uppercase tracking-wider">
                  Ver Sitio
                </Link>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-google-blue to-blue-600 p-0.5 shadow-md shadow-blue-100">
                <div className="h-full w-full rounded-[9px] bg-white flex items-center justify-center text-google-blue">
                  <UserIcon size={20} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
