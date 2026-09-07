import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { registerApi, type RegisterRequest } from '../services/authApi';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>();

  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: RegisterRequest) => {
    setApiError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await registerApi(data);
      setSuccessMessage('Registration successful! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white text-sm font-bold">
            W
          </div>
          <span className="font-semibold text-ink tracking-tight">WorkLog</span>
        </div>

        <div className="panel p-4 sm:p-8">
          <h1 className="page-title text-center mb-1">Create account</h1>
          <p className="text-ink-muted text-sm text-center mb-6">
            Set up access to start submitting weekly reports.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="field-label">First name</label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className="input"
                />
                {errors.firstName && (
                  <p className="text-danger text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="field-label">Last name</label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className="input"
                />
                {errors.lastName && (
                  <p className="text-danger text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input"
              />
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="input"
              />
              {errors.password && (
                <p className="text-danger text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="field-label">Date of birth</label>
                <input type="date" {...register('dateOfBirth')} className="input" />
              </div>
              <div>
                <label className="field-label">Mobile</label>
                <input {...register('mobile')} className="input" />
              </div>
            </div>

            <div>
              <label className="field-label">Role</label>
              <select
                {...register('role', { required: 'Role is required' })}
                className="input"
              >
                <option value="">Select a role</option>
                <option value="TeamMember">Team Member</option>
                <option value="Manager">Manager</option>
              </select>
              {errors.role && <p className="text-danger text-xs mt-1">{errors.role.message}</p>}
            </div>

            {apiError && <div className="alert alert-danger">{apiError}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
              {isSubmitting ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="text-ink-muted text-sm text-center mt-5">
            Already have an account?{' '}
            <Link to="/login" className="link-action">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
