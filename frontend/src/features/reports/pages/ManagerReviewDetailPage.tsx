import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getReportByIdApi,
  approveReportApi,
  requestChangesApi,
  type ReportResponse,
} from '../services/reportApi';

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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-red-400">Report not found.</p>
      </div>
    );
  }

  const canReview = report.status === 'Submitted';

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto bg-slate-800 rounded-xl p-8 shadow-lg space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{report.userName}</h1>
            <p className="text-slate-400 text-sm">
              Week of {new Date(report.weekStartDate).toLocaleDateString()} —{' '}
              {new Date(report.weekEndDate).toLocaleDateString()}
              {report.projectName && ` · ${report.projectName}`}
            </p>
          </div>
          <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {report.status}
          </span>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {report.managerComment && (
          <div className="bg-orange-900/40 border border-orange-500 rounded-lg p-3">
            <p className="text-orange-300 text-sm font-semibold">Previous Manager Comment</p>
            <p className="text-orange-100 text-sm">{report.managerComment}</p>
          </div>
        )}

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Tasks Completed</h2>
          <div className="space-y-2">
            {report.tasks.map((t, i) => (
              <div key={i} className="bg-slate-700 rounded-lg p-3 text-sm text-slate-200">
                <p className="font-medium text-white">{t.taskName}</p>
                <p>
                  Priority: {t.priority} · Status: {t.status} · Planned {t.plannedPercentage}% /
                  Actual {t.actualPercentage}% · {t.timeSpentHours}h spent of {t.timePlannedHours}h
                </p>
                {t.deliverable && <p>Deliverable: {t.deliverable}</p>}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Next Week</h2>
          {report.nextWeekTasks.length === 0 && (
            <p className="text-slate-500 text-sm">None</p>
          )}
          {report.nextWeekTasks.map((n, i) => (
            <p key={i} className="text-slate-300 text-sm">
              • {n.taskName} {n.description && `— ${n.description}`}
            </p>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Blockers</h2>
          {report.blockers.length === 0 && <p className="text-slate-500 text-sm">None</p>}
          {report.blockers.map((b, i) => (
            <p key={i} className="text-slate-300 text-sm">
              • {b.description} {b.isKeyIssue && <span className="text-red-400">(Key Issue)</span>}
            </p>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Achievements</h2>
          {report.achievements.length === 0 && <p className="text-slate-500 text-sm">None</p>}
          {report.achievements.map((a, i) => (
            <p key={i} className="text-slate-300 text-sm">
              • {a.description}{' '}
              {a.isKeyAchievement && <span className="text-green-400">(Key Achievement)</span>}
            </p>
          ))}
        </section>

        {report.notes && (
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Notes</h2>
            <p className="text-slate-300 text-sm">{report.notes}</p>
          </section>
        )}

        {canReview && (
          <div className="border-t border-slate-700 pt-6 space-y-3">
            {!showCommentBox ? (
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={isActing}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowCommentBox(true)}
                  disabled={isActing}
                  className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  Request Changes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm text-slate-300 mb-1">
                  Comment for {report.userName}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg bg-slate-700 text-white px-3 py-2"
                  placeholder="Explain what needs to be corrected..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleRequestChanges}
                    disabled={isActing}
                    className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Send Back for Correction
                  </button>
                  <button
                    onClick={() => setShowCommentBox(false)}
                    disabled={isActing}
                    className="bg-slate-600 hover:bg-slate-500 text-white font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => navigate('/manager/reports')}
          className="text-blue-400 hover:underline text-sm"
        >
          ← Back to Team Reports
        </button>
      </div>
    </div>
  );
}
