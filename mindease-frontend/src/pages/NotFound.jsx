import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5 text-center fade-in">
      <div className="py-5">
        <div style={{ fontSize: '3rem' }} className="mb-3">
          🌱
        </div>
        <h1 className="serif display-6 mb-2" style={{ color: 'var(--me-text)' }}>
          A quiet detour.
        </h1>
        <p className="text-muted mb-4" style={{ maxWidth: '420px', margin: '0 auto' }}>
          This page does not seem to exist, but you are always welcome back home.
        </p>
        <Link to="/" className="btn btn-me-primary px-4 py-2">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
