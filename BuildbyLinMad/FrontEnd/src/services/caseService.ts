import axios from 'axios';

const API_URL = 'http://localhost:5000/api/cases';

export const caseService = {
  getCases: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  createCase: async (caseData: FormData) => {
    const res = await axios.post(API_URL, caseData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateCase: async (id: string, caseData: FormData) => {
    const res = await axios.put(`${API_URL}/${id}`, caseData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteCase: async (id: string) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
