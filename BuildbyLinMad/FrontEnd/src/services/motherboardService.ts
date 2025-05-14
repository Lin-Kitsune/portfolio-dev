import axios from 'axios';

const API_URL = 'http://localhost:5000/api/motherboards';

export const motherboardService = {
  getMotherboards: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  createMotherboard: async (motherboardData: FormData) => {
    const res = await axios.post(API_URL, motherboardData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateMotherboard: async (id: string, motherboardData: FormData) => {
    const res = await axios.put(`${API_URL}/${id}`, motherboardData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteMotherboard: async (id: string) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
