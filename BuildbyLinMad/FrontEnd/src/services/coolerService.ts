import axios from 'axios';

const API_URL = 'http://localhost:5000/api/coolers'; // Ajusta si tu endpoint real es diferente

export const coolerService = {
  getCoolers: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  createCooler: async (coolerData: FormData) => {
    const res = await axios.post(API_URL, coolerData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateCooler: async (id: string, coolerData: FormData) => {
    const res = await axios.put(`${API_URL}/${id}`, coolerData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteCooler: async (id: string) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
