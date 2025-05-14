import axios from 'axios';

const API_URL = 'http://localhost:5000/api/disks';

export const diskService = {
  getDisks: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  createDisk: async (diskData: FormData) => {
    const res = await axios.post(API_URL, diskData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateDisk: async (id: string, diskData: FormData) => {
    const res = await axios.put(`${API_URL}/${id}`, diskData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteDisk: async (id: string) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
