export const generateMockAiQuestion = async ({ bodyFeel, mindText }) => {
  // Simulate network/inference latency ~800-1000ms
  await new Promise((resolve) => setTimeout(resolve, 800));

  const text = (mindText || '').toLowerCase();

  if (text.includes('sleep') || text.includes('tired')) {
    return {
      question: "When you think about tonight's rest, what is one thing you can set aside until tomorrow morning?",
      source: 'ai',
    };
  }

  if (text.includes('exam') || text.includes('work') || text.includes('study')) {
    return {
      question: "If the expectations around you were turned down to a whisper, what would you actually want to do right now?",
      source: 'ai',
    };
  }

  if (text.includes('family') || text.includes('friend') || text.includes('people')) {
    return {
      question: "In the middle of all those interactions, did you feel seen today, or did you feel like you had to perform?",
      source: 'ai',
    };
  }

  if (bodyFeel === 'tense' || bodyFeel === 'restless') {
    return {
      question: "If that physical tension had a voice for just ten seconds, what would it ask you to slow down for?",
      source: 'ai',
    };
  }

  return {
    question: "Looking back at today from a gentle distance, what was one small moment that felt honest to you?",
    source: 'ai',
  };
};
