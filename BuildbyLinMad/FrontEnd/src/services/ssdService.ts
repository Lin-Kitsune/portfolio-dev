import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/ssds';

export const ssdService = {
  getSsds: async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
  },

  createSsd: async (formData: FormData) => {
    const res = await axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  updateSsd: async (id: string, formData: FormData) => {
    const res = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  deleteSsd: async (id: string) => {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
  },
};
