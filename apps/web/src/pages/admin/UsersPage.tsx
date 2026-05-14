import { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import type { User } from '../../types';
import { Trash2, Shield, User as UserIcon } from 'lucide-react';
import { userService } from '../../services/user.service';
import { toast } from 'sonner';

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUsers(1, 100);
      setUsers(data.data);
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;
    try {
      await userService.deleteUser(id);
      toast.success('Usuario eliminado');
      loadUsers();
    } catch (error) {
      toast.error('No se pudo eliminar el usuario');
    }
  };

  const columns = [
    { 
      header: 'Usuario', 
      accessor: (u: User) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-google-blue font-bold text-xs border border-blue-100">
            {u.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-900">{u.name}</p>
            <p className="text-xs text-gray-500">{u.email}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Rol', 
      accessor: (u: User) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center w-fit ${
          u.role === 'admin' ? 'bg-red-50 text-google-red' : 
          u.role === 'editor' ? 'bg-blue-50 text-google-blue' : 'bg-gray-50 text-gray-500'
        }`}>
          {u.role === 'admin' ? <Shield size={10} className="mr-1" /> : <UserIcon size={10} className="mr-1" />}
          {u.role}
        </span>
      )
    },
    { 
      header: 'Miembro desde', 
      accessor: (u: User) =>
        u.createdAt
          ? new Date(u.createdAt).toLocaleDateString()
          : '—',
    },
    {
      header: 'Acciones',
      accessor: (u: User) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleDelete(u.id)}
            className="p-1.5 text-gray-400 hover:text-google-red transition-colors"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Usuarios</h1>
        <p className="text-gray-500 font-medium">Gestiona los permisos y accesos al CMS.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 font-bold">Cargando usuarios...</div>
        ) : (
          <DataTable columns={columns} data={users} />
        )}
      </div>
    </div>
  );
};
