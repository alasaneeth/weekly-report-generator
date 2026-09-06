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

  if (!isEditable) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-3xl mx-auto bg-slate-800 rounded-xl p-8 shadow-lg space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              Week of {new Date(report.weekStartDate).toLocaleDateString()}
            </h1>
            <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {report.status}
            </span>
          </div>

          {report.managerComment && (
            <div className="bg-orange-900/40 border border-orange-500 rounded-lg p-3">
              <p className="text-orange-300 text-sm font-semibold">Manager Comment</p>
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

          <button
            onClick={() => navigate('/reports/history')}
            className="text-blue-400 hover:underline text-sm"
          >
            ← Back to My Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl p-8 shadow-lg space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Edit Weekly Report</h1>
          <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {report.status}
          </span>
        </div>

        {report.managerComment && (
          <div className="bg-orange-900/40 border border-orange-500 rounded-lg p-3">
            <p className="text-orange-300 text-sm font-semibold">Manager requested changes:</p>
            <p className="text-orange-100 text-sm">{report.managerComment}</p>
          </div>
        )}

        {apiError && <p className="text-red-400 text-sm">{apiError}</p>}

        <form className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Week Start</label>
              <input
                type="date"
                {...register('weekStartDate', { required: true })}
                className="w-full rounded-lg bg-slate-700 text-white px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Week End</label>
              <input
                type="date"
                {...register('weekEndDate', { required: true })}
                className="w-full rounded-lg bg-slate-700 text-white px-3 py-2"
              />
            </div>
          </div>

          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-white">Tasks Completed</h2>
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
                className="text-blue-400 hover:underline text-sm"
              >
                + Add Task
              </button>
            </div>
            <div className="space-y-4">
              {taskFields.fields.map((field, index) => (
                <div key={field.id} className="bg-slate-700 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Task Name</label>
                    <input
                      {...register(`tasks.${index}.taskName` as const, { required: true })}
                      className="w-full rounded-lg bg-slate-600 text-white px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Priority</label>
                      <select
                        {...register(`tasks.${index}.priority` as const)}
                        className="w-full rounded-lg bg-slate-600 text-white px-2 py-2"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Status</label>
                      <select
                        {...register(`tasks.${index}.status` as const)}
                        className="w-full rounded-lg bg-slate-600 text-white px-2 py-2"
                      >
                        <option value="NotStarted">Not Started</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Planned %</label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.plannedPercentage` as const, { valueAsNumber: true })}
                        className="w-full rounded-lg bg-slate-600 text-white px-2 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Actual %</label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.actualPercentage` as const, { valueAsNumber: true })}
                        className="w-full rounded-lg bg-slate-600 text-white px-2 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Time Planned (hrs)</label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.timePlannedHours` as const, { valueAsNumber: true })}
                        className="w-full rounded-lg bg-slate-600 text-white px-2 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Time Spent (hrs)</label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.timeSpentHours` as const, { valueAsNumber: true })}
                        className="w-full rounded-lg bg-slate-600 text-white px-2 py-2"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">Deliverable</label>
                      <input
                        {...register(`tasks.${index}.deliverable` as const)}
                        className="w-full rounded-lg bg-slate-600 text-white px-2 py-2"
                      />
                    </div>
                  </div>
                  {taskFields.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => taskFields.remove(index)}
                      className="text-red-400 text-xs hover:underline"
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
              <h2 className="text-lg font-semibold text-white">Planned for Next Week</h2>
              <button
                type="button"
                onClick={() => nextWeekFields.append({ taskName: '', description: '' })}
                className="text-blue-400 hover:underline text-sm"
              >
                + Add
              </button>
            </div>
            <div className="space-y-3">
              {nextWeekFields.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 gap-2 items-end">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Task Name</label>
                    <input
                      {...register(`nextWeekTasks.${index}.taskName` as const)}
                      className="w-full rounded-lg bg-slate-700 text-white px-3 py-2"
                    />
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-xs text-slate-400 mb-1">Description (optional)</label>
                      <input
                        {...register(`nextWeekTasks.${index}.description` as const)}
                        className="w-full rounded-lg bg-slate-700 text-white px-3 py-2"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => nextWeekFields.remove(index)}
                      className="text-red-400 text-sm pb-2"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-white">Blockers</h2>
              <button
                type="button"
                onClick={() => blockerFields.append({ description: '', isKeyIssue: false })}
                className="text-blue-400 hover:underline text-sm"
              >
                + Add Blocker
              </button>
            </div>
            <div className="space-y-3">
              {blockerFields.fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">Description</label>
                    <input
                      {...register(`blockers.${index}.description` as const)}
                      className="w-full rounded-lg bg-slate-700 text-white px-3 py-2"
                    />
                  </div>
                  <label className="flex items-center gap-1 text-slate-300 text-sm whitespace-nowrap pb-2">
                    <input type="checkbox" {...register(`blockers.${index}.isKeyIssue` as const)} />
                    Key Issue
                  </label>
                  <button
                    type="button"
                    onClick={() => blockerFields.remove(index)}
                    className="text-red-400 text-sm pb-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-white">Achievements</h2>
              <button
                type="button"
                onClick={() =>
                  achievementFields.append({ description: '', isKeyAchievement: false })
                }
                className="text-blue-400 hover:underline text-sm"
              >
                + Add Achievement
              </button>
            </div>
            <div className="space-y-3">
              {achievementFields.fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">Description</label>
                    <input
                      {...register(`achievements.${index}.description` as const)}
                      className="w-full rounded-lg bg-slate-700 text-white px-3 py-2"
                    />
                  </div>
                  <label className="flex items-center gap-1 text-slate-300 text-sm whitespace-nowrap pb-2">
                    <input
                      type="checkbox"
                      {...register(`achievements.${index}.isKeyAchievement` as const)}
                    />
                    Key Achievement
                  </label>
                  <button
                    type="button"
                    onClick={() => achievementFields.remove(index)}
                    className="text-red-400 text-sm pb-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Notes (optional)</label>
              <textarea {...register('notes')} className="w-full rounded-lg bg-slate-700 text-white px-3 py-2" rows={3} />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Links (optional)</label>
              <textarea {...register('links')} className="w-full rounded-lg bg-slate-700 text-white px-3 py-2" rows={3} />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSubmit(saveChanges)}
              className="bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSubmit(saveAndSubmit)}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Save &amp; Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}