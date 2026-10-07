import React from 'react';
import { Link } from 'react-router-dom';
import CrisisBanner from '../components/CrisisBanner';

const Landing = () => {
  return (
    <div className="fade-in">
      <CrisisBanner />

      {/* Hero Section */}
      <section className="py-5 py-md-6 text-center container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <span
              className="badge px-3 py-2 rounded-pill mb-3"
              style={{
                backgroundColor: 'var(--me-primary-light)',
                color: '#344e33',
                fontSize: '0.85rem',
                letterSpacing: '0.5px',
              }}
            >
              TAGLINE: "Data with a heartbeat."
            </span>

            <h1 className="serif display-4 fw-medium mb-3" style={{ color: 'var(--me-text)', lineHeight: 1.2 }}>
              A calm place to understand your moods.
            </h1>

            <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: '640px', lineHeight: 1.6 }}>
              A warm companion that listens before it charts. MindEase helps you connect body sensations with emotional clarity — privately, gently, and on your own terms.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              <Link to="/auth" className="btn btn-me-primary btn-lg px-4 py-3 shadow-sm">
                Begin your journey →
              </Link>
              <Link to="/help" className="btn btn-me-outline btn-lg px-4 py-3">
                Indian Helplines & Care
              </Link>
            </div>

            {/* Soft minimal organic illustration */}
            <div className="py-3 d-flex justify-content-center">
              <svg width="280" height="120" viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="80" cy="60" r="45" fill="#8FA68E" fillOpacity="0.15" />
                <circle cx="140" cy="50" r="55" fill="#F4C95D" fillOpacity="0.15" />
                <circle cx="200" cy="65" r="45" fill="#D9A5A0" fillOpacity="0.2" />
                <path
                  d="M 30 75 Q 85 20, 140 70 T 250 65"
                  stroke="#8FA68E"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="140" cy="70" r="5" fill="#8FA68E" />
                <circle cx="200" cy="40" r="4" fill="#D9A5A0" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-5 bg-white border-top border-bottom" style={{ borderColor: 'var(--me-border)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="serif h3 mb-2" style={{ color: 'var(--me-text)' }}>
              Designed around gentle agency
            </h2>
            <p className="text-muted small">No clinical pressure. No gamified streaks to stress over.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="me-card p-4 h-100">
                <div style={{ fontSize: '2.2rem' }} className="mb-3">
                  🌱
                </div>
                <h3 className="serif h5 mb-2">1. Body-First Check-In</h3>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                  Start with physical sensation — heavy, restless, light, tense, or numb. Dynamic branching questions gently unpack what lies beneath.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="me-card p-4 h-100">
                <div style={{ fontSize: '2.2rem' }} className="mb-3">
                  🌊
                </div>
                <h3 className="serif h5 mb-2">2. Track Your Journey</h3>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                  See your narrative unfold over 30 days. Explore soft sparklines, calendar emotional heatmaps, and downloadable wellness summaries.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="me-card p-4 h-100">
                <div style={{ fontSize: '2.2rem' }} className="mb-3">
                  🕊️
                </div>
                <h3 className="serif h5 mb-2">3. Indian Care Pathways</h3>
                <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                  Direct access to real helplines (Tele-MANAS 14416, Vandrevala Foundation, iCall) and guidance on finding licensed therapists across India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="py-5 container text-center">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h3 className="serif h4 mb-3" style={{ color: 'var(--me-text)' }}>
              "You always have the final say."
            </h3>
            <p className="text-muted" style={{ lineHeight: 1.7 }}>
              MindEase analyzes tone and physical signals locally to suggest an emotion — but you hold the sovereign truth. Confirm the suggestion or choose what matches your lived experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
