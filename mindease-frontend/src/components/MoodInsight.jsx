import React from 'react';
import { getEmotionById } from '../constants/emotions';

const MoodInsight = ({ stats }) => {
  const { avg7 = 6.0, emotionCounts = {}, totalEntries = 0 } = stats || {};

  // Find most frequent emotion
  let mostFrequentEmotion = 'calm';
  let maxCount = 0;
  Object.entries(emotionCounts).forEach(([emo, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentEmotion = emo;
    }
  });

  const emoInfo = getEmotionById(mostFrequentEmotion);

  let narrative = '';
  if (totalEntries === 0) {
    narrative = "Welcome to your gentle space. There are no right or wrong feelings here — only what is true for you today.";
  } else if (avg7 < 4) {
    narrative = `This past week has asked a lot of you. You've sat with feeling ${emoInfo.label.toLowerCase()} quite often. Remember that carrying heavy weather is tiring, and reaching for support is a quiet act of strength.`;
  } else if (avg7 <= 6) {
    narrative = `This week carried a steady balance. You felt ${emoInfo.label.toLowerCase()} across several moments, alongside quiet shifts in between. Honouring both the friction and the ease is how healing breathes.`;
  } else {
    narrative = `A gentle lightness has been present in your rhythm lately, with ${emoInfo.label.toLowerCase()} shining through often. Take a breath and soak in these calm, grounded moments.`;
  }

  return (
    <div className="me-card p-4 my-3" style={{ borderLeft: '4px solid var(--me-primary)' }}>
      <div className="d-flex align-items-center gap-2 mb-2">
        <span style={{ fontSize: '1.2rem' }}>🌿</span>
        <span className="text-uppercase small fw-semibold text-muted tracking-wider">
          Weekly Reflection
        </span>
      </div>
      <p className="serif fs-5 mb-0" style={{ color: 'var(--me-text)', lineHeight: 1.6 }}>
        "{narrative}"
      </p>
    </div>
  );
};

export default MoodInsight;
