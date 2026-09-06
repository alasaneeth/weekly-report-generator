import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllReportsForManagerApi,
  type ManagerReportSummary,
} from '../services/reportApi';
import { getProjectsApi, type Project } from '../../projects/services/projectApi';
import { getUsersApi, type UserSummary } from '../../users/services/userApi';

const statusColors: Record<string, string> = {
  Draft: 'bg-slate-500',
  Submitted: 'bg-blue-500',
  NeedsCorrection: 'bg-orange-500',
  Approved: 'bg-green-600',
};

const filterTabs = ['All', 'Submitted', 'NeedsCorrection', 'Approved'] as const;
type FilterTab = (typeof filterTabs)[number];

export default function ManagerReviewListPage() {
  const [reports, setReports] = useState<ManagerReportSummary[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<FilterTab>('Submitted');
  const [memberFilter, setMemberFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    getProjectsApi().then(setProjects).catch(() => setProjects([]));
    getUsersApi().then(setMembers).catch(() => setMembers([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getAllReportsForManagerApi({
      status: activeTab === 'All' ? undefined : activeTab,
      userId: memberFilter || undefined,
      projectId: projectFilter || undefined,
      weekStartFrom: dateFrom || undefined,
      weekStartTo: dateTo || undefined,
    })
      .then(setReports)
      .catch(() => setError('Failed to load reports.'))
      .finally(() => setLoading(false));
  }, [activeTab, memberFilter, projectFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setMemberFilter('');
    setProjectFilter('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Team Reports — Review</h1>

        <div className="flex gap-2 mb-4">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab === 'NeedsCorrection' ? 'Needs Correction' : tab}
            </button>
          ))}
        </div>

        <div className="bg-slate-800 rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Member</label>
            <select
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="w-full rounded-lg bg-slate-700 text-white px-2 py-2 text-sm"
            >
              <option value="">All members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Project</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="w-full rounded-lg bg-slate-700 text-white px-2 py-2 text-sm"
            >
              <option value="">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Week From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-lg bg-slate-700 text-white px-2 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Week To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-lg bg-slate-700 text-white px-2 py-2 text-sm"
            />
          </div>

          <button
            onClick={clearFilters}
            className="text-slate-400 hover:text-white text-sm underline"
          >
            Clear filters
          </button>
        </div>

        {loading && <p className="text-slate-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && reports.length === 0 && (
          <p className="text-slate-400">No reports found for this filter.</p>
        )}

        <div className="space-y-3">
          {reports.map((r) => (
            <Link
              key={r.id}
              to={`/manager/reports/${r.id}`}
              className="block bg-slate-800 hover:bg-slate-700 rounded-lg p-4 flex justify-between items-center transition"
            >
              <div>
                <p className="text-white font-medium">{r.userName}</p>
                <p className="text-slate-400 text-sm">
                  {new Date(r.weekStartDate).toLocaleDateString()} -{' '}
                  {new Date(r.weekEndDate).toLocaleDateString()}
                  {r.projectName && ` · ${r.projectName}`}
                </p>
              </div>
              <span
                className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${
                  statusColors[r.status] ?? 'bg-slate-500'
                }`}
              >
                {r.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
