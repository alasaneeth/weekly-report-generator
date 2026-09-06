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
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Projects / Categories</h1>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="bg-slate-800 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-white">
            {editingId ? 'Edit Project' : 'New Project'}
          </h2>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg bg-slate-700 text-white px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full rounded-lg bg-slate-700 text-white px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2 text-slate-300 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              {editingId ? 'Save Changes' : 'Create Project'}
            </button>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="bg-slate-600 hover:bg-slate-500 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {loading && <p className="text-slate-400">Loading...</p>}
          {!loading && projects.length === 0 && (
            <p className="text-slate-400">No projects yet.</p>
          )}
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-slate-800 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-medium">
                  {p.name}{' '}
                  {!p.isActive && (
                    <span className="text-slate-500 text-xs">(Inactive)</span>
                  )}
                </p>
                {p.description && (
                  <p className="text-slate-400 text-sm">{p.description}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(p)}
                  className="text-blue-400 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-400 hover:underline text-sm"
                >
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
