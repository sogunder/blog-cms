import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { postService } from '../../services/post.service';
import { categoryService } from '../../services/category.service';
import { tagService } from '../../services/tag.service';
import type { Category, Tag } from '../../types';
import { ChevronLeft, Save, Eye } from 'lucide-react';

const postSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  slug: z.string().optional(),
  summary: z.string().min(10, 'El resumen debe tener al menos 10 caracteres'),
  content: z.string().min(20, 'El contenido es muy corto'),
  category: z.string().min(1, 'La categoría es obligatoria'),
  tags: z.array(z.string()).default([]),
  status: z.enum(['published', 'draft']).default('draft'),
});

type PostFormValues = z.infer<typeof postSchema>;

export const PostEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      status: 'draft',
      tags: [],
    },
  });

  const selectedTags = watch('tags');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsData, tagsData] = await Promise.all([
          categoryService.getAdminCategories(),
          tagService.getAdminTags(),
        ]);
        setCategories(catsData);
        setTags(tagsData);

        if (isEdit && id) {
          const post = await postService.getAdminPost(id);
          setValue('title', post.title);
          setValue('slug', post.slug);
          setValue('summary', post.summary);
          setValue('content', post.content);
          setValue('category', post.category.id);
          setValue('tags', post.tags.map(t => t.id));
          setValue('status', post.status);
        }
      } catch (error) {
        toast.error('Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, isEdit, setValue]);

  const onSubmit = async (data: PostFormValues) => {
    try {
      if (isEdit && id) {
        await postService.updatePost(id, data);
        toast.success('Entrada actualizada correctamente');
      } else {
        await postService.createPost(data);
        toast.success('Entrada creada correctamente');
      }
      navigate('/admin/posts');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar la entrada');
    }
  };

  const toggleTag = (tagId: string) => {
    const current = selectedTags || [];
    if (current.includes(tagId)) {
      setValue('tags', current.filter(id => id !== tagId));
    } else {
      setValue('tags', [...current, tagId]);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center font-bold text-gray-500">Cargando editor...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/admin/posts')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {isEdit ? 'Editar Entrada' : 'Nueva Entrada'}
            </h1>
            <p className="text-gray-500 font-medium">Completa los campos para publicar tu contenido.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="rounded-2xl border-gray-200"
            onClick={() => window.open(`/post/${watch('slug')}`, '_blank')}
            disabled={!isEdit}
          >
            <Eye size={18} className="mr-2" />
            Vista Previa
          </Button>
          <Button 
            onClick={handleSubmit(onSubmit)} 
            className="bg-google-blue hover:bg-blue-600 rounded-2xl px-8"
            isLoading={isSubmitting}
          >
            <Save size={18} className="mr-2" />
            Guardar Entrada
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <Input
              label="Título de la Entrada"
              placeholder="Ej: Mi primer artículo con React 19"
              {...register('title')}
              error={errors.title?.message}
            />

            <Input
              label="Slug (URL Amigable)"
              placeholder="mi-primer-articulo-react-19"
              {...register('slug')}
              error={errors.slug?.message}
            />

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Resumen</label>
              <textarea
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all outline-none min-h-[100px]"
                placeholder="Un breve resumen que aparecerá en los listados..."
                {...register('summary')}
              />
              {errors.summary && <p className="text-xs text-google-red font-bold">{errors.summary.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Contenido (HTML)</label>
              <textarea
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all outline-none min-h-[400px] font-mono text-sm"
                placeholder="Escribe aquí el contenido de tu entrada..."
                {...register('content')}
              />
              {errors.content && <p className="text-xs text-google-red font-bold">{errors.content.message}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Estado de Publicación</label>
              <select
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-google-blue outline-none transition-all appearance-none bg-white font-medium"
                {...register('status')}
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Categoría</label>
              <select
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-google-blue outline-none transition-all appearance-none bg-white font-medium"
                {...register('category')}
              >
                <option value="">Selecciona una categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-google-red font-bold">{errors.category.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700">Etiquetas (Tags)</label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedTags?.includes(tag.id)
                        ? 'bg-google-blue text-white shadow-md shadow-blue-100'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
