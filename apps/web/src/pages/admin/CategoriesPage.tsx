import { useState, useEffect } from 'react';
import { DataTable } from '../../components/ui/DataTable';
import type { Category } from '../../types';
import { Trash2, Plus, Tag as TagIcon } from 'lucide-react';
import { categoryService } from '../../services/category.service';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getAdminCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Error al cargar categorías');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await categoryService.createCategory({ name: newName.trim() });
      toast.success('Categoría creada');
      setNewName('');
      setIsAdding(false);
      loadCategories();
    } catch (error) {
      toast.error('Error al crear categoría');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await categoryService.deleteCategory(id);
      toast.success('Categoría eliminada');
      loadCategories();
    } catch (error) {
      toast.error('No se pudo eliminar');
    }
  };

  const columns = [
    { 
      header: 'Nombre', 
      accessor: (c: Category) => (
        <div className="flex items-center space-x-3 font-bold text-gray-900">
          <div className="p-2 bg-blue-50 rounded-lg text-google-blue">
            <TagIcon size={16} />
          </div>
          <span>{c.name}</span>
        </div>
      )
    },
    { header: 'Slug', accessor: 'slug' as keyof Category },
    { 
      header: 'Entradas', 
      accessor: (c: Category) => (
        <span className="font-bold text-gray-500">{c.postCount ?? 0}</span>
      )
    },
    {
      header: 'Acciones',
      accessor: (c: Category) => (
        <button 
          onClick={() => handleDelete(c.id)}
          className="p-1.5 text-gray-400 hover:text-google-red transition-colors"
        >
          <Trash2 size={18} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Categorías</h1>
          <p className="text-gray-500 font-medium">Organiza el contenido de tu blog.</p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-google-blue text-white rounded-2xl font-bold"
        >
          <Plus size={20} className="mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-end space-x-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex-1">
            <Input 
              label="Nombre de la Categoría" 
              placeholder="Ej: Tutoriales" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} className="mb-1 h-[52px] bg-google-blue rounded-2xl">Crear</Button>
          <Button variant="outline" onClick={() => setIsAdding(false)} className="mb-1 h-[52px] rounded-2xl">Cancelar</Button>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 font-bold">Cargando categorías...</div>
        ) : (
          <DataTable columns={columns} data={categories} />
        )}
      </div>
    </div>
  );
};
