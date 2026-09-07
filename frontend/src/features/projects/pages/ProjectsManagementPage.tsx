import { useEffect, useState } from 'react';
import {
  getProjectsApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
  type Project,
  type SaveProjectInput,
} from '../services/projectApi';

const emptyForm: SaveProjectInput = { name: '', description: '', isActive: true };

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<SaveProjectInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadProjects = () => {
    setLoading(true);
    getProjectsApi()
      .then(setProjects)
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      name: project.name,
      description: project.description,
      isActive: project.isActive,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Project name is required.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updateProjectApi(editingId, form);
      } else {
        await createProjectApi(form);
      }
      cancelEdit();
      loadProjects();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to save project.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? Existing reports linked to it will keep their history.')) {
      return;
    }
    try {
      await deleteProjectApi(id);
      loadProjects();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to delete project.');
    }
  };

  return (
    <div className="page p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="page-title">Projects &amp; Categories</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="panel p-6 space-y-3">
          <h2 className="section-title">{editingId ? 'Edit project' : 'New project'}</h2>

          <div>
            <label className="field-label">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="field-label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="input"
            />
          </div>

          <label className="flex items-center gap-2 text-ink text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="checkbox"
            />
            Active
          </label>

          <div className="flex gap-3 pt-1">
            <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
              {editingId ? 'Save changes' : 'Create project'}
            </button>
            {editingId && (
              <button onClick={cancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {loading && <p className="text-ink-muted text-sm">Loading…</p>}
          {!loading && projects.length === 0 && (
            <p className="text-ink-muted text-sm">No projects yet.</p>
          )}
          {projects.map((p) => (
            <div key={p.id} className="panel p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <p className="text-ink font-medium text-sm">
                  {p.name}{' '}
                  {!p.isActive && <span className="badge badge-neutral ml-1">Inactive</span>}
                </p>
                {p.description && (
                  <p className="text-ink-muted text-sm mt-0.5">{p.description}</p>
                )}
              </div>
              <div className="flex gap-4">
                <button onClick={() => startEdit(p)} className="link-action">
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="link-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
