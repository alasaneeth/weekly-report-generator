import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/store/authSlice';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-2 rounded-lg text-sm transition ${
    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
  }`;

export default function AppLayout() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col p-4 shrink-0">
        <div className="mb-6 px-2">
          <p className="text-white font-semibold truncate">{user?.name}</p>
          <p className="text-slate-500 text-xs">{user?.role}</p>
        </div>

        <nav className="flex-1 space-y-1">
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/reports/history" className={linkClass}>
            My Reports
          </NavLink>
          <NavLink to="/reports/new" className={linkClass}>
            New Report
          </NavLink>

          {user?.role === 'Manager' && (
            <>
              <div className="pt-4 pb-1 text-xs text-slate-500 uppercase tracking-wide px-4">
                Manager
              </div>
              <NavLink to="/insights" className={linkClass}>
                Team Insights
              </NavLink>
              <NavLink to="/manager/reports" className={linkClass}>
                Review Team Reports
              </NavLink>
              <NavLink to="/projects" className={linkClass}>
                Manage Projects
              </NavLink>
            </>
          )}

          <div className="pt-4 pb-1 text-xs text-slate-500 uppercase tracking-wide px-4">
            Account
          </div>
          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>
          <NavLink to="/settings" className={linkClass}>
            Settings
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
