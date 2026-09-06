import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  createReportApi,
  submitReportApi,
  type SaveReportInput,
} from '../services/reportApi';

export default function ReportFormPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit } = useForm<SaveReportInput>({
    defaultValues: {
      weekStartDate: '',
      weekEndDate: '',
      notes: '',
      links: '',
      tasks: [
        {
          taskName: '',
          priority: 'Medium',
          plannedPercentage: 0,
          actualPercentage: 0,
          status: 'NotStarted',
          timePlannedHours: 0,
          timeSpentHours: 0,
          deliverable: '',
        },
      ],
      nextWeekTasks: [{ taskName: '', description: '' }],
      blockers: [],
      achievements: [],
      hoursByTaskTypes: [],
    },
  });

  const taskFields = useFieldArray({ control, name: 'tasks' });
  const nextWeekFields = useFieldArray({ control, name: 'nextWeekTasks' });
  const blockerFields = useFieldArray({ control, name: 'blockers' });
  const achievementFields = useFieldArray({ control, name: 'achievements' });

  const saveDraft = async (data: SaveReportInput) => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      await createReportApi(data);
      navigate('/reports/history');
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? 'Failed to save draft.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveAndSubmit = async (data: SaveReportInput) => {
    setApiError(null);
    setIsSubmitting(true);
    try {
      const draft = await createReportApi(data);
      await submitReportApi(draft.id);
      navigate('/reports/history');
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl p-8 shadow-lg space-y-8">
        <h1 className="text-2xl font-bold text-white">New Weekly Report</h1>

        {apiError && <p className="text-red-400 text-sm">{apiError}</p>}

        <form className="space-y-8">
          {/* Week range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Week Start</label>
              <input
                type="date"
                {...register('weekStartDate', { required: true })}
                className="w-full rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Week End</label>
              <input
                type="date"
                {...register('weekEndDate', { required: true })}
                className="w-full rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tasks */}
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
                      className="w-full rounded-lg bg-slate-600 text-white px-3 py-2 outline-none"
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
                        {...register(`tasks.${index}.plannedPercentage` as const, {
                          valueAsNumber: true,
                        })}
                        className="w-full rounded-lg bg-slate-600 text-white px-2 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Actual %</label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.actualPercentage` as const, {
                          valueAsNumber: true,
                        })}
                        className="w-full rounded-lg bg-slate-600 text-white px-2 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Time Planned (hrs)
                      </label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.timePlannedHours` as const, {
                          valueAsNumber: true,
                        })}
                        className="w-full rounded-lg bg-slate-600 text-white px-2 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Time Spent (hrs)
                      </label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.timeSpentHours` as const, {
                          valueAsNumber: true,
                        })}
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

          {/* Next week tasks */}
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
                      <label className="block text-xs text-slate-400 mb-1">
                        Description (optional)
                      </label>
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

          {/* Blockers */}
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

          {/* Achievements */}
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

          {/* Notes / Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Notes (optional)</label>
              <textarea
                {...register('notes')}
                className="w-full rounded-lg bg-slate-700 text-white px-3 py-2"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Links (optional)</label>
              <textarea
                {...register('links')}
                className="w-full rounded-lg bg-slate-700 text-white px-3 py-2"
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit(saveDraft)}
              className="bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Save Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit(saveAndSubmit)}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}