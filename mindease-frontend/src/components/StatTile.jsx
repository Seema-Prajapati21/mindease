import React from 'react';

const StatTile = ({ label, value, subtext, icon, color }) => {
  return (
    <div className="me-card p-3 p-md-4 h-100 d-flex flex-column justify-content-between">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="text-muted small fw-medium text-uppercase tracking-wider">{label}</span>
        {icon && <span style={{ fontSize: '1.4rem' }}>{icon}</span>}
      </div>
      <div>
        <div
          className="serif h3 mb-1 fw-medium"
          style={{ color: color || 'var(--me-text)' }}
        >
          {value !== null && value !== undefined ? value : '—'}
        </div>
        {subtext && <div className="text-muted small">{subtext}</div>}
      </div>
    </div>
  );
};

export default StatTile;
