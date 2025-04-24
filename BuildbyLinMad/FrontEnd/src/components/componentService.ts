import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/componentes';

// 🧠 Mapeo de keys internas a nombres de colección reales
const typeMap: Record<string, string> = {
  cpu: 'processors',
  gpu: 'gpus',
  motherboard: 'motherboards',
  ram: 'rams',
  ssd: 'ssds',
  hdd: 'disks',
  psu: 'psus',
  case: 'cases',
  cooler: 'coolers',
  fans: 'fans',
};

export const componentService = {
  getByType: async (type: string) => {
    const mappedType = typeMap[type] || type;

    try {
      const res = await axios.get(`${API_BASE}/${mappedType}`);
      return res.data;
    } catch (err) {
      console.error(`❌ Error al cargar ${mappedType}:`, err);
      return [];
    }
  },
};
