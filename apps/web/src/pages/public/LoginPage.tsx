import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../app/store/useAuthStore';
import { authService } from '../../services/auth.service';

const loginSchema = z.object({
  email: z.string().min(1, 'El usuario o email es requerido'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const from = (location.state as any)?.from?.pathname || '/admin';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await authService.login(data);
      
      setAuth(response.user, response.token);
      toast.success(`¡Bienvenido de nuevo, ${response.user.name}!`);
      
      if (response.user.role === 'admin' || response.user.role === 'editor') {
        navigate(from, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al intentar iniciar sesión';
      toast.error(message);
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
            label="Usuario o Correo"
            type="text"
            placeholder="vicente"
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

        <div className="mt-8 pt-6 border-t border-gray-50 text-center text-sm text-gray-400 font-medium">
          <p>Credenciales de prueba: <span className="text-google-blue">vicente / vicente</span></p>
        </div>
      </div>
    </div>
  );
};
