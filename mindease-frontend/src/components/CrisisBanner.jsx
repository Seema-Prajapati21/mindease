import React from 'react';
import { Link } from 'react-router-dom';

const CrisisBanner = () => {
  return (
    <div className="me-crisis-banner d-flex align-items-center justify-content-between flex-wrap gap-2">
      <div className="d-flex align-items-center gap-2">
        <span>🌱</span>
        <span>
          If you are in distress or crisis, you are not alone. Free, confidential support is available 24×7 via{' '}
          <strong>Tele-MANAS</strong> at{' '}
          <a href="tel:14416" className="fw-semibold text-decoration-underline" style={{ color: '#2b3d2a' }}>
            14416
          </a>
        </span>
      </div>
      <div>
        <Link to="/help" className="btn btn-sm py-0 px-2 fw-medium" style={{ backgroundColor: '#d3e2d1', color: '#233322', borderRadius: '6px' }}>
          All Helplines →
        </Link>
      </div>
    </div>
  );
};

export default CrisisBanner;
