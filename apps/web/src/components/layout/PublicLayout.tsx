import { Link, Outlet } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
              <span className="text-xl font-bold">B</span>
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Blog<span className="text-indigo-600">CMS</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-10">
            <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link to="/categories" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
              Categories
            </Link>
            <Link to="/about" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            <Link
              to="/login"
              className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-md shadow-gray-200"
            >
              Get Started
            </Link>
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
              Blog<span className="text-indigo-600">CMS</span>
            </Link>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              A modern, high-performance CMS built for developers and content creators who value speed and design.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><Link to="/" className="hover:text-indigo-600 transition-colors">Features</Link></li>
              <li><Link to="/" className="hover:text-indigo-600 transition-colors">Integrations</Link></li>
              <li><Link to="/" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><Link to="/" className="hover:text-indigo-600 transition-colors">Documentation</Link></li>
              <li><Link to="/" className="hover:text-indigo-600 transition-colors">API Reference</Link></li>
              <li><Link to="/" className="hover:text-indigo-600 transition-colors">Community</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t text-center text-sm text-gray-400 font-medium">
          <p>&copy; {new Date().getFullYear()} Blog CMS. Built with passion and React 19.</p>
        </div>
      </footer>
    </div>
  );
};
