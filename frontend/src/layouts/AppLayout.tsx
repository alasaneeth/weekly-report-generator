import { useState } from 'react';
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

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 5.5h14M3 10h14M3 14.5h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 4l10 10M14 4L4 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AppLayout() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const closeNav = () => setIsNavOpen(false);

  return (
    <div className="h-screen flex bg-bg overflow-hidden">
      {/* Mobile backdrop, shown only while the drawer is open */}
      {isNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeNav}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 h-screen bg-surface border-r border-border flex flex-col shrink-0 transform transition-transform duration-200 ease-in-out ${
          isNavOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-between gap-2 px-5 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white text-xs font-bold">
              W
            </div>
            <span className="font-semibold text-ink text-sm tracking-tight">WorkLog</span>
          </div>
          <button
            onClick={closeNav}
            className="md:hidden p-1 text-ink-muted hover:text-ink"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" onClick={closeNav}>
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

        <div className="border-t border-border p-3 shrink-0">
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

      <div className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">
        {/* Mobile top bar with hamburger trigger */}
        <header className="h-14 flex items-center gap-3 px-4 border-b border-border bg-surface shrink-0 md:hidden">
          <button
            onClick={() => setIsNavOpen(true)}
            className="p-1 text-ink-muted hover:text-ink"
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white text-[10px] font-bold">
              W
            </div>
            <span className="font-semibold text-ink text-sm tracking-tight">WorkLog</span>
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
