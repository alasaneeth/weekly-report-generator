import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  getDashboardSummaryApi,
  getDashboardChartsApi,
  type DashboardSummary,
  type DashboardCharts,
} from '../services/dashboardApi';

const statusColorMap: Record<string, string> = {
  Draft: '#64748b',
  Submitted: '#3b82f6',
  NeedsCorrection: '#f97316',
  Approved: '#16a34a',
  'No Report': '#334155',
};

const PIE_COLORS = ['#3b82f6', '#f97316', '#16a34a', '#a855f7', '#eab308', '#ef4444'];

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-800 rounded-xl p-5">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [charts, setCharts] = useState<DashboardCharts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getDashboardSummaryApi(), getDashboardChartsApi()])
      .then(([summaryData, chartsData]) => {
        setSummary(summaryData);
        setCharts(chartsData);
      })
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  if (error || !summary || !charts) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-red-400">{error ?? 'No data available.'}</p>
      </div>
    );
  }

  const memberStatusData = charts.statusByMember.map((m) => ({
    name: m.userName,
    value: 1,
    status: m.status,
  }));

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-white">Team Insights</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard label="Reports This Week" value={summary.reportsThisWeek} />
          <SummaryCard
            label="Compliance Rate"
            value={`${summary.complianceRatePercent}%`}
          />
          <SummaryCard label="Needs Correction" value={summary.needsCorrectionCount} />
          <SummaryCard label="Open Blockers" value={summary.openBlockersCount} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status by member */}
          <div className="bg-slate-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">This Week — Submission Status</h2>
            {memberStatusData.length === 0 ? (
              <p className="text-slate-500 text-sm">No team members yet.</p>
            ) : (
              <div className="space-y-2">
                {memberStatusData.map((m, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">{m.name}</span>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: statusColorMap[m.status] ?? '#64748b' }}
                    >
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Workload by project */}
          <div className="bg-slate-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Workload by Project (This Week)</h2>
            {charts.workloadByProject.length === 0 ? (
              <p className="text-slate-500 text-sm">No reports this week yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={charts.workloadByProject}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="projectName" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }}
                  />
                  <Bar dataKey="reportCount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Time by task type */}
          <div className="bg-slate-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Time Spent by Task Type</h2>
            {charts.timeByTaskType.length === 0 ? (
              <p className="text-slate-500 text-sm">
                No task-type hours recorded yet (optional field).
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={charts.timeByTaskType}
                    dataKey="hours"
                    nameKey="taskType"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {charts.timeByTaskType.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }}
                  />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent activity */}
          <div className="bg-slate-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
            {charts.recentActivity.length === 0 ? (
              <p className="text-slate-500 text-sm">No activity yet.</p>
            ) : (
              <div className="space-y-2">
                {charts.recentActivity.map((a, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">
                      {a.userName} —{' '}
                      <span style={{ color: statusColorMap[a.status] ?? '#94a3b8' }}>
                        {a.status}
                      </span>
                    </span>
                    <span className="text-slate-500 text-xs">
                      {new Date(a.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
