import axios from 'axios';

const API_URL = 'http://localhost:5000/api/builds';

export const buildService = {
  guardarBuild: async (buildData: any) => {
    const res = await axios.post(`${API_URL}/save`, buildData);
    return res.data;
  },

  getBuildsByUser: async (userId: string) => {
    const res = await axios.get(`${API_URL}/user/${userId}`);
    return res.data.builds;
  },

  eliminarBuild: async (buildId: string) => {
    const res = await axios.delete(`${API_URL}/delete/${buildId}`);
    return res.data;
  },

  actualizarBuild: async (buildId: string, buildData: any) => {
    const res = await axios.put(`${API_URL}/update/${buildId}`, buildData);
    return res.data;
  },
  
};
