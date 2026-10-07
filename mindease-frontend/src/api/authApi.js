import axiosClient from './axiosClient';

export const authApi = {
  signup: async (data) => {
    const res = await axiosClient.post('/auth/signup', data);
    return res.data;
  },

  login: async (data) => {
    const res = await axiosClient.post('/auth/login', data);
    return res.data;
  },

  getMe: async () => {
    const res = await axiosClient.get('/auth/me');
    return res.data;
  },

  updateSettings: async (settings) => {
    const res = await axiosClient.patch('/auth/settings', settings);
    return res.data;
  },

  deleteAccount: async () => {
    const res = await axiosClient.delete('/auth/account');
    return res.data;
  },
};
