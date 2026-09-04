import { useAppSelector } from '../../../app/hooks';

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <h1 className="text-2xl font-bold text-white">
        Welcome, {user?.name ?? 'User'} (placeholder dashboard)
      </h1>
    </div>
  );
}