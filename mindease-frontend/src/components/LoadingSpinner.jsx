import React from 'react';

const LoadingSpinner = ({ text = 'Loading gently…' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 fade-in">
      <div
        className="spinner-border mb-3"
        role="status"
        style={{ color: 'var(--me-primary)', width: '2.5rem', height: '2.5rem' }}
      >
        <span className="visually-hidden">Loading…</span>
      </div>
      <p className="text-muted small mb-0">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
