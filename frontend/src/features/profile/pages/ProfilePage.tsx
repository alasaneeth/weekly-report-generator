import { useEffect, useState } from 'react';
import { getMyProfileApi, updateProfileApi, type Profile } from '../services/profileApi';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    getMyProfileApi()
      .then((data) => {
        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setDateOfBirth(data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '');
        setMobile(data.mobile ?? '');
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError(null);
    setSuccessMessage(null);
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      const updated = await updateProfileApi({
        firstName,
        lastName,
        dateOfBirth: dateOfBirth || null,
        mobile: mobile || null,
      });
      setProfile(updated);
      setSuccessMessage('Profile updated successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to update profile.');
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

  return (
    <div className="page p-4 sm:p-6 md:p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="page-title">My Profile</h1>

        <div className="panel p-6 space-y-4">
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">First name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="field-label">Last name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Email</label>
            <input value={profile?.email ?? ''} disabled className="input" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="field-label">Date of birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="field-label">Mobile</label>
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Role</label>
            <span className="badge badge-primary">{profile?.role}</span>
          </div>

          <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
