import axiosClient from './axiosClient';

export const journeyApi = {
  downloadPdfSummary: async (from, to) => {
    const res = await axiosClient.get(`/journey/summary/pdf`, {
      params: { from, to },
      responseType: 'blob',
    });
    return res.data;
  },
};
