import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/psus';

export const psuService = {
  getPsus: async () => {
    const res = await axios.get(BASE_URL);
    return res.data;
  },

  createPsu: async (formData: FormData) => {
    const res = await axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  updatePsu: async (id: string, formData: FormData) => {
    const res = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  deletePsu: async (id: string) => {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
  },
};
