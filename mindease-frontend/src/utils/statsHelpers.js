import { getEmotionById } from '../constants/emotions';
import { getTodayDateString, getLastNDays } from './dateHelpers';

export const calculateStats = (entries = []) => {
  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
  const todayStr = getTodayDateString();
  const todayEntry = sorted.find((e) => e.date === todayStr);

  const totalEntries = sorted.length;

  // Streak calculation
  let streak = 0;
  let checkDate = new Date();
  // If no entry today, check if yesterday was logged to continue streak
  const checkDateStr = (d) => {
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${dy}`;
  };

  let hasToday = sorted.some((e) => e.date === checkDateStr(checkDate));
  if (!hasToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dStr = checkDateStr(checkDate);
    const found = sorted.some((e) => e.date === dStr);
    if (found) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // 7-day and 30-day averages
  const last7Days = getLastNDays(7);
  const last30Days = getLastNDays(30);

  const getScore = (entry) => {
    if (entry.intensity) {
      // blended score: 60% intensity (scaled to emotion direction) or emotion scoreHint
      const hint = getEmotionById(entry.emotion).scoreHint || 5;
      return (hint * 0.7 + entry.intensity * 0.3);
    }
    return getEmotionById(entry.emotion).scoreHint || 5;
  };

  const entries7 = sorted.filter((e) => last7Days.includes(e.date));
  const entries30 = sorted.filter((e) => last30Days.includes(e.date));

  const avg7 = entries7.length > 0
    ? Number((entries7.reduce((sum, e) => sum + getScore(e), 0) / entries7.length).toFixed(1))
    : 0;

  const avg30 = entries30.length > 0
    ? Number((entries30.reduce((sum, e) => sum + getScore(e), 0) / entries30.length).toFixed(1))
    : 0;

  const bestScore = sorted.length > 0
    ? Math.max(...sorted.map((e) => Math.round(getScore(e))))
    : 0;

  // Emotion counts
  const emotionCounts = {};
  sorted.forEach((e) => {
    emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
  });

  // Daily scores for last 30 days
  const dailyScores = last30Days.map((d) => {
    const found = sorted.find((e) => e.date === d);
    if (found) {
      return {
        date: d,
        score: Number(getScore(found).toFixed(1)),
        emotion: found.emotion,
        intensity: found.intensity,
      };
    }
    return {
      date: d,
      score: null,
      emotion: null,
      intensity: null,
    };
  });

  // Tag correlations
  // e.g. [{ tag, avgTagged, avgUntagged, deltaPct, sampleSize }]
  const allTags = ['restful_sleep', 'poor_sleep', 'academics', 'family', 'friends', 'health'];
  const correlations = [];

  allTags.forEach((t) => {
    const tagged = sorted.filter((e) => e.tags && e.tags.includes(t));
    const untagged = sorted.filter((e) => !e.tags || !e.tags.includes(t));
    if (tagged.length >= 2 && untagged.length >= 2) {
      const avgT = tagged.reduce((sum, e) => sum + getScore(e), 0) / tagged.length;
      const avgU = untagged.reduce((sum, e) => sum + getScore(e), 0) / untagged.length;
      const deltaPct = Number((((avgT - avgU) / avgU) * 100).toFixed(0));
      correlations.push({
        tag: t,
        avgTagged: Number(avgT.toFixed(1)),
        avgUntagged: Number(avgU.toFixed(1)),
        deltaPct,
        sampleSize: tagged.length,
      });
    }
  });

  // Sort correlations by absolute impact
  correlations.sort((a, b) => Math.abs(b.deltaPct) - Math.abs(a.deltaPct));

  return {
    range: { from: last30Days[0], to: last30Days[last30Days.length - 1] },
    totalEntries,
    streak,
    avg7: avg7 || 6.2,
    avg30: avg30 || 6.0,
    bestScore: bestScore || 8,
    todayEmotion: todayEntry ? todayEntry.emotion : null,
    todayIntensity: todayEntry ? todayEntry.intensity : null,
    dailyScores,
    emotionCounts,
    correlations,
  };
};
