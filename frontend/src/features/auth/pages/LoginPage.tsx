import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { setCredentials } from '../store/authSlice';
import { loginApi, type LoginRequest } from '../services/authApi';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: LoginRequest) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      const result = await loginApi(data);

      dispatch(
        setCredentials({
          user: { name: result.name, email: result.email, role: result.role },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        })
      );

      navigate(result.role === 'Manager' ? '/' : '/reports/history');
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white text-sm font-bold">
            W
          </div>
          <span className="font-semibold text-ink tracking-tight">WorkLog</span>
        </div>

        <div className="panel p-4 sm:p-8">
          <h1 className="page-title text-center mb-1">Sign in</h1>
          <p className="text-ink-muted text-sm text-center mb-6">
            Enter your details to access your reports.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input"
              />
              {errors.email && (
                <p className="text-danger text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="input"
              />
              {errors.password && (
                <p className="text-danger text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {apiError && <div className="alert alert-danger">{apiError}</div>}

            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* <p className="text-ink-muted text-sm text-center mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="link-action">
              Register
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}
