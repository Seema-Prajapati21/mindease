import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { moodApi } from '../api/moodApi';
import { getStoredEntries } from '../data/mockMoodEntries';
import { calculateStats } from '../utils/statsHelpers';
import { getGreeting } from '../utils/dateHelpers';
import { getEmotionById } from '../constants/emotions';
import StatTile from '../components/StatTile';
import MiniSparkline from '../components/MiniSparkline';
import MoodInsight from '../components/MoodInsight';
import AffirmationCard from '../components/AffirmationCard';
import CrisisCard from '../components/CrisisCard';
import SOSFloatingButton from '../components/SOSFloatingButton';
import LoadingSpinner from '../components/LoadingSpinner';

const moodColors = {
  Happy: '#f59e0b',
  Calm: '#3b82f6',
  Anxious: '#f97316',
  Overwhelmed: '#8b5cf6',
  Sad: '#64748b',
  Exhausted: '#6b7280',
  Angry: '#ef4444',
  Neutral: '#94a3b8',
};

const Dashboard = () => {
  const { user } = useAuth();
  const { showCrisisCard } = useSettings();
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // References for Chart.js instances to ensure safe lifecycle (destroy old ones)
  const trendChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const trendCanvasRef = useRef(null);
  const doughnutCanvasRef = useRef(null);

  // Load user data & history
  const loadDashboardData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      const email = storedUser?.email || user?.email;

      // 1. Fetch live history
      let remoteLogs = [];
      if (email) {
        try {
          remoteLogs = await moodApi.getHistory(email);
        } catch (err) {
          console.warn('Could not fetch history from backend, falling back.');
        }
      }

      setLogs(remoteLogs || []);

      // 2. Fetch stats
      try {
        const remoteStats = await moodApi.getStats(30);
        setStats(remoteStats);
      } catch (err) {
        const entries = getStoredEntries(user?.id);
        const calculated = calculateStats(entries);
        setStats(calculated);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

 
  // Demo seeder caller
  const seedDemoData = async () => {
    let email = user?.email;

    try {
      const stored = JSON.parse(localStorage.getItem('currentUser') || 'null');
      if (stored?.email) email = stored.email;
    } catch (e) {}

    if (!email) {
      console.error('No user email found.');
      return;
    }

    setSeeding(true);

    try {
      await moodApi.seedDemoHistory(email);
      await loadDashboardData();
    } catch (err) {
      console.error('Error seeding demo data:', err);
    } finally {
      setSeeding(false);
    }
  };

  // Helper metric calculations
  const calculateStreak = (entries) => {
    if (!entries || entries.length === 0) return 0;
    const dateSet = new Set(entries.map((l) => l.loggedDate));
    let streak = 0;
    let curr = new Date();
    const toYMD = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    let checkStr = toYMD(curr);
    if (!dateSet.has(checkStr)) {
      curr.setDate(curr.getDate() - 1);
      checkStr = toYMD(curr);
      if (!dateSet.has(checkStr)) return 0;
    }
    while (dateSet.has(checkStr)) {
      streak++;
      curr.setDate(curr.getDate() - 1);
      checkStr = toYMD(curr);
    }
    return streak;
  };

  const calculateDominantMood = (entries) => {
    if (!entries || entries.length === 0) return 'None';
    const counts = {};
    entries.forEach((l) => {
      const m = l.confirmedMood || 'Neutral';
      counts[m] = (counts[m] || 0) + 1;
    });
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || 'None';
  };

  const streak = stats?.streak ?? calculateStreak(logs);
  const dominantMood = calculateDominantMood(logs);
  const avgIntensity =
    logs && logs.length > 0
      ? (logs.reduce((acc, l) => acc + (l.intensity || 5), 0) / logs.length).toFixed(1)
      : '0.0';

  // Render / Update Chart.js visualizations with safe lifecycle destroy()
  useEffect(() => {
    // If Chart is available in window
    const Chart = window.Chart;
    if (!Chart) return;

    // Destroy existing instances to prevent "Canvas already in use" errors
    if (trendChartRef.current) {
      trendChartRef.current.destroy();
      trendChartRef.current = null;
    }
    if (doughnutChartRef.current) {
      doughnutChartRef.current.destroy();
      doughnutChartRef.current = null;
    }

    if (!logs || logs.length === 0) return;

    // 1. 7-Day Trend Chart
    const sortedLogs = [...logs].sort((a, b) => (a.loggedDate || '').localeCompare(b.loggedDate || ''));
    const recent7 = sortedLogs.slice(-7);
    const chartData = recent7.map((log) => ({
      x: log.loggedDate || 'Today',
      y: log.intensity || 5,
      mood: log.confirmedMood || 'Neutral',
    }));

    if (trendCanvasRef.current) {
      const ctx = trendCanvasRef.current.getContext('2d');
      trendChartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.map((d) => d.x),
          datasets: [
            {
              label: 'Intensity (1-10)',
              data: chartData,
              borderColor: '#8FA68E',
              backgroundColor: 'rgba(143, 166, 142, 0.1)',
              borderWidth: 2.5,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointBackgroundColor: chartData.map((d) => moodColors[d.mood] || '#8FA68E'),
              parsing: { xAxisKey: 'x', yAxisKey: 'y' },
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { min: 1, max: 10, ticks: { stepSize: 1 } },
            x: { type: 'category' },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.raw.mood} • Intensity: ${ctx.raw.y}/10`,
              },
            },
          },
        },
      });
    }

    // 2. Doughnut Chart
    const counts = {};
    logs.forEach((l) => {
      const m = l.confirmedMood || 'Neutral';
      counts[m] = (counts[m] || 0) + 1;
    });

    if (doughnutCanvasRef.current) {
      const ctx = doughnutCanvasRef.current.getContext('2d');
      doughnutChartRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(counts),
          datasets: [
            {
              data: Object.values(counts),
              backgroundColor: Object.keys(counts).map((m) => moodColors[m] || '#94a3b8'),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      });
    }

    return () => {
      if (trendChartRef.current) {
        trendChartRef.current.destroy();
        trendChartRef.current = null;
      }
      if (doughnutChartRef.current) {
        doughnutChartRef.current.destroy();
        doughnutChartRef.current = null;
      }
    };
  }, [logs]);

  if (loading || !stats) {
    return (
      <div className="container py-5">
        <LoadingSpinner text="Gathering your space…" />
      </div>
    );
  }

  const greeting = getGreeting(user?.name ? user.name.split(' ')[0] : 'friend');
  const todayEmotionInfo = stats.todayEmotion ? getEmotionById(stats.todayEmotion) : null;
  const topCorrelation = stats.correlations && stats.correlations.length > 0 ? stats.correlations[0] : null;
  const shouldShowCrisisCard = stats.avg7 < 4 && showCrisisCard;

  return (
    <div className="container py-4 fade-in">
      {/* 1. Greeting & Check-In Action Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 pb-2 border-bottom">
        <div>
          <h1 className="serif h2 mb-1" style={{ color: 'var(--me-text)' }}>
            {greeting}
          </h1>
          <p className="text-muted small mb-0">
            {stats.todayEmotion
              ? "You've checked in today. Here is how your rhythm looks."
              : 'How is your body and mind feeling right now?'}
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          {/* Demo Seeder Button */}
          <button
            type="button"
            className="btn btn-me-subtle d-inline-flex align-items-center gap-2 shadow-sm"
            onClick={seedDemoData}
            disabled={seeding}
          >
            <span>⚡ {seeding ? 'Populating…' : 'Populate 7-Day Demo History'}</span>
          </button>

          <Link to="/log" className="btn btn-me-primary d-inline-flex align-items-center gap-2 shadow-sm">
            <span>{stats.todayEmotion ? 'Update Today’s Check-In' : 'Begin Daily Check-In'}</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* 2. Mood Insight narrative */}
      <MoodInsight stats={stats} />

      {/* 3. Row of Metric Cards with explicit IDs */}
      <div className="row g-3 my-2">
        <div className="col-12 col-md-4">
          <div className="me-card p-4 h-100">
            <span className="small text-muted text-uppercase tracking-wider">Streak</span>
            <div id="metric-streak" className="serif h3 mb-0 mt-1" style={{ color: '#5C785B' }}>
              {streak > 0 ? `${streak} Days 🔥` : '0 Days'}
            </div>
            <span className="small text-muted">Gentle daily presence</span>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="me-card p-4 h-100">
            <span className="small text-muted text-uppercase tracking-wider">Dominant Mood</span>
            <div id="metric-dominant" className="serif h3 mb-0 mt-1" style={{ color: 'var(--me-primary)' }}>
              {dominantMood}
            </div>
            <span className="small text-muted">Primary emotional rhythm</span>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="me-card p-4 h-100">
            <span className="small text-muted text-uppercase tracking-wider">Average Intensity</span>
            <div id="metric-avg" className="serif h3 mb-0 mt-1" style={{ color: '#E0A96D' }}>
              {avgIntensity} / 10
            </div>
            <span className="small text-muted">Calibrated depth</span>
          </div>
        </div>
      </div>

      {/* 4. Chart.js Visualizations (Trend & Doughnut) */}
      <div id="charts-container" className={logs.length === 0 ? 'hidden' : 'my-4'}>
        <div className="row g-3">
          <div className="col-12 col-lg-8">
            <div className="me-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="serif h5 mb-0" style={{ color: 'var(--me-text)' }}>
                  7-Day Intensity Trend
                </h3>
                <span className="badge" style={{ backgroundColor: 'var(--me-primary-light)', color: '#2b3d2a' }}>
                  Chart.js
                </span>
              </div>
              <div style={{ height: '260px', position: 'relative' }}>
                <canvas id="trendChart" ref={trendCanvasRef} />
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="me-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="serif h5 mb-0" style={{ color: 'var(--me-text)' }}>
                  Mood Distribution
                </h3>
                <span className="badge" style={{ backgroundColor: 'var(--me-primary-light)', color: '#2b3d2a' }}>
                  Breakdown
                </span>
              </div>
              <div style={{ height: '260px', position: 'relative' }}>
                <canvas id="doughnutChart" ref={doughnutCanvasRef} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State Card */}
      <div id="empty-state-card" className={logs.length > 0 ? 'hidden' : 'me-card p-5 text-center my-4'}>
        <span style={{ fontSize: '3rem' }}>🍃</span>
        <h3 className="serif h4 mt-3 mb-2">No check-in entries yet</h3>
        <p className="text-muted small mb-4" style={{ maxWidth: '440px', margin: '0 auto' }}>
          Begin your first 3-question check-in or click populate demo history to preview your charts!
        </p>
        <button type="button" className="btn btn-me-primary px-4 py-2" onClick={seedDemoData}>
          ⚡ Populate 7-Day Demo History
        </button>
      </div>

      {/* 5. History Timeline Cards */}
      <div className="my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="serif h5 mb-0" style={{ color: 'var(--me-text)' }}>
            Recent History Timeline
          </h3>
          <span className="small text-muted">{logs.length} check-in entries</span>
        </div>

        <div id="history-timeline">
          {logs.slice(0, 7).map((log, idx) => (
            <div key={log.id || idx} className="history-card fade-in">
              <div className="card-header">
                <span className="date-badge">{log.loggedDate || 'Today'}</span>
                <span className="mood-badge">
                  {log.confirmedMood || 'Logged'} • {log.intensity || 5}/10
                </span>
              </div>
              <p className="ai-summary">{log.aiSummary || 'Check-in completed.'}</p>
              {log.journalNote && <p className="journal-quote">"{log.journalNote}"</p>}
            </div>
          ))}
        </div>
      </div>

      {/* 6. MiniSparkline & Context Correlation */}
      <div className="me-card p-4 my-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="serif h6 mb-0" style={{ color: 'var(--me-text)' }}>
            Recent 14-Day Sparkline Rhythm
          </span>
          <Link to="/journey" className="small text-muted text-decoration-none">
            Full Journey →
          </Link>
        </div>

        <MiniSparkline data={stats.dailyScores || []} />

        {topCorrelation && (
          <div className="mt-3 pt-3 border-top small text-muted d-flex align-items-center gap-2">
            <span>💡</span>
            <span>
              On days with <strong>{topCorrelation.tag.replace('_', ' ')}</strong>, your mood average was{' '}
              <strong style={{ color: topCorrelation.deltaPct >= 0 ? '#4F772D' : '#9E4A3F' }}>
                {Math.abs(topCorrelation.deltaPct)}% {topCorrelation.deltaPct >= 0 ? 'higher' : 'lower'}
              </strong>{' '}
              than days without.
            </span>
          </div>
        )}
      </div>

      {/* 7. AffirmationCard */}
      <AffirmationCard />

      {/* 8. CrisisCard (conditional: avg7 < 4 AND user.settings.showCrisisCard) */}
      {shouldShowCrisisCard && <CrisisCard />}

      {/* Quick Coping Tools prompt */}
      <div className="me-card-soft p-3 my-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <span>🌬️</span>
          <span className="small text-muted">
            Need a moment of calm? Try the interactive 4-7-8 breathing circle.
          </span>
        </div>
        <Link to="/tools" className="btn btn-sm btn-outline-secondary">
          Explore Tools →
        </Link>
      </div>

      {/* Always visible SOS floating button */}
      <SOSFloatingButton />
    </div>
  );
};

export default Dashboard;
