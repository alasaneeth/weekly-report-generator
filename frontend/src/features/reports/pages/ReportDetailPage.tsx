import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getReportByIdApi,
  updateReportApi,
  submitReportApi,
  type SaveReportInput,
  type ReportResponse,
} from '../services/reportApi';
import { getProjectsApi, type Project } from '../../projects/services/projectApi';

const statusBadge: Record<string, string> = {
  Draft: 'badge-neutral',
  Submitted: 'badge-primary',
  NeedsCorrection: 'badge-warning',
  Approved: 'badge-success',
};

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, control, handleSubmit, reset } = useForm<SaveReportInput>();
  const taskFields = useFieldArray({ control, name: 'tasks' });
  const nextWeekFields = useFieldArray({ control, name: 'nextWeekTasks' });
  const blockerFields = useFieldArray({ control, name: 'blockers' });
  const achievementFields = useFieldArray({ control, name: 'achievements' });

  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    getProjectsApi().then(setProjects).catch(() => setProjects([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    getReportByIdApi(id)
      .then((data) => {
        setReport(data);
        reset({
          projectId: data.projectId,
          weekStartDate: data.weekStartDate.split('T')[0],
          weekEndDate: data.weekEndDate.split('T')[0],
          notes: data.notes ?? '',
          links: data.links ?? '',
          tasks: data.tasks,
          nextWeekTasks: data.nextWeekTasks,
          blockers: data.blockers,
          achievements: data.achievements,
          hoursByTaskTypes: [],
        });
      })
      .catch(() => setApiError('Failed to load report.'))
      .finally(() => setLoading(false));
  }, [id, reset]);

  const isEditable = report?.status === 'Draft' || report?.status === 'NeedsCorrection';

  const saveChanges = async (data: SaveReportInput) => {
    if (!id) return;
    setIsSaving(true);
    setApiError(null);
    try {
      await updateReportApi(id, data);
      navigate('/reports/history');
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveAndSubmit = async (data: SaveReportInput) => {
    if (!id) return;
    setIsSaving(true);
    setApiError(null);
    try {
      await updateReportApi(id, data);
      await submitReportApi(id);
      navigate('/reports/history');
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? 'Failed to submit report.');
    } finally {
      setIsSaving(false);
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

  if (!isEditable) {
    return (
      <div className="page p-6 md:p-8">
        <div className="max-w-3xl mx-auto panel p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="page-title">
                Week of {new Date(report.weekStartDate).toLocaleDateString()}
              </h1>
              {report.projectName && (
                <p className="text-ink-muted text-sm mt-0.5">{report.projectName}</p>
              )}
            </div>
            <span className={`badge ${statusBadge[report.status] ?? 'badge-neutral'}`}>
              {report.status}
            </span>
          </div>

          {report.managerComment && (
            <div className="alert alert-warning">
              <p className="alert-title">Manager comment</p>
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
                {a.isKeyAchievement && (
                  <span className="badge badge-success ml-1">Key achievement</span>
                )}
              </p>
            ))}
          </section>

          <button onClick={() => navigate('/reports/history')} className="link-action">
            ← Back to my reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page p-6 md:p-8">
      <div className="max-w-4xl mx-auto panel p-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="page-title">Edit Weekly Report</h1>
          <span className={`badge ${statusBadge[report.status] ?? 'badge-neutral'}`}>
            {report.status}
          </span>
        </div>

        {report.managerComment && (
          <div className="alert alert-warning">
            <p className="alert-title">Manager requested changes</p>
            <p>{report.managerComment}</p>
          </div>
        )}

        {apiError && <div className="alert alert-danger">{apiError}</div>}

        <form className="space-y-8">
          <div>
            <label className="field-label">Project (optional)</label>
            <select {...register('projectId')} className="input">
              <option value="">No project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Week start</label>
              <input
                type="date"
                {...register('weekStartDate', { required: true })}
                className="input"
              />
            </div>
            <div>
              <label className="field-label">Week end</label>
              <input
                type="date"
                {...register('weekEndDate', { required: true })}
                className="input"
              />
            </div>
          </div>

          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="section-title">Tasks completed</h2>
              <button
                type="button"
                onClick={() =>
                  taskFields.append({
                    taskName: '',
                    priority: 'Medium',
                    plannedPercentage: 0,
                    actualPercentage: 0,
                    status: 'NotStarted',
                    timePlannedHours: 0,
                    timeSpentHours: 0,
                    deliverable: '',
                  })
                }
                className="link-action"
              >
                + Add task
              </button>
            </div>
            <div className="space-y-4">
              {taskFields.fields.map((field, index) => (
                <div key={field.id} className="subpanel p-4 space-y-3">
                  <div>
                    <label className="field-label">Task name</label>
                    <input
                      {...register(`tasks.${index}.taskName` as const, { required: true })}
                      className="input"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="field-label">Priority</label>
                      <select
                        {...register(`tasks.${index}.priority` as const)}
                        className="input"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Status</label>
                      <select
                        {...register(`tasks.${index}.status` as const)}
                        className="input"
                      >
                        <option value="NotStarted">Not Started</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Planned %</label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.plannedPercentage` as const, { valueAsNumber: true })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="field-label">Actual %</label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.actualPercentage` as const, { valueAsNumber: true })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="field-label">Time planned (hrs)</label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.timePlannedHours` as const, { valueAsNumber: true })}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="field-label">Time spent (hrs)</label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.timeSpentHours` as const, { valueAsNumber: true })}
                        className="input"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="field-label">Deliverable</label>
                      <input
                        {...register(`tasks.${index}.deliverable` as const)}
                        className="input"
                      />
                    </div>
                  </div>
                  {taskFields.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => taskFields.remove(index)}
                      className="link-danger"
                    >
                      Remove task
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="section-title">Planned for next week</h2>
              <button
                type="button"
                onClick={() => nextWeekFields.append({ taskName: '', description: '' })}
                className="link-action"
              >
                + Add
              </button>
            </div>
            <div className="space-y-3">
              {nextWeekFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 gap-2 items-end">
                  <div>
                    <label className="field-label">Task name</label>
                    <input
                      {...register(`nextWeekTasks.${index}.taskName` as const)}
                      className="input"
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="field-label">Description (optional)</label>
                      <input
                        {...register(`nextWeekTasks.${index}.description` as const)}
                        className="input"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => nextWeekFields.remove(index)}
                      className="link-danger pb-2.5"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="section-title">Blockers</h2>
              <button
                type="button"
                onClick={() => blockerFields.append({ description: '', isKeyIssue: false })}
                className="link-action"
              >
                + Add blocker
              </button>
            </div>
            <div className="space-y-3">
              {blockerFields.fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="field-label">Description</label>
                    <input
                      {...register(`blockers.${index}.description` as const)}
                      className="input"
                    />
                  </div>
                  <label className="flex items-center gap-1.5 text-ink text-sm whitespace-nowrap pb-2.5">
                    <input
                      type="checkbox"
                      {...register(`blockers.${index}.isKeyIssue` as const)}
                      className="checkbox"
                    />
                    Key issue
                  </label>
                  <button
                    type="button"
                    onClick={() => blockerFields.remove(index)}
                    className="link-danger pb-2.5"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="section-title">Achievements</h2>
              <button
                type="button"
                onClick={() =>
                  achievementFields.append({ description: '', isKeyAchievement: false })
                }
                className="link-action"
              >
                + Add achievement
              </button>
            </div>
            <div className="space-y-3">
              {achievementFields.fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="field-label">Description</label>
                    <input
                      {...register(`achievements.${index}.description` as const)}
                      className="input"
                    />
                  </div>
                  <label className="flex items-center gap-1.5 text-ink text-sm whitespace-nowrap pb-2.5">
                    <input
                      type="checkbox"
                      {...register(`achievements.${index}.isKeyAchievement` as const)}
                      className="checkbox"
                    />
                    Key achievement
                  </label>
                  <button
                    type="button"
                    onClick={() => achievementFields.remove(index)}
                    className="link-danger pb-2.5"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Notes (optional)</label>
              <textarea {...register('notes')} className="input" rows={3} />
            </div>
            <div>
              <label className="field-label">Links (optional)</label>
              <textarea {...register('links')} className="input" rows={3} />
            </div>
          </div>

          <div className="flex gap-3 border-t border-border pt-6">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSubmit(saveChanges)}
              className="btn btn-secondary"
            >
              Save changes
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSubmit(saveAndSubmit)}
              className="btn btn-primary"
            >
              Save &amp; submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
