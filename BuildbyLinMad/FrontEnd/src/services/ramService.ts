import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/rams';

export const ramService = {
  getRams: async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
  },

  createRam: async (formData: FormData) => {
    const res = await axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  updateRam: async (id: string, formData: FormData) => {
    const res = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  deleteRam: async (id: string) => {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
  },
};
