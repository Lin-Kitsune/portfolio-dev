import axios from 'axios';

const API_URL = 'http://localhost:5000/api/processors';

export const processorService = {
  getProcessors: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  createProcessor: async (processorData: FormData) => {
    const res = await axios.post(API_URL, processorData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateProcessor: async (id: string, processorData: FormData) => {
    const res = await axios.put(`${API_URL}/${id}`, processorData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteProcessor: async (id: string) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
