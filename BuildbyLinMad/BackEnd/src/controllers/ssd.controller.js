import Ssd from '../models/components/Ssd.js';
import fs from 'fs';

const ssdController = {
  createSsd: async (req, res) => {
    try {
      const { name, price, specs, link, model } = req.body;
      const parsedSpecs = JSON.parse(specs);
      const imagePath = req.file ? req.file.path : '';

      const nuevo = new Ssd({ name, price, specs: parsedSpecs, link, model, imagePath, createdAt: new Date(), });
      await nuevo.save();

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear SSD:', error);
      res.status(500).json({ message: 'Error al crear SSD' });
    }
  },

  getSsds: async (req, res) => {
    try {
      const ssds = await Ssd.find();
      res.json(ssds);
    } catch (error) {
      console.error('Error al obtener SSDs:', error);
      res.status(500).json({ message: 'Error al obtener SSDs' });
    }
  },

  updateSsd: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, specs, link, model } = req.body;
      const parsedSpecs = JSON.parse(specs);

      const updateData = {
        name,
        price,
        specs: parsedSpecs,
        link,
        model,
      };

      if (req.file) {
        updateData.imagePath = req.file.path;
      }

      const updated = await Ssd.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updated);
    } catch (error) {
      console.error('Error al actualizar SSD:', error);
      res.status(500).json({ message: 'Error al actualizar SSD' });
    }
  },

  deleteSsd: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Ssd.findByIdAndDelete(id);

      if (deleted?.imagePath && fs.existsSync(deleted.imagePath)) {
        fs.unlinkSync(deleted.imagePath);
      }

      res.json({ message: 'SSD eliminado' });
    } catch (error) {
      console.error('Error al eliminar SSD:', error);
      res.status(500).json({ message: 'Error al eliminar SSD' });
    }
  },
};

export default ssdController;
