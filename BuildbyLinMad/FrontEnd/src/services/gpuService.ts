import axios from 'axios';

const API_URL = 'http://localhost:5000/api/gpus';

export const gpuService = {
  getGpus: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  createGpu: async (gpuData: FormData) => {
    const res = await axios.post(API_URL, gpuData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateGpu: async (id: string, gpuData: FormData) => {
    const res = await axios.put(`${API_URL}/${id}`, gpuData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteGpu: async (id: string) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
