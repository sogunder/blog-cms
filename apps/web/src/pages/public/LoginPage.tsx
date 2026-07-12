import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../app/store/useAuthStore';
import { authService } from '../../services/auth.service';
import { getApiErrorMessage } from '../../utils/api-error';

const loginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Introduce un correo válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  
  const from = (location.state as any)?.from?.pathname || '/admin';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (hasHydrated && isAuthenticated && user) {
    if (user.role === 'admin' || user.role === 'editor') {
      return <Navigate to={from} replace />;
    }
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await authService.login(data);
      
      setAuth(response.user, response.token, response.refreshToken);
      toast.success(`¡Bienvenido de nuevo, ${response.user.name}!`);
      
      if (response.user.role === 'admin' || response.user.role === 'editor') {
        navigate(from, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Error al intentar iniciar sesión'));
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-google-blue rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <span className="text-3xl font-bold">B</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Iniciar Sesión</h1>
          <p className="text-gray-500 mt-2 font-medium">Gestiona tu Blog CMS</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="admin@ejemplo.com"
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

          <Button type="submit" className="w-full py-4 text-base rounded-2xl bg-google-blue hover:bg-blue-600" isLoading={isSubmitting}>
            Continuar
          </Button>
        </form>
      </div>
    </div>
  );
};
