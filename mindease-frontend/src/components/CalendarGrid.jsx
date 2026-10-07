import React, { useState } from 'react';
import { getEmotionById } from '../constants/emotions';
import { formatDateDisplay } from '../utils/dateHelpers';

const CalendarGrid = ({ dailyScores = [] }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  return (
    <div className="my-3 position-relative">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="small text-muted">Last 30 Days Activity</span>
        {hoveredDay && (
          <span className="small fw-medium fade-in" style={{ color: 'var(--me-text)' }}>
            {formatDateDisplay(hoveredDay.date)}: {hoveredDay.emotion ? getEmotionById(hoveredDay.emotion).label : 'No entry'}
          </span>
        )}
      </div>

      <div className="calendar-grid">
        {dailyScores.map((day) => {
          const emo = day.emotion ? getEmotionById(day.emotion) : null;
          const bg = emo ? emo.color : '#EDE7DD';
          const dayNum = day.date ? day.date.split('-')[2] : '';

          return (
            <div
              key={day.date}
              className="calendar-cell"
              style={{
                backgroundColor: bg,
                opacity: emo ? 0.85 : 0.45,
              }}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              title={`${day.date}: ${emo ? emo.label : 'No entry'}`}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: emo ? '#1f2421' : '#888' }}>
                {dayNum}
              </span>
              {emo && <span style={{ fontSize: '0.65rem' }}>{emo.emoji}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
