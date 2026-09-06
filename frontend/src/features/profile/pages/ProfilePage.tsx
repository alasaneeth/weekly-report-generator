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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-md mx-auto bg-slate-800 rounded-xl p-8 shadow-lg space-y-5">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">First Name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Last Name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Email</label>
          <input
            value={profile?.email ?? ''}
            disabled
            className="w-full rounded-lg bg-slate-900 text-slate-500 px-3 py-2 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Mobile</label>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full rounded-lg bg-slate-700 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Role</label>
          <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {profile?.role}
          </span>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
