import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../app/store/useAuthStore';
import { authService } from '../../services/auth.service';

export const PublicUserMenu = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  if (!user) return null;

  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() ?? '?';
  const canAdmin = user.role === 'admin' || user.role === 'editor';

  const handleLogout = async () => {
    setOpen(false);
    try {
      await authService.logout();
    } catch {
      /* token inválido o red */
    }
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-bold text-gray-900 shadow-sm hover:border-google-blue/40 hover:bg-gray-50/80 transition-colors"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-google-blue text-white text-sm">
          {initial}
        </span>
        <span className="hidden sm:inline max-w-[10rem] truncate">{user.name}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-1 shadow-xl shadow-gray-200/60 z-50"
        >
          {canAdmin && (
            <Link
              role="menuitem"
              to="/admin"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard size={18} className="text-gray-400" />
              Panel
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-google-red hover:bg-red-50/80"
            onClick={() => void handleLogout()}
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
