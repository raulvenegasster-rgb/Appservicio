import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';

const schema = z
  .object({
    full_name: z.string().min(3, 'Ingresa tu nombre completo'),
    email: z.string().email('Ingresa un correo válido ID Global Solutions'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Confirma tu contraseña')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  });

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      const { confirmPassword, ...payload } = values;
      await registerUser(payload);
      toast.success('Registro exitoso, ¡bienvenido!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'No fue posible registrarte');
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-sm font-medium">Nombre completo</label>
              <Input placeholder="Nombre Apellido" {...register('full_name')} />
              {errors.full_name && <p className="text-xs text-red-400 mt-1">{errors.full_name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Correo corporativo</label>
              <Input type="email" placeholder="tu@idgs.com" {...register('email')} />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <Input type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Confirmar contraseña</label>
              <Input type="password" placeholder="••••••••" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creando cuenta...' : 'Registrarme'}
            </Button>
            <p className="text-xs text-center text-slate-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-secondary hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
