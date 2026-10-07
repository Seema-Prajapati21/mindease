import React from 'react';
import { Link } from 'react-router-dom';

const SOSFloatingButton = () => {
  return (
    <Link
      to="/help"
      className="me-sos-btn"
      title="Immediate Helpline & Crisis Support"
      aria-label="Immediate Helpline & Crisis Support"
    >
      <span style={{ fontSize: '1.2rem' }}>🌿</span>
      <span className="d-none d-sm-inline">Need Support?</span>
    </Link>
  );
};

export default SOSFloatingButton;
