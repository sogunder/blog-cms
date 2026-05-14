import { Link, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../app/store/useAuthStore';
import { PublicUserMenu } from './PublicUserMenu';

export const PublicLayout = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-google-blue rounded-xl flex items-center justify-center text-white shadow-google-blue/20 shadow-lg">
              <span className="text-xl font-bold">B</span>
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Blog<span className="text-google-blue">CMS</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-google-blue transition-colors">
              Inicio
            </Link>
            <Link to="/categories" className="text-sm font-semibold text-gray-600 hover:text-google-blue transition-colors">
              Categorías
            </Link>
            <Link to="/about" className="text-sm font-semibold text-gray-600 hover:text-google-blue transition-colors">
              Sobre nosotros
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <PublicUserMenu />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-bold text-gray-900 hover:text-google-blue transition-colors px-4 py-2"
                >
                  Entrar
                </Link>
                <Link
                  to="/login"
                  className="bg-google-blue text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-100"
                >
                  Empezar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-12 max-w-6xl">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-extrabold text-gray-900 tracking-tight mb-4 inline-block">
              Blog<span className="text-google-blue">CMS</span>
            </Link>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              Un CMS moderno y de alto rendimiento diseñado para creadores de contenido que valoran la velocidad y el diseño.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Plataforma</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><Link to="/" className="hover:text-google-blue transition-colors">Características</Link></li>
              <li><Link to="/" className="hover:text-google-blue transition-colors">Integraciones</Link></li>
              <li><Link to="/" className="hover:text-google-blue transition-colors">Precios</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Soporte</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><Link to="/" className="hover:text-google-blue transition-colors">Documentación</Link></li>
              <li><Link to="/" className="hover:text-google-blue transition-colors">Referencia API</Link></li>
              <li><Link to="/" className="hover:text-google-blue transition-colors">Comunidad</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t text-center text-sm text-gray-400 font-medium">
          <p>&copy; {new Date().getFullYear()} Blog CMS</p>
        </div>
      </footer>
    </div>
  );
};
