import { EMOTIONS, getEmotionById } from '../constants/emotions';

export const getIntensityColor = (value) => {
  // Shifts from muted indigo (1) through neutral gray (5) to warm yellow (10)
  if (value <= 2) return '#6b7280'; // soft slate
  if (value <= 4) return '#7B8DB0'; // soft indigo
  if (value <= 6) return '#8FA68E'; // sage green
  if (value <= 8) return '#A8C686'; // light olive
  return '#F4C95D'; // warm sunny yellow
};

export const getIntensityLabel = (value) => {
  if (value <= 2) return 'Very Mild';
  if (value <= 4) return 'Gentle';
  if (value <= 6) return 'Moderate';
  if (value <= 8) return 'Strong';
  return 'Intense';
};

export const formatEmotionName = (id) => {
  const emo = getEmotionById(id);
  return emo.label;
};

export { getEmotionById, EMOTIONS };
