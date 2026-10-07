import React from 'react';
import { getDailyAffirmation } from '../constants/affirmations';

const AffirmationCard = () => {
  const affirmation = getDailyAffirmation();

  return (
    <div className="me-card p-4 my-3 text-center" style={{ backgroundColor: '#FAF6EE' }}>
      <div className="text-muted small fw-medium mb-2 text-uppercase tracking-wider">
        Daily Grounding
      </div>
      <p className="serif fs-5 mb-0" style={{ color: '#444444', fontStyle: 'italic', maxWidth: '620px', margin: '0 auto' }}>
        "{affirmation}"
      </p>
    </div>
  );
};

export default AffirmationCard;
