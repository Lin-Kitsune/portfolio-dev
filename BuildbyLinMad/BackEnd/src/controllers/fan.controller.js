import Fan from '../models/components/Fan.js';
import fs from 'fs';

const fanController = {
  createFan: async (req, res) => {
    try {
      const { name, price, specs, link, model } = req.body;
      const parsedSpecs = JSON.parse(specs);
      const imagePath = req.file ? req.file.path : '';

      const nuevo = new Fan({ name, price, specs: parsedSpecs, link, model, imagePath, createdAt: new Date(), });
      await nuevo.save();

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear fan:', error);
      res.status(500).json({ message: 'Error al crear fan' });
    }
  },

  getFans: async (req, res) => {
    try {
      const fans = await Fan.find();
      res.json(fans);
    } catch (error) {
      console.error('Error al obtener fans:', error);
      res.status(500).json({ message: 'Error al obtener fans' });
    }
  },

  updateFan: async (req, res) => {
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

      const updated = await Fan.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updated);
    } catch (error) {
      console.error('Error al actualizar fan:', error);
      res.status(500).json({ message: 'Error al actualizar fan' });
    }
  },

  deleteFan: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Fan.findByIdAndDelete(id);

      if (deleted?.imagePath && fs.existsSync(deleted.imagePath)) {
        fs.unlinkSync(deleted.imagePath);
      }

      res.json({ message: 'Fan eliminado' });
    } catch (error) {
      console.error('Error al eliminar fan:', error);
      res.status(500).json({ message: 'Error al eliminar fan' });
    }
  },
};

export default fanController;
