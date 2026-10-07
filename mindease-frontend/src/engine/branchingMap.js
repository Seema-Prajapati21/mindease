export const pickBranch = (bodyFeel, mindText = '') => {
  const text = (mindText || '').toLowerCase();

  if (bodyFeel === 'heavy') {
    if (/tired|empty|drained|exhausted|fatigue|sleepy/.test(text)) {
      return {
        id: 'heavy_tired_sad',
        question: 'Is this more a tired-heavy, or a sad-heavy?',
        options: ['Tired-heavy', 'Sad-heavy', 'A mix of both'],
      };
    }
    if (/miss|alone|lonely|isolated|left out|nobody/.test(text)) {
      return {
        id: 'heavy_lonely',
        question: 'That heaviness sounds tied to someone. Is it missing them, or loneliness?',
        options: ['Missing them', 'Deep loneliness', 'Uncertain'],
      };
    }
  }

  if (bodyFeel === 'restless') {
    if (/work|study|exam|deadline|boss|assignment|test/.test(text)) {
      return {
        id: 'restless_pressure',
        question: 'Is the restlessness about pressure, or something unresolved?',
        options: ['Current pressure', 'Unresolved issue', 'Hard to pin down'],
      };
    }
    if (/fight|argument|conflict|yelled|dispute|shout/.test(text)) {
      return {
        id: 'restless_anger',
        question: "Does the restlessness feel like anger that hasn't found a place?",
        options: ['Yes, unspoken anger', 'More like anxiety', 'Just unsettled'],
      };
    }
  }

  if (bodyFeel === 'numb') {
    return {
      id: 'numb_color',
      question: 'If the numbness had a colour, what would it be?',
      options: ['Gray or washed out', 'Pitch black', 'Cold pale blue'],
    };
  }

  if (bodyFeel === 'light') {
    if (/good|great|happy|joy|relief|proud|accomplished/.test(text)) {
      return {
        id: 'light_relief',
        question: 'What made today feel lighter than usual?',
        options: ['Finished a burden', 'Good conversation', 'Gentle peace'],
      };
    }
  }

  if (bodyFeel === 'tense') {
    if (/family|home|parents|mom|dad|sibling|partner/.test(text)) {
      return {
        id: 'tense_unsaid',
        question: 'Is the tension from something said, or something unsaid?',
        options: ['Something said', 'Something unsaid', 'A brewing worry'],
      };
    }
  }

  // DEFAULT
  return {
    id: 'weather_default',
    question: 'If today were weather, what would it be?',
    options: ['Overcast / foggy', 'Thunderstorm', 'Gentle autumn breeze', 'Bright sun'],
  };
};
