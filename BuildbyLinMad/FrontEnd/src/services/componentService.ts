import axios from 'axios';

const API_URL = 'http://localhost:5000/api/new-components';

export interface NewComponent {
  _id: string;
  name: string;
  price: number;
  imagePath: string;
  link: string;
  model: string | null;
  specs: any;
}

export const newComponentsService = {
  getNewComponents: async (): Promise<NewComponent[]> => {
    const res = await axios.get<NewComponent[]>(API_URL);
    return res.data;
  },
};
