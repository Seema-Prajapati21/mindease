import React from 'react';
import { EMOTIONS, getEmotionById } from '../constants/emotions';

const EmotionGrid = ({ selectedEmotion, suggestedEmotion, onSelectEmotion }) => {
  const suggestedLabel = suggestedEmotion ? getEmotionById(suggestedEmotion).label : null;

  return (
    <div className="my-3">
      <div className="row g-3">
        {EMOTIONS.map((emo) => {
          const isSelected = selectedEmotion === emo.id;
          const isSuggested = suggestedEmotion === emo.id;

          return (
            <div key={emo.id} className="col-4 col-md-4">
              <button
                type="button"
                className={`w-100 emotion-tile ${isSelected ? 'selected' : ''} ${
                  isSuggested && !isSelected ? 'suggested' : ''
                }`}
                onClick={() => onSelectEmotion(emo.id)}
                style={{
                  backgroundColor: isSelected ? 'var(--me-primary-light)' : '#ffffff',
                }}
              >
                <div style={{ fontSize: '2rem' }}>{emo.emoji}</div>
                <div className="fw-medium mt-1" style={{ fontSize: '0.95rem' }}>
                  {emo.label}
                </div>
                {isSuggested && (
                  <span
                    className="badge mt-1"
                    style={{
                      backgroundColor: 'rgba(143, 166, 142, 0.2)',
                      color: '#466145',
                      fontSize: '0.68rem',
                      fontWeight: 500,
                    }}
                  >
                    Suggested
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {suggestedLabel && (
        <p className="text-center text-muted small mt-3 mb-0">
          Suggested for you: <strong>{suggestedLabel}</strong>. Feel free to choose what fits best.
        </p>
      )}
    </div>
  );
};

export default EmotionGrid;
