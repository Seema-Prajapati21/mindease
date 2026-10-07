import React from 'react';
import { EMOTIONS } from '../constants/emotions';

const EmotionBreakdown = ({ emotionCounts = {} }) => {
  const total = Object.values(emotionCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="py-2">
      <div className="d-flex flex-column gap-3">
        {EMOTIONS.map((emo) => {
          const count = emotionCounts[emo.id] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={emo.id} className="d-flex align-items-center gap-3">
              <div style={{ width: '110px' }} className="d-flex align-items-center gap-2">
                <span>{emo.emoji}</span>
                <span className="small fw-medium">{emo.label}</span>
              </div>
              <div className="flex-grow-1">
                <div
                  className="progress"
                  style={{ height: '10px', backgroundColor: '#EDE7DD', borderRadius: '5px' }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: emo.color,
                      borderRadius: '5px',
                      transition: 'width 0.6s ease',
                    }}
                    aria-valuenow={percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>
              <div style={{ width: '50px' }} className="text-end text-muted small">
                {count} <span style={{ fontSize: '0.75rem' }}>({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionBreakdown;
