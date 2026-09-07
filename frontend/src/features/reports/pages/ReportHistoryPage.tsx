import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyReportHistoryApi, type ReportSummary } from '../services/reportApi';

const statusBadge: Record<string, string> = {
  Draft: 'badge-neutral',
  Submitted: 'badge-primary',
  NeedsCorrection: 'badge-warning',
  Approved: 'badge-success',
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
    <div className="page p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <div>
            <h1 className="page-title">My Reports</h1>
            <p className="text-ink-muted text-sm mt-0.5">Your submitted and draft weekly reports.</p>
          </div>
          <Link to="/reports/new" className="btn btn-primary">
            + New Report
          </Link>
        </div>

        {loading && <p className="text-ink-muted text-sm">Loading…</p>}
        {!loading && reports.length === 0 && (
          <div className="panel p-4 sm:p-8 text-center">
            <p className="text-ink-muted text-sm">No reports yet. Create your first one to get started.</p>
          </div>
        )}

        <div className="space-y-2">
          {reports.map((r) => (
            <Link
              key={r.id}
              to={`/reports/${r.id}`}
              className="block panel p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 transition hover:border-border-strong"
            >
              <div>
                <p className="text-ink font-medium text-sm">
                  {new Date(r.weekStartDate).toLocaleDateString()} –{' '}
                  {new Date(r.weekEndDate).toLocaleDateString()}
                </p>
                {r.projectName && <p className="text-ink-muted text-sm mt-0.5">{r.projectName}</p>}
              </div>
              <span className={`badge ${statusBadge[r.status] ?? 'badge-neutral'}`}>{r.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
