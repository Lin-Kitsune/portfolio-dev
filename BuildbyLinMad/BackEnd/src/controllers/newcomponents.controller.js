import Case from '../models/components/Case.js';
import Ram from '../models/components/Ram.js';
import Ssd from '../models/components/Ssd.js';
import Motherboard from '../models/components/Motherboard.js';
import Gpu from '../models/components/Gpu.js';
import Processor from '../models/components/Processor.js';
import Psu from '../models/components/Psu.js';
import Cooler from '../models/components/Cooler.js';
import Fan from '../models/components/Fan.js';
import Disk from '../models/components/Disk.js';

export const getNewComponents = async (req, res) => {
  try {
    const results = await Promise.all([
      Case.findOne().sort({ createdAt: -1 }),
      Ram.findOne().sort({ createdAt: -1 }),
      Ssd.findOne().sort({ createdAt: -1 }),
      Motherboard.findOne().sort({ createdAt: -1 }),
      Gpu.findOne().sort({ createdAt: -1 }),
      Processor.findOne().sort({ createdAt: -1 }),
      Psu.findOne().sort({ createdAt: -1 }),
      Cooler.findOne().sort({ createdAt: -1 }),
      Fan.findOne().sort({ createdAt: -1 }),
      Disk.findOne().sort({ createdAt: -1 }),
    ]);

    const filtered = results.filter(Boolean);

    res.json(filtered);
  } catch (error) {
    console.error('Error al obtener nuevos componentes:', error);
    res.status(500).json({ message: 'Error al obtener nuevos componentes' });
  }
};
