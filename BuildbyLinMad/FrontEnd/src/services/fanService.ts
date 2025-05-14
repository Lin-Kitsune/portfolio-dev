import axios from 'axios';

const API_URL = 'http://localhost:5000/api/fans';

export const fanService = {
  getFans: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  createFan: async (fanData: FormData) => {
    const res = await axios.post(API_URL, fanData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateFan: async (id: string, fanData: FormData) => {
    const res = await axios.put(`${API_URL}/${id}`, fanData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteFan: async (id: string) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
