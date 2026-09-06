import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  type UserSummary,
  type CreateUserInput,
  type UpdateUserInput,
} from '../services/userApi';

const emptyCreateForm: CreateUserInput = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'TeamMember',
  dateOfBirth: '',
  mobile: '',
};

export default function UsersManagementPage() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const isManager = currentUser?.role === 'Manager';

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserInput>(emptyCreateForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateUserInput | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    getUsersApi()
      .then(setUsers)
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    setError(null);
    if (!createForm.firstName || !createForm.lastName || !createForm.email || !createForm.password) {
      setError('First name, last name, email, and password are required.');
      return;
    }
    setIsSaving(true);
    try {
      await createUserApi(createForm);
      setShowCreateForm(false);
      setCreateForm(emptyCreateForm);
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to create user.');
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (u: UserSummary) => {
    setEditingId(u.id);
    setEditForm({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role as 'TeamMember' | 'Manager',
      isActive: u.isActive,
      dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split('T')[0] : '',
      mobile: u.mobile ?? '',
    });
  };

  const handleUpdate = async () => {
    if (!editingId || !editForm) return;
    setError(null);
    setIsSaving(true);
    try {
      await updateUserApi(editingId, editForm);
      setEditingId(null);
      setEditForm(null);
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to update user.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="page-title">Team Members</h1>
          {isManager && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn btn-primary"
            >
              {showCreateForm ? 'Cancel' : '+ New User'}
            </button>
          )}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {isManager && showCreateForm && (
          <div className="panel p-6 space-y-3">
            <h2 className="section-title">New user</h2>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="First Name"
                value={createForm.firstName}
                onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                className="input"
              />
              <input
                placeholder="Last Name"
                value={createForm.lastName}
                onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                className="input"
              />
              <input
                placeholder="Email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="input"
              />
              <input
                type="password"
                placeholder="Password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                className="input"
              />
              <input
                type="date"
                value={createForm.dateOfBirth ?? ''}
                onChange={(e) => setCreateForm({ ...createForm, dateOfBirth: e.target.value })}
                className="input"
              />
              <input
                placeholder="Mobile"
                value={createForm.mobile ?? ''}
                onChange={(e) => setCreateForm({ ...createForm, mobile: e.target.value })}
                className="input"
              />
              <select
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm({ ...createForm, role: e.target.value as 'TeamMember' | 'Manager' })
                }
                className="input col-span-2"
              >
                <option value="TeamMember">Team Member</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <button onClick={handleCreate} disabled={isSaving} className="btn btn-success">
              Create user
            </button>
          </div>
        )}

        <div className="space-y-2">
          {loading && <p className="text-ink-muted text-sm">Loading…</p>}
          {!loading && users.length === 0 && <p className="text-ink-muted text-sm">No users found.</p>}

          {users.map((u) =>
            editingId === u.id && editForm ? (
              <div key={u.id} className="panel p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="input"
                  />
                  <input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="input"
                  />
                  <input
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="input"
                  />
                  <input
                    type="date"
                    value={editForm.dateOfBirth ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                    className="input"
                  />
                  <input
                    value={editForm.mobile ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    className="input"
                  />
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value as 'TeamMember' | 'Manager' })
                    }
                    className="input"
                  >
                    <option value="TeamMember">Team Member</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-ink text-sm">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="checkbox"
                  />
                  Active
                </label>
                <div className="flex gap-3">
                  <button onClick={handleUpdate} disabled={isSaving} className="btn btn-primary">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditForm(null);
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div key={u.id} className="panel p-4 flex justify-between items-center">
                <div>
                  <p className="text-ink font-medium text-sm">
                    {u.firstName} {u.lastName}{' '}
                    {!u.isActive && <span className="badge badge-neutral ml-1">Inactive</span>}
                  </p>
                  <p className="text-ink-muted text-sm mt-0.5">
                    {u.email} {u.mobile && `· ${u.mobile}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="badge badge-primary">{u.role}</span>
                  {isManager && (
                    <button onClick={() => startEdit(u)} className="link-action">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
