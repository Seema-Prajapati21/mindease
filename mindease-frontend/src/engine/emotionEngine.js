import { KEYWORD_DICTIONARY } from './keywordDictionary';

export const suggestEmotion = ({ bodyFeel, mindText = '', branchAnswer = '', aiAnswer = '' }) => {
  const combinedText = `${mindText} ${branchAnswer} ${aiAnswer}`.toLowerCase();

  // Baseline scoring per emotion
  const scores = {
    happy: 0,
    hopeful: 0,
    calm: 0,
    grateful: 0,
    neutral: 1, // small neutral bias
    sad: 0,
    anxious: 0,
    angry: 0,
    overwhelmed: 0,
  };

  // 1. Body feel contributions
  switch (bodyFeel) {
    case 'heavy':
      scores.sad += 3;
      scores.overwhelmed += 2;
      scores.neutral += 1;
      break;
    case 'restless':
      scores.anxious += 3;
      scores.angry += 2;
      scores.overwhelmed += 1;
      break;
    case 'light':
      scores.happy += 3;
      scores.calm += 3;
      scores.hopeful += 2;
      scores.grateful += 2;
      break;
    case 'tense':
      scores.anxious += 3;
      scores.angry += 3;
      scores.overwhelmed += 1;
      break;
    case 'numb':
      scores.neutral += 3;
      scores.sad += 2;
      scores.overwhelmed += 1;
      break;
    default:
      scores.neutral += 1;
  }

  // 2. Keyword matching
  Object.keys(KEYWORD_DICTIONARY).forEach((emotion) => {
    const words = KEYWORD_DICTIONARY[emotion];
    words.forEach((w) => {
      if (combinedText.includes(w)) {
        scores[emotion] += 2;
      }
    });
  });

  // 3. Branch answer subtleties
  if (/tired-heavy/.test(combinedText)) {
    scores.sad += 1;
    scores.overwhelmed += 1;
  }
  if (/sad-heavy|loneliness|missing/.test(combinedText)) {
    scores.sad += 3;
  }
  if (/pressure/.test(combinedText)) {
    scores.anxious += 2;
    scores.overwhelmed += 2;
  }
  if (/anger|frustrated/.test(combinedText)) {
    scores.angry += 3;
  }

  // Find highest scoring emotion
  let bestEmotion = 'neutral';
  let maxScore = -1;

  Object.entries(scores).forEach(([emo, score]) => {
    if (score > maxScore) {
      maxScore = score;
      bestEmotion = emo;
    }
  });

  // Calculate confidence & intensity hint
  let confidence = 'low';
  if (maxScore >= 6) {
    confidence = 'high';
  } else if (maxScore >= 3) {
    confidence = 'medium';
  }

  let intensityHint = 5;
  if (['happy', 'grateful', 'hopeful'].includes(bestEmotion)) {
    intensityHint = 7;
  } else if (['overwhelmed', 'angry', 'anxious'].includes(bestEmotion)) {
    intensityHint = 7;
  } else if (bestEmotion === 'sad') {
    intensityHint = 6;
  } else if (bestEmotion === 'calm') {
    intensityHint = 8;
  } else {
    intensityHint = 5;
  }

  return {
    emotion: bestEmotion,
    confidence,
    intensityHint,
    scores,
  };
};
