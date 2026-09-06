import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAllReportsForManagerApi,
  type ManagerReportSummary,
} from '../services/reportApi';

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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('Submitted');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const filters = activeTab === 'All' ? undefined : { status: activeTab };

    getAllReportsForManagerApi(filters)
      .then(setReports)
      .catch(() => setError('Failed to load reports.'))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Team Reports — Review</h1>

        <div className="flex gap-2 mb-6">
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
