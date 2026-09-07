import { useState } from 'react';
import { changePasswordApi } from '../services/settingsApi';

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePassword = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setIsSaving(true);
    try {
      await changePasswordApi(currentPassword, newPassword);
      setSuccessMessage('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Failed to change password.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page p-6 md:p-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="page-title">Settings</h1>

        <div className="panel p-6 space-y-4">
          <div>
            <h2 className="section-title">Change password</h2>
            <p className="text-ink-muted text-sm mt-0.5">
              Use a password with at least 6 characters.
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <div className="space-y-3">
            <div>
              <label className="field-label">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="field-label">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="field-label">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
              />
            </div>

            <button
              onClick={handleChangePassword}
              disabled={isSaving}
              className="btn btn-primary"
            >
              {isSaving ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
