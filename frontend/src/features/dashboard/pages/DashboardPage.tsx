import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { logout } from '../../auth/store/authSlice';

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">
          Welcome, {user?.name ?? 'User'} ({user?.role})
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <Link to="/reports/history" className="text-blue-400 hover:underline">
          View My Reports →
        </Link>

        {user?.role === 'Manager' && (
          <>
            <Link to="/manager/reports" className="text-blue-400 hover:underline">
              Review Team Reports →
            </Link>
            <Link to="/projects" className="text-blue-400 hover:underline">
              Manage Projects →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
