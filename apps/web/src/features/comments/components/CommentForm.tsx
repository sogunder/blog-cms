import { useState } from 'react';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../../app/store/useAuthStore';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { commentService } from '../../../services/comment.service';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../../../utils/api-error';

const commentSchema = z.object({
  content: z.string().min(2, 'El comentario es muy corto').max(8000),
  guestName: z.string().optional(),
  guestEmail: z.string().email('Email inválido').optional(),
}).refine(data => {
  // If not authenticated, guest fields are required
  return true; // Logic handled inside onSubmit for better DX with useForm
}, {
  message: "Nombre y email son obligatorios para invitados",
});

interface CommentFormProps {
  postId: string;
  onSuccess?: () => void;
}

type CommentFormValues = z.infer<typeof commentSchema>;

export const CommentForm = ({ postId, onSuccess }: CommentFormProps) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (values: CommentFormValues) => {
    if (!isAuthenticated) {
      if (!values.guestName?.trim() || !values.guestEmail?.trim()) {
        toast.error('Nombre y correo son obligatorios para comentar como invitado');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await commentService.createComment({
        post: postId,
        content: values.content.trim(),
        guestName: values.guestName?.trim(),
        guestEmail: values.guestEmail?.trim(),
      });
      toast.success('Comentario enviado. Se publicará tras ser revisado.');
      reset();
      onSuccess?.();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'No se pudo enviar el comentario'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Deja un comentario</h3>
        <p className="text-gray-500 text-sm font-medium">
          Tu opinión es importante. Los comentarios son moderados antes de publicarse.
        </p>
      </div>

      <div className="space-y-4">
        {!isAuthenticated && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Input
                label="Nombre"
                {...register('guestName')}
                placeholder="Tu nombre"
                className="bg-white"
              />
              {errors.guestName && (
                <p className="text-xs text-red-500 font-bold">{errors.guestName.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Input
                label="Correo"
                type="email"
                {...register('guestEmail')}
                placeholder="tu@email.com"
                className="bg-white"
              />
              {errors.guestEmail && (
                <p className="text-xs text-red-500 font-bold">{errors.guestEmail.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-bold text-gray-700 ml-1">Mensaje</label>
          <textarea
            {...register('content')}
            className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all outline-none min-h-[120px] text-sm font-medium bg-white"
            placeholder="Escribe lo que piensas..."
          />
          {errors.content && (
            <p className="text-xs text-red-500 font-bold">{errors.content.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="bg-google-blue hover:bg-blue-600 rounded-2xl w-full sm:w-auto"
          isLoading={isSubmitting}
        >
          <Send size={16} className="mr-2" />
          Enviar comentario
        </Button>
      </div>
    </form>
  );
};
