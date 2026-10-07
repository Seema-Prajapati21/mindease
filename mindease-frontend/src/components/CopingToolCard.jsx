import React, { useState } from 'react';
import BreathingCircle from './BreathingCircle';

const CopingToolCard = ({ tool }) => {
  const { id, title, emoji, description, howItHelps, isInteractive } = tool;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="me-card p-4 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span style={{ fontSize: '1.8rem' }}>{emoji}</span>
          {isInteractive && (
            <span
              className="badge"
              style={{ backgroundColor: 'var(--me-primary-light)', color: '#3b523a' }}
            >
              Interactive
            </span>
          )}
        </div>
        <h4 className="serif h5 mb-2" style={{ color: 'var(--me-text)' }}>
          {title}
        </h4>
        <p className="fw-medium small mb-2" style={{ color: '#4d4d4d' }}>
          {description}
        </p>
        <p className="text-muted small mb-3" style={{ lineHeight: 1.5 }}>
          {howItHelps}
        </p>
      </div>

      <div>
        {isInteractive && id === 'breathing' && (
          <div className="mt-2">
            {!isOpen ? (
              <button
                type="button"
                className="btn btn-sm btn-me-primary w-100"
                onClick={() => setIsOpen(true)}
              >
                Open Breathing Session
              </button>
            ) : (
              <div className="pt-2 border-top">
                <BreathingCircle />
                <button
                  type="button"
                  className="btn btn-sm btn-link text-muted w-100 text-decoration-none mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  Close Session ▲
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CopingToolCard;
