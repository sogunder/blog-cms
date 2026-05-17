import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  useNavigate,
  useLocation,
  Navigate,
  Link,
} from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../app/store/useAuthStore';
import { authService } from '../../services/auth.service';
import { getApiErrorMessage } from '../../utils/api-error';

const registerSchema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),

    email: z
      .string()
      .min(1, 'El correo es requerido')
      .email('Introduce un correo válido'),

    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),

    confirmPassword: z
      .string()
      .min(6, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const from = (location.state as any)?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  if (hasHydrated && isAuthenticated && user) {
    if (user.role === 'admin' || user.role === 'editor') {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      toast.success('Cuenta creada correctamente. Ahora inicia sesión.');

      navigate('/login', { replace: true });
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Error al crear la cuenta'));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-google-blue rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <span className="text-3xl font-bold">B</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Crear Cuenta
          </h1>

          <p className="text-gray-500 mt-2 font-medium">
            Únete a Blog CMS
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Nombre"
            type="text"
            placeholder="Tu nombre"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="Correo electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            className="w-full py-4 text-base rounded-2xl bg-google-blue hover:bg-blue-600"
            isLoading={isSubmitting}
          >
            Crear Cuenta
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="text-google-blue font-semibold hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};