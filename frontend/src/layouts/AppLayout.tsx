import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/store/authSlice';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-primary-soft text-primary-hover'
      : 'text-ink-muted hover:bg-surface-alt hover:text-ink'
  }`;

function initials(name?: string) {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function AppLayout() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-bg">
      <aside className="w-64 bg-surface border-r border-border flex flex-col shrink-0">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white text-xs font-bold">
            W
          </div>
          <span className="font-semibold text-ink text-sm tracking-tight">WorkLog</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {user?.role === 'Manager' && (
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
          )}
          <NavLink to="/reports/history" className={linkClass}>
            My Reports
          </NavLink>
          <NavLink to="/reports/new" className={linkClass}>
            New Report
          </NavLink>

          {user?.role === 'Manager' && (
            <>
              <div className="pt-4 pb-1 px-3 text-xs font-semibold text-ink-subtle">
                Manager
              </div>
              <NavLink to="/manager/reports" className={linkClass}>
                Review Team Reports
              </NavLink>
              <NavLink to="/projects" className={linkClass}>
                Manage Projects
              </NavLink>
            </>
          )}

          <div className="pt-4 pb-1 px-3 text-xs font-semibold text-ink-subtle">
            Account
          </div>
          <NavLink to="/users" className={linkClass}>
            Team Members
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            Profile
          </NavLink>
          <NavLink to="/settings" className={linkClass}>
            Settings
          </NavLink>
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-primary-soft text-primary-hover flex items-center justify-center text-xs font-semibold shrink-0">
              {initials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-ink text-sm font-medium truncate">{user?.name}</p>
              <p className="text-ink-subtle text-xs truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left rounded-md px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface-alt hover:text-danger transition"
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
