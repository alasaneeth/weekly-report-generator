import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getReportByIdApi,
  approveReportApi,
  requestChangesApi,
  type ReportResponse,
} from '../services/reportApi';

const statusBadge: Record<string, string> = {
  Draft: 'badge-neutral',
  Submitted: 'badge-primary',
  NeedsCorrection: 'badge-warning',
  Approved: 'badge-success',
};

export default function ManagerReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [isActing, setIsActing] = useState(false);

  useEffect(() => {
    if (!id) return;
    getReportByIdApi(id)
      .then(setReport)
      .catch(() => setError('Failed to load report.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    setIsActing(true);
    setError(null);
    try {
      await approveReportApi(id);
      navigate('/manager/reports');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to approve report.');
    } finally {
      setIsActing(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!id) return;
    if (!comment.trim()) {
      setError('Please enter a comment explaining what needs to change.');
      return;
    }
    setIsActing(true);
    setError(null);
    try {
      await requestChangesApi(id, comment);
      navigate('/manager/reports');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to request changes.');
    } finally {
      setIsActing(false);
    }
  };

  if (loading) {
    return (
      <div className="page flex items-center justify-center">
        <p className="text-ink-muted text-sm">Loading…</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="page flex items-center justify-center">
        <p className="text-danger text-sm">Report not found.</p>
      </div>
    );
  }

  const canReview = report.status === 'Submitted';

  return (
    <div className="page p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto panel p-4 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h1 className="page-title">{report.userName}</h1>
            <p className="text-ink-muted text-sm mt-0.5">
              Week of {new Date(report.weekStartDate).toLocaleDateString()} –{' '}
              {new Date(report.weekEndDate).toLocaleDateString()}
              {report.projectName && ` · ${report.projectName}`}
            </p>
          </div>
          <span className={`badge ${statusBadge[report.status] ?? 'badge-neutral'}`}>
            {report.status}
          </span>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {report.managerComment && (
          <div className="alert alert-warning">
            <p className="alert-title">Previous manager comment</p>
            <p>{report.managerComment}</p>
          </div>
        )}

        <section>
          <h2 className="section-title mb-2">Tasks completed</h2>
          <div className="space-y-2">
            {report.tasks.map((t, i) => (
              <div key={i} className="subpanel p-3 text-sm text-ink-muted">
                <p className="font-medium text-ink">{t.taskName}</p>
                <p className="mt-0.5">
                  Priority: {t.priority} · Status: {t.status} · Planned {t.plannedPercentage}% /
                  Actual {t.actualPercentage}% · {t.timeSpentHours}h spent of {t.timePlannedHours}h
                </p>
                {t.deliverable && <p className="mt-0.5">Deliverable: {t.deliverable}</p>}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title mb-2">Next week</h2>
          {report.nextWeekTasks.length === 0 && (
            <p className="text-ink-subtle text-sm">None</p>
          )}
          {report.nextWeekTasks.map((n, i) => (
            <p key={i} className="text-ink-muted text-sm">
              • {n.taskName} {n.description && `— ${n.description}`}
            </p>
          ))}
        </section>

        <section>
          <h2 className="section-title mb-2">Blockers</h2>
          {report.blockers.length === 0 && <p className="text-ink-subtle text-sm">None</p>}
          {report.blockers.map((b, i) => (
            <p key={i} className="text-ink-muted text-sm">
              • {b.description}{' '}
              {b.isKeyIssue && <span className="badge badge-warning ml-1">Key issue</span>}
            </p>
          ))}
        </section>

        <section>
          <h2 className="section-title mb-2">Achievements</h2>
          {report.achievements.length === 0 && <p className="text-ink-subtle text-sm">None</p>}
          {report.achievements.map((a, i) => (
            <p key={i} className="text-ink-muted text-sm">
              • {a.description}{' '}
              {a.isKeyAchievement && <span className="badge badge-success ml-1">Key achievement</span>}
            </p>
          ))}
        </section>

        {report.notes && (
          <section>
            <h2 className="section-title mb-2">Notes</h2>
            <p className="text-ink-muted text-sm">{report.notes}</p>
          </section>
        )}

        {canReview && (
          <div className="border-t border-border pt-6 space-y-3">
            {!showCommentBox ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleApprove} disabled={isActing} className="btn btn-success">
                  Approve
                </button>
                <button
                  onClick={() => setShowCommentBox(true)}
                  disabled={isActing}
                  className="btn btn-warning"
                >
                  Request changes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="field-label">Comment for {report.userName}</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="input"
                  placeholder="Explain what needs to be corrected…"
                />
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleRequestChanges}
                    disabled={isActing}
                    className="btn btn-warning"
                  >
                    Send back for correction
                  </button>
                  <button
                    onClick={() => setShowCommentBox(false)}
                    disabled={isActing}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button onClick={() => navigate('/manager/reports')} className="link-action">
          ← Back to team reports
        </button>
      </div>
    </div>
  );
}
