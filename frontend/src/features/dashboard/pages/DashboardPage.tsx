import { useAppSelector } from '../../../app/hooks';

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-2xl font-bold text-white">
        Welcome, {user?.name ?? 'User'} ({user?.role})
      </h1>
      <p className="text-slate-400 mt-2">Use the sidebar to navigate.</p>
    </div>
  );
}
