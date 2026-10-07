import React from 'react';
import { getIntensityColor, getIntensityLabel } from '../utils/emotionHelpers';

const IntensitySlider = ({ value, onChange }) => {
  const badgeColor = getIntensityColor(value);
  const label = getIntensityLabel(value);

  return (
    <div className="py-3">
      <div className="d-flex flex-column align-items-center mb-4">
        <div
          className="d-flex align-items-center justify-content-center text-white fw-bold mb-2 shadow-sm"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: badgeColor,
            fontSize: '1.8rem',
            transition: 'background-color 0.3s ease',
          }}
        >
          {value}
        </div>
        <span className="fw-medium text-muted">{label} ({value} of 10)</span>
      </div>

      <input
        type="range"
        className="form-range me-slider"
        min="1"
        max="10"
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />

      <div className="d-flex justify-content-between text-muted small mt-2">
        <span>1 (Mild whisper)</span>
        <span>5 (Moderate)</span>
        <span>10 (Overwhelming)</span>
      </div>
    </div>
  );
};

export default IntensitySlider;
