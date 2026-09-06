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
  Draft: '#98a2b3',
  Submitted: '#1d4ed8',
  NeedsCorrection: '#b54708',
  Approved: '#027a48',
  'No Report': '#d0d5dd',
};

const statusBadgeMap: Record<string, string> = {
  Draft: 'badge-neutral',
  Submitted: 'badge-primary',
  NeedsCorrection: 'badge-warning',
  Approved: 'badge-success',
  'No Report': 'badge-neutral',
};

const PIE_COLORS = ['#1d4ed8', '#b54708', '#027a48', '#7c3aed', '#c11574', '#0e7490'];

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="panel p-5">
      <p className="text-ink-muted text-sm">{label}</p>
      <p className="text-ink text-3xl font-semibold mt-1 tracking-tight">{value}</p>
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
      <div className="page flex items-center justify-center">
        <p className="text-ink-muted text-sm">Loading dashboard…</p>
      </div>
    );
  }

  if (error || !summary || !charts) {
    return (
      <div className="page flex items-center justify-center">
        <p className="text-danger text-sm">{error ?? 'No data available.'}</p>
      </div>
    );
  }

  const memberStatusData = charts.statusByMember.map((m) => ({
    name: m.userName,
    value: 1,
    status: m.status,
  }));

  return (
    <div className="page p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="page-title">Team Insights</h1>
          <p className="text-ink-muted text-sm mt-0.5">
            An overview of this week's reporting activity across your team.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard label="Reports this week" value={summary.reportsThisWeek} />
          <SummaryCard
            label="Compliance rate"
            value={`${summary.complianceRatePercent}%`}
          />
          <SummaryCard label="Needs correction" value={summary.needsCorrectionCount} />
          <SummaryCard label="Open blockers" value={summary.openBlockersCount} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Status by member */}
          <div className="panel p-5">
            <h2 className="section-title mb-4">This week — Submission status</h2>
            {memberStatusData.length === 0 ? (
              <p className="text-ink-subtle text-sm">No team members yet.</p>
            ) : (
              <div className="space-y-1">
                {memberStatusData.map((m, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-1.5 border-b border-border last:border-0"
                  >
                    <span className="text-ink text-sm">{m.name}</span>
                    <span className={`badge ${statusBadgeMap[m.status] ?? 'badge-neutral'}`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Workload by project */}
          <div className="panel p-5">
            <h2 className="section-title mb-4">Workload by project (this week)</h2>
            {charts.workloadByProject.length === 0 ? (
              <p className="text-ink-subtle text-sm">No reports this week yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={charts.workloadByProject}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3e6eb" vertical={false} />
                  <XAxis dataKey="projectName" stroke="#98a2b3" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#98a2b3" fontSize={12} allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e3e6eb',
                      borderRadius: 8,
                      color: '#101828',
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="reportCount" fill="#1d4ed8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Time by task type */}
          <div className="panel p-5">
            <h2 className="section-title mb-4">Time spent by task type</h2>
            {charts.timeByTaskType.length === 0 ? (
              <p className="text-ink-subtle text-sm">
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
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e3e6eb',
                      borderRadius: 8,
                      color: '#101828',
                      fontSize: 13,
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#667085', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent activity */}
          <div className="panel p-5">
            <h2 className="section-title mb-4">Recent activity</h2>
            {charts.recentActivity.length === 0 ? (
              <p className="text-ink-subtle text-sm">No activity yet.</p>
            ) : (
              <div className="space-y-1">
                {charts.recentActivity.map((a, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-1.5 border-b border-border last:border-0 text-sm"
                  >
                    <span className="text-ink">
                      {a.userName}{' '}
                      <span style={{ color: statusColorMap[a.status] ?? '#667085' }}>
                        · {a.status}
                      </span>
                    </span>
                    <span className="text-ink-subtle text-xs">
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
