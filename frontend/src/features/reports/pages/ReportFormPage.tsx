import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  createReportApi,
  submitReportApi,
  type SaveReportInput,
} from '../services/reportApi';
import { getProjectsApi, type Project } from '../../projects/services/projectApi';

export default function ReportFormPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SaveReportInput>({
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

  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    getProjectsApi().then(setProjects).catch(() => setProjects([]));
  }, []);

  const onInvalid = () => {
    setApiError('Please fix the highlighted fields below before continuing.');
  };

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
    <div className="page p-6 md:p-8">
      <div className="max-w-4xl mx-auto panel p-8 space-y-8">
        <h1 className="page-title">New Weekly Report</h1>

        {apiError && <div className="alert alert-danger">{apiError}</div>}

        <form className="space-y-8">
          {/* Project */}
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

          {/* Week range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Week start</label>
              <input
                type="date"
                {...register('weekStartDate', { required: 'Week start date is required.' })}
                className="input"
              />
              {errors.weekStartDate && (
                <p className="text-danger text-xs mt-1">{errors.weekStartDate.message}</p>
              )}
            </div>
            <div>
              <label className="field-label">Week end</label>
              <input
                type="date"
                {...register('weekEndDate', { required: 'Week end date is required.' })}
                className="input"
              />
              {errors.weekEndDate && (
                <p className="text-danger text-xs mt-1">{errors.weekEndDate.message}</p>
              )}
            </div>
          </div>

          {/* Tasks */}
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
                      {...register(`tasks.${index}.taskName` as const, {
                        required: 'Task name is required.',
                      })}
                      className="input"
                    />
                    {errors.tasks?.[index]?.taskName && (
                      <p className="text-danger text-xs mt-1">
                        {errors.tasks[index]?.taskName?.message}
                      </p>
                    )}
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
                        {...register(`tasks.${index}.plannedPercentage` as const, {
                          valueAsNumber: true,
                        })}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="field-label">Actual %</label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.actualPercentage` as const, {
                          valueAsNumber: true,
                        })}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="field-label">Time planned (hrs)</label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.timePlannedHours` as const, {
                          valueAsNumber: true,
                        })}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="field-label">Time spent (hrs)</label>
                      <input
                        type="number"
                        {...register(`tasks.${index}.timeSpentHours` as const, {
                          valueAsNumber: true,
                        })}
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

          {/* Next week tasks */}
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

          {/* Blockers */}
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

          {/* Achievements */}
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

          {/* Notes / Links */}
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

          {/* Actions */}
          <div className="flex gap-3 border-t border-border pt-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit(saveDraft, onInvalid)}
              className="btn btn-secondary"
            >
              Save draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit(saveAndSubmit, onInvalid)}
              className="btn btn-primary"
            >
              Submit report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}