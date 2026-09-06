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
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Team Members</h1>
          {isManager && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              {showCreateForm ? 'Cancel' : '+ New User'}
            </button>
          )}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {isManager && showCreateForm && (
          <div className="bg-slate-800 rounded-xl p-6 space-y-3">
            <h2 className="text-lg font-semibold text-white">New User</h2>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="First Name"
                value={createForm.firstName}
                onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                className="rounded-lg bg-slate-700 text-white px-3 py-2"
              />
              <input
                placeholder="Last Name"
                value={createForm.lastName}
                onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                className="rounded-lg bg-slate-700 text-white px-3 py-2"
              />
              <input
                placeholder="Email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                className="rounded-lg bg-slate-700 text-white px-3 py-2"
              />
              <input
                type="password"
                placeholder="Password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                className="rounded-lg bg-slate-700 text-white px-3 py-2"
              />
              <input
                type="date"
                value={createForm.dateOfBirth ?? ''}
                onChange={(e) => setCreateForm({ ...createForm, dateOfBirth: e.target.value })}
                className="rounded-lg bg-slate-700 text-white px-3 py-2"
              />
              <input
                placeholder="Mobile"
                value={createForm.mobile ?? ''}
                onChange={(e) => setCreateForm({ ...createForm, mobile: e.target.value })}
                className="rounded-lg bg-slate-700 text-white px-3 py-2"
              />
              <select
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm({ ...createForm, role: e.target.value as 'TeamMember' | 'Manager' })
                }
                className="rounded-lg bg-slate-700 text-white px-3 py-2 col-span-2"
              >
                <option value="TeamMember">Team Member</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <button
              onClick={handleCreate}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
            >
              Create User
            </button>
          </div>
        )}

        <div className="space-y-2">
          {loading && <p className="text-slate-400">Loading...</p>}
          {!loading && users.length === 0 && <p className="text-slate-400">No users found.</p>}

          {users.map((u) =>
            editingId === u.id && editForm ? (
              <div key={u.id} className="bg-slate-800 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="rounded-lg bg-slate-700 text-white px-3 py-2"
                  />
                  <input
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="rounded-lg bg-slate-700 text-white px-3 py-2"
                  />
                  <input
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="rounded-lg bg-slate-700 text-white px-3 py-2"
                  />
                  <input
                    type="date"
                    value={editForm.dateOfBirth ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                    className="rounded-lg bg-slate-700 text-white px-3 py-2"
                  />
                  <input
                    value={editForm.mobile ?? ''}
                    onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    className="rounded-lg bg-slate-700 text-white px-3 py-2"
                  />
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value as 'TeamMember' | 'Manager' })
                    }
                    className="rounded-lg bg-slate-700 text-white px-3 py-2"
                  >
                    <option value="TeamMember">Team Member</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-slate-300 text-sm">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  />
                  Active
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdate}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditForm(null);
                    }}
                    className="bg-slate-600 hover:bg-slate-500 text-white font-semibold px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={u.id}
                className="bg-slate-800 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-medium">
                    {u.firstName} {u.lastName}{' '}
                    {!u.isActive && <span className="text-slate-500 text-xs">(Inactive)</span>}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {u.email} {u.mobile && `· ${u.mobile}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {u.role}
                  </span>
                  {isManager && (
                    <button
                      onClick={() => startEdit(u)}
                      className="text-blue-400 hover:underline text-sm"
                    >
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
