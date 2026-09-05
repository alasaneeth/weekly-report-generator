import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyReportHistoryApi, type ReportSummary } from '../services/reportApi';

const statusColors: Record<string, string> = {
  Draft: 'bg-slate-500',
  Submitted: 'bg-blue-500',
  NeedsCorrection: 'bg-orange-500',
  Approved: 'bg-green-600',
};

export default function ReportHistoryPage() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReportHistoryApi()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">My Reports</h1>
          <Link
            to="/reports/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            + New Report
          </Link>
        </div>

        {loading && <p className="text-slate-400">Loading...</p>}
        {!loading && reports.length === 0 && (
          <p className="text-slate-400">No reports yet. Create your first one!</p>
        )}

        <div className="space-y-3">
          {reports.map((r) => (
            <Link
              key={r.id}
              to={`/reports/${r.id}`}
              className="block bg-slate-800 hover:bg-slate-700 rounded-lg p-4 flex justify-between items-center transition"
            >
              <div>
                <p className="text-white font-medium">
                  {new Date(r.weekStartDate).toLocaleDateString()} -{' '}
                  {new Date(r.weekEndDate).toLocaleDateString()}
                </p>
                {r.projectName && <p className="text-slate-400 text-sm">{r.projectName}</p>}
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