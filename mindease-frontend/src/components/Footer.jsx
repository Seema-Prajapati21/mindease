import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="me-footer py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-2 serif fs-6" style={{ color: 'var(--me-text)' }}>
          MindEase — <em>Data with a heartbeat.</em>
        </p>
        <p className="small mb-3" style={{ maxWidth: '600px', margin: '0 auto', color: '#777' }}>
          MindEase is designed as a calm, reflective companion and is strictly not a substitute for clinical diagnosis, psychotherapy, or professional medical care. If you are experiencing thoughts of self-harm, please connect with a helpline immediately.
        </p>
        <div className="d-flex justify-content-center gap-3 small">
          <Link to="/help" className="text-muted text-decoration-none">
            Indian Helplines (24×7)
          </Link>
          <span>•</span>
          <Link to="/tools" className="text-muted text-decoration-none">
            Coping Tools
          </Link>
          <span>•</span>
          <span className="text-muted">Free & Privacy-First</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
