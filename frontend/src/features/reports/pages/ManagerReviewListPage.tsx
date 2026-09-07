import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllReportsForManagerApi,
  type ManagerReportSummary,
} from '../services/reportApi';
import { getProjectsApi, type Project } from '../../projects/services/projectApi';
import { getUsersApi, type UserSummary } from '../../users/services/userApi';

const statusBadge: Record<string, string> = {
  Draft: 'badge-neutral',
  Submitted: 'badge-primary',
  NeedsCorrection: 'badge-warning',
  Approved: 'badge-success',
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
    <div className="page p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="page-title">Team Reports</h1>
          <p className="text-ink-muted text-sm mt-0.5">Review and act on reports submitted by your team.</p>
        </div>

        <div className="flex gap-2 mb-4 border-b border-border overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap shrink-0 transition ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              {tab === 'NeedsCorrection' ? 'Needs Correction' : tab}
            </button>
          ))}
        </div>

        <div className="panel p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:items-end">
          <div>
            <label className="field-label">Member</label>
            <select
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="input"
            >
              <option value="">All members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label">Project</label>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="input"
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
            <label className="field-label">Week from</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input"
            />
          </div>

          <div>
            <label className="field-label">Week to</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input"
            />
          </div>

          <button onClick={clearFilters} className="link-muted text-left pb-2.5">
            Clear filters
          </button>
        </div>

        {loading && <p className="text-ink-muted text-sm">Loading…</p>}
        {error && <div className="alert alert-danger mb-4">{error}</div>}
        {!loading && !error && reports.length === 0 && (
          <div className="panel p-4 sm:p-8 text-center">
            <p className="text-ink-muted text-sm">No reports found for this filter.</p>
          </div>
        )}

        <div className="space-y-2">
          {reports.map((r) => (
            <Link
              key={r.id}
              to={`/manager/reports/${r.id}`}
              className="block panel p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 transition hover:border-border-strong"
            >
              <div>
                <p className="text-ink font-medium text-sm">{r.userName}</p>
                <p className="text-ink-muted text-sm mt-0.5">
                  {new Date(r.weekStartDate).toLocaleDateString()} –{' '}
                  {new Date(r.weekEndDate).toLocaleDateString()}
                  {r.projectName && ` · ${r.projectName}`}
                </p>
              </div>
              <span className={`badge ${statusBadge[r.status] ?? 'badge-neutral'}`}>{r.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
