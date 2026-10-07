import { getLastNDays } from '../utils/dateHelpers';

const DEFAULT_MOCK_ENTRIES = [
  {
    id: 'mock-1',
    userId: 'demo-user-1',
    date: getLastNDays(14)[0],
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    bodyFeel: 'restless',
    mindText: 'A lot of impending project deadlines.',
    branchId: 'restless_pressure',
    branchAnswer: 'Current pressure',
    aiAnswer: null,
    emotion: 'anxious',
    intensity: 6,
    tags: ['academics', 'poor_sleep'],
    journalNote: 'Trying to organize my notes before night.',
    suggestedEmotion: 'anxious',
    wasOverridden: false,
  },
  {
    id: 'mock-2',
    userId: 'demo-user-1',
    date: getLastNDays(14)[3],
    createdAt: new Date(Date.now() - 11 * 86400000).toISOString(),
    bodyFeel: 'heavy',
    mindText: 'Just feeling a bit drained and low energy.',
    branchId: 'heavy_tired_sad',
    branchAnswer: 'Tired-heavy',
    aiAnswer: null,
    emotion: 'sad',
    intensity: 5,
    tags: ['poor_sleep'],
    journalNote: 'Slept early.',
    suggestedEmotion: 'neutral',
    wasOverridden: true,
  },
  {
    id: 'mock-3',
    userId: 'demo-user-1',
    date: getLastNDays(14)[6],
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    bodyFeel: 'light',
    mindText: 'Walked in the park with a friend. Weather was gentle.',
    branchId: 'light_relief',
    branchAnswer: 'Good conversation',
    aiAnswer: null,
    emotion: 'calm',
    intensity: 8,
    tags: ['friends', 'health'],
    journalNote: 'Felt very grounded today.',
    suggestedEmotion: 'calm',
    wasOverridden: false,
  },
  {
    id: 'mock-4',
    userId: 'demo-user-1',
    date: getLastNDays(14)[8],
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    bodyFeel: 'light',
    mindText: 'Had a great cup of tea and finished reading a chapter.',
    branchId: 'light_relief',
    branchAnswer: 'Gentle peace',
    aiAnswer: null,
    emotion: 'grateful',
    intensity: 8,
    tags: ['restful_sleep'],
    journalNote: 'Grateful for simple quiet hours.',
    suggestedEmotion: 'grateful',
    wasOverridden: false,
  },
  {
    id: 'mock-5',
    userId: 'demo-user-1',
    date: getLastNDays(14)[11],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    bodyFeel: 'tense',
    mindText: 'A disagreement at home left things unsaid.',
    branchId: 'tense_unsaid',
    branchAnswer: 'Something unsaid',
    aiAnswer: null,
    emotion: 'anxious',
    intensity: 7,
    tags: ['family'],
    journalNote: 'Giving myself time before bringing it up.',
    suggestedEmotion: 'anxious',
    wasOverridden: false,
  },
  {
    id: 'mock-6',
    userId: 'demo-user-1',
    date: getLastNDays(14)[13],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    bodyFeel: 'light',
    mindText: 'Resolved the tension calmly. Slept deeply.',
    branchId: 'light_relief',
    branchAnswer: 'Finished a burden',
    aiAnswer: null,
    emotion: 'hopeful',
    intensity: 8,
    tags: ['restful_sleep', 'family'],
    journalNote: 'Things look much clearer today.',
    suggestedEmotion: 'hopeful',
    wasOverridden: false,
  }
];

const STORAGE_KEY = 'mindease_entries';

export const getStoredEntries = (userId) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MOCK_ENTRIES));
      return DEFAULT_MOCK_ENTRIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MOCK_ENTRIES;
  } catch (err) {
    return DEFAULT_MOCK_ENTRIES;
  }
};

export const addMockEntry = (userId, newEntry) => {
  try {
    const existing = getStoredEntries(userId);
    const updated = [
      {
        ...newEntry,
        id: `entry-${Date.now()}`,
        userId: userId || 'demo-user',
        createdAt: new Date().toISOString(),
      },
      ...existing.filter(e => e.date !== newEntry.date), // One entry per day or replace today
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated[0];
  } catch (err) {
    console.error('Error saving entry to storage:', err);
    return newEntry;
  }
};
