import axiosClient from './axiosClient';

export const moodApi = {
  logMood: async (entryData) => {
    const res = await axiosClient.post('/mood/log', entryData);
    return res.data;
  },

  getFollowupQuestion: async ({ bodyFeel, mindText }) => {
    const res = await axiosClient.post('/mood/followup-question', { bodyFeel, mindText });
    return res.data;
  },

  getStats: async (days = 30) => {
    const res = await axiosClient.get(`/mood/stats?days=${days}`);
    return res.data;
  },

  getQuestions: async (ageGroup = 'young_adult', lastSeen = []) => {
    const params = { ageGroup };
    if (lastSeen && lastSeen.length > 0) {
      params.lastSeen = lastSeen.join(',');
    }
    const res = await axiosClient.get('/mood/questions', { params });
    return res.data;
  },

  analyzeMood: async (payload) => {
    const res = await axiosClient.post('/mood/analyze', payload);
    return res.data;
  },

  saveMood: async (entry) => {
    const res = await axiosClient.post('/mood/save', entry);
    return res.data;
  },

  getHistory: async (email) => {
    const res = await axiosClient.get('/mood/history', { params: { email } });
    return res.data;
  },
};
