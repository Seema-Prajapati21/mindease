import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { authApi } from '../api/authApi';
import { getStoredEntries } from '../data/mockMoodEntries';

const Settings = () => {
  const { user, logout } = useAuth();
  const { aiConsent, showCrisisCard, updateConsent, updateCrisisCardVisibility } = useSettings();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const navigate = useNavigate();

  const handleToggleAi = async (e) => {
    const val = e.target.checked;
    await updateConsent(val);
    triggerToast();
  };

  const handleToggleCrisisCard = async (e) => {
    const val = e.target.checked;
    await updateCrisisCardVisibility(val);
    triggerToast();
  };

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleExportData = () => {
    const entries = getStoredEntries(user?.id);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mindease_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await authApi.deleteAccount();
    } catch (err) {
      console.warn('Deleting local account space.');
    } finally {
      localStorage.clear();
      logout();
      navigate('/');
    }
  };

  return (
    <div className="container py-4 fade-in">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          <div className="mb-4 pb-2 border-bottom">
            <h1 className="serif h2 mb-1" style={{ color: 'var(--me-text)' }}>
              Settings & Privacy
            </h1>
            <p className="text-muted small mb-0">
              Manage your preferences, data sovereign rights, and reflective settings.
            </p>
          </div>

          {saveToast && (
            <div className="alert alert-success py-2 px-3 small rounded-3 mb-3 fade-in">
              Preferences updated gently.
            </div>
          )}

          {/* Profile Card */}
          <div className="me-card p-4 mb-4">
            <h2 className="serif h5 mb-3" style={{ color: 'var(--me-text)' }}>
              Your Presence
            </h2>
            <div className="row g-3">
              <div className="col-sm-6">
                <label className="small text-muted mb-1">Preferred Name</label>
                <div className="fw-semibold">{user?.name || 'Friend'}</div>
              </div>
              <div className="col-sm-6">
                <label className="small text-muted mb-1">Email</label>
                <div className="fw-semibold">{user?.email || 'user@example.com'}</div>
              </div>
              {user?.age && (
                <div className="col-sm-6">
                  <label className="small text-muted mb-1">Age & Age Group</label>
                  <div className="fw-semibold">
                    {user.age} yrs{' '}
                    <span className="badge ms-1" style={{ backgroundColor: 'var(--me-primary-light)', color: '#3b523a', textTransform: 'capitalize' }}>
                      {user.ageGroup ? user.ageGroup.replace('_', ' ') : ''}
                    </span>
                  </div>
                </div>
              )}
              {user?.profession && (
                <div className="col-sm-6">
                  <label className="small text-muted mb-1">Occupation / Profession</label>
                  <div className="fw-semibold">{user.profession}</div>
                </div>
              )}
            </div>
          </div>

          {/* Preferences & Privacy Card */}
          <div className="me-card p-4 mb-4">
            <h2 className="serif h5 mb-3" style={{ color: 'var(--me-text)' }}>
              Privacy & Intelligence Controls
            </h2>

            <div className="d-flex align-items-start justify-content-between gap-3 py-3 border-bottom">
              <div>
                <div className="fw-semibold mb-1">Optional AI Reflection Companion</div>
                <p className="text-muted small mb-0">
                  Allow MindEase to generate personalized reflective questions during check-ins. If turned off, MindEase runs 100% on rule-based heuristics with zero external analysis.
                </p>
              </div>
              <div className="form-check form-switch pt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={aiConsent}
                  onChange={handleToggleAi}
                  style={{ width: '2.5rem', height: '1.3rem' }}
                />
              </div>
            </div>

            <div className="d-flex align-items-start justify-content-between gap-3 py-3">
              <div>
                <div className="fw-semibold mb-1">Show Supportive Resource Card on Low Weeks</div>
                <p className="text-muted small mb-0">
                  Displays the soft green Tele-MANAS support card on your dashboard if your 7-day average falls below 4.
                </p>
              </div>
              <div className="form-check form-switch pt-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={showCrisisCard}
                  onChange={handleToggleCrisisCard}
                  style={{ width: '2.5rem', height: '1.3rem' }}
                />
              </div>
            </div>
          </div>

          {/* Data Sovereignty Card */}
          <div className="me-card p-4 mb-4">
            <h2 className="serif h5 mb-3" style={{ color: 'var(--me-text)' }}>
              Data Ownership
            </h2>
            <p className="text-muted small mb-3">
              Your emotional data belongs solely to you. You can export a full copy of your mood entries at any time.
            </p>
            <button
              type="button"
              className="btn btn-me-subtle d-inline-flex align-items-center gap-2"
              onClick={handleExportData}
            >
              <span>📥</span>
              <span>Export Mood Data (JSON)</span>
            </button>
          </div>

          {/* Delete Account */}
          <div className="me-card p-4 border-danger-subtle" style={{ backgroundColor: '#FCF8F7' }}>
            <h2 className="serif h5 mb-2 text-danger">
              Leave MindEase
            </h2>
            <p className="text-muted small mb-3">
              Deleting your account permanently removes your profile, mood logs, and journal reflections. This action is completely irreversible.
            </p>

            {!deleteConfirmOpen ? (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                Delete Account…
              </button>
            ) : (
              <div className="p-3 bg-white border border-danger-subtle rounded-3 fade-in">
                <p className="small fw-semibold text-danger mb-2">
                  Are you sure? Everything you have written will be wiped.
                </p>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    disabled={deleting}
                    onClick={handleDeleteAccount}
                  >
                    {deleting ? 'Removing data…' : 'Yes, delete my space'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setDeleteConfirmOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
