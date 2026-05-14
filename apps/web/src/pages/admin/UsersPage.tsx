import { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import type { User, UserRole } from '../../types';
import { Trash2, Shield, User as UserIcon, Plus, Edit2 } from 'lucide-react';
import { userService } from '../../services/user.service';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'reader', label: 'Lector' },
];

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'reader' as UserRole,
  });

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

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'reader',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Password is optional on edit
      role: user.role,
    });
    setIsModalOpen(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedUser) {
        // Update
        const updateData: any = { ...formData };
        if (!updateData.password) delete updateData.password;
        await userService.updateUser(selectedUser.id, updateData);
        toast.success('Usuario actualizado');
      } else {
        // Create
        if (!formData.password) {
          toast.error('La contraseña es obligatoria');
          setIsSubmitting(false);
          return;
        }
        await userService.createUser(formData);
        toast.success('Usuario creado');
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { 
      header: 'Usuario', 
      accessor: (u: User) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-google-blue font-bold text-sm border border-blue-200 shadow-sm">
            {u.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900">{u.name}</p>
            <p className="text-xs text-gray-500 font-medium">{u.email}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Rol', 
      accessor: (u: User) => (
        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center w-fit border shadow-sm ${
          u.role === 'admin' ? 'bg-red-50 text-google-red border-red-100' : 
          u.role === 'editor' ? 'bg-blue-50 text-google-blue border-blue-100' : 'bg-gray-50 text-gray-500 border-gray-100'
        }`}>
          {u.role === 'admin' ? <Shield size={12} className="mr-1.5" /> : <UserIcon size={12} className="mr-1.5" />}
          {u.role}
        </span>
      )
    },
    { 
      header: 'Miembro desde', 
      accessor: (u: User) => (
        <span className="text-sm font-semibold text-gray-600">
          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (u: User) => (
        <div className="flex space-x-1">
          <button 
            onClick={() => handleOpenEdit(u)}
            className="p-2 text-gray-400 hover:text-google-blue hover:bg-blue-50 rounded-xl transition-all"
            title="Editar"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => handleDelete(u.id)}
            className="p-2 text-gray-400 hover:text-google-red hover:bg-red-50 rounded-xl transition-all"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Usuarios</h1>
          <p className="text-gray-500 font-bold mt-1">Gestiona los permisos y accesos al CMS.</p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-google-blue text-white rounded-2xl font-bold"
        >
          <Plus size={20} className="mr-2" />          Nuevo Usuario
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        {isLoading ? (
          <div className="p-24 text-center">
            <div className="w-12 h-12 border-4 border-google-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold">Cargando usuarios...</p>
          </div>
        ) : (
          <DataTable columns={columns} data={users} />
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <Input
            label="Nombre Completo"
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="juan@ejemplo.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label={selectedUser ? 'Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!selectedUser}
          />
          <Select
            label="Rol del Usuario"
            options={ROLE_OPTIONS}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
          />

          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-google-blue text-white rounded-2xl font-bold py-4 h-auto shadow-lg shadow-google-blue/20"
            >
              {isSubmitting ? 'Guardando...' : selectedUser ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 rounded-2xl font-bold py-4 h-auto border-2"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
