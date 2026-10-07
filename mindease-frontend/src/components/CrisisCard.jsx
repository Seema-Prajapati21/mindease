import React from 'react';
import { Link } from 'react-router-dom';

const CrisisCard = () => {
  return (
    <div className="me-crisis-card p-4 my-4 fade-in">
      <div className="d-flex align-items-start gap-3">
        <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>🍃</span>
        <div className="flex-grow-1">
          <h3 className="serif h4 mb-2" style={{ color: '#263b25' }}>
            You don't have to carry this alone.
          </h3>
          <p className="mb-3" style={{ color: '#3d523c', maxWidth: '640px', lineHeight: 1.6 }}>
            When days feel heavy, gentle support can create a breathing room. Tele-MANAS is free, confidential, and available right now across India in English, Hindi, and regional languages.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <a
              href="tel:14416"
              className="btn fw-medium px-3 py-2 shadow-sm"
              style={{ backgroundColor: '#5c785b', color: '#ffffff', borderRadius: '8px' }}
            >
              Talk to someone — Tele-MANAS 14416
            </a>
            <Link
              to="/help"
              className="btn fw-medium px-3 py-2"
              style={{ backgroundColor: '#ffffff', color: '#3b523a', border: '1px solid #b5ccb3', borderRadius: '8px' }}
            >
              See all helplines →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisCard;
