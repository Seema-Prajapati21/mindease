export const EMOTIONS = [
  { id: 'happy',       label: 'Happy',       color: '#F4C95D', emoji: '😊', scoreHint: 9 },
  { id: 'hopeful',     label: 'Hopeful',     color: '#A8C686', emoji: '🌱', scoreHint: 8 },
  { id: 'calm',        label: 'Calm',        color: '#8ECAE6', emoji: '🌊', scoreHint: 8 },
  { id: 'grateful',    label: 'Grateful',    color: '#F4A896', emoji: '🙏', scoreHint: 8 },
  { id: 'neutral',     label: 'Neutral',     color: '#B8B8B0', emoji: '😐', scoreHint: 5 },
  { id: 'sad',         label: 'Sad',         color: '#7B8DB0', emoji: '😔', scoreHint: 3 },
  { id: 'anxious',     label: 'Anxious',     color: '#B8A4C9', emoji: '😰', scoreHint: 3 },
  { id: 'angry',       label: 'Angry',       color: '#C97B6E', emoji: '😠', scoreHint: 3 },
  { id: 'overwhelmed', label: 'Overwhelmed', color: '#8B5E83', emoji: '😵', scoreHint: 2 },
];

export const EMOTION_MAP = EMOTIONS.reduce((acc, curr) => {
  acc[curr.id] = curr;
  return acc;
}, {});

export const getEmotionById = (id) => {
  return EMOTION_MAP[id] || { id: 'neutral', label: 'Neutral', color: '#B8B8B0', emoji: '😐', scoreHint: 5 };
};
