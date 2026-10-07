import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { moodApi } from '../api/moodApi';
import { journeyApi } from '../api/journeyApi';
import { getStoredEntries } from '../data/mockMoodEntries';
import { calculateStats } from '../utils/statsHelpers';
import StatTile from '../components/StatTile';
import MoodLineChart from '../components/MoodLineChart';
import CalendarGrid from '../components/CalendarGrid';
import EmotionBreakdown from '../components/EmotionBreakdown';
import LoadingSpinner from '../components/LoadingSpinner';

const MyJourney = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchJourneyData = async () => {
      try {
        const remoteStats = await moodApi.getStats(30);
        setStats(remoteStats);
      } catch (err) {
        const entries = getStoredEntries(user?.id);
        const calculated = calculateStats(entries);
        setStats(calculated);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneyData();
  }, [user]);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    setToastMessage('');
    try {
      const from = stats?.range?.from || '2026-09-01';
      const to = stats?.range?.to || '2026-10-05';
      const blob = await journeyApi.downloadPdfSummary(from, to);

      // Trigger browser download
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `MindEase_Wellness_Summary_${to}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setToastMessage('PDF generator is active when the Spring Boot backend is connected. You can view your full analytics and charts right here in the app.');
      setTimeout(() => setToastMessage(''), 6000);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="container py-5">
        <LoadingSpinner text="Tracing your journey…" />
      </div>
    );
  }

  return (
    <div className="container py-4 fade-in">
      {/* Header with PDF Download CTA */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
        <div>
          <h1 className="serif h2 mb-1" style={{ color: 'var(--me-text)' }}>
            My Journey
          </h1>
          <p className="text-muted small mb-0">
            A 30-day gentle look at the landscape of your emotions.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-me-outline d-inline-flex align-items-center gap-2"
          onClick={handleDownloadPdf}
          disabled={downloadingPdf}
        >
          <span>📄</span>
          <span>{downloadingPdf ? 'Preparing PDF…' : 'Download Wellness Summary (PDF)'}</span>
        </button>
      </div>

      {toastMessage && (
        <div
          className="alert alert-dismissible p-3 mb-4 rounded-3 small fade-in"
          style={{ backgroundColor: '#FAF6EE', border: '1px solid #E8E2D8', color: '#555' }}
        >
          {toastMessage}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setToastMessage('')}
          />
        </div>
      )}

      {/* 1. Row of 4 StatTile components */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <StatTile
            label="Current Streak"
            value={`${stats.streak || 0} days`}
            subtext="Consistent check-ins"
            icon="🌱"
            color="var(--me-primary)"
          />
        </div>

        <div className="col-6 col-md-3">
          <StatTile
            label="7-Day Avg"
            value={`${stats.avg7 || 0} / 10`}
            subtext="Recent balance"
            icon="🌊"
            color="#5C785B"
          />
        </div>

        <div className="col-6 col-md-3">
          <StatTile
            label="30-Day Avg"
            value={`${stats.avg30 || 0} / 10`}
            subtext="Monthly baseline"
            icon="🌾"
            color="#7B8DB0"
          />
        </div>

        <div className="col-6 col-md-3">
          <StatTile
            label="Best Score"
            value={`${stats.bestScore || 0} / 10`}
            subtext="Peak lightness"
            icon="✨"
            color="#D9A5A0"
          />
        </div>
      </div>

      {/* 2. MoodLineChart (30-day interactive chart) */}
      <div className="me-card p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="serif h5 mb-0" style={{ color: 'var(--me-text)' }}>
            30-Day Emotion & Intensity Trajectory
          </h2>
          <span className="small text-muted">Hover over points to see details</span>
        </div>
        <MoodLineChart data={stats.dailyScores || []} />
      </div>

      <div className="row g-4">
        {/* 3. CalendarGrid */}
        <div className="col-12 col-lg-6">
          <div className="me-card p-4 h-100">
            <h2 className="serif h5 mb-2" style={{ color: 'var(--me-text)' }}>
              Calendar Mosaic
            </h2>
            <p className="text-muted small mb-3">
              Each colored square represents the primary emotion logged on that day.
            </p>
            <CalendarGrid dailyScores={stats.dailyScores || []} />
          </div>
        </div>

        {/* 4. EmotionBreakdown */}
        <div className="col-12 col-lg-6">
          <div className="me-card p-4 h-100">
            <h2 className="serif h5 mb-2" style={{ color: 'var(--me-text)' }}>
              Emotion Distribution
            </h2>
            <p className="text-muted small mb-3">
              The frequency of each emotion across your recorded entries.
            </p>
            <EmotionBreakdown emotionCounts={stats.emotionCounts || {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJourney;
