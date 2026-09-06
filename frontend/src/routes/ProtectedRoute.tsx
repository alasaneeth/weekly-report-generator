import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface ProtectedRouteProps {
  allowedRoles?: Array<'TeamMember' | 'Manager'>;
  redirectTo?: string;
}

export default function ProtectedRoute({ allowedRoles, redirectTo = '/' }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
