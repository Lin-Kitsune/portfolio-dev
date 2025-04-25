import Ram from '../models/components/Ram.js';
import fs from 'fs';

const ramController = {
  createRam: async (req, res) => {
    try {
      const { name, price, specs, link, model } = req.body;
      const parsedSpecs = JSON.parse(specs);
      const imagePath = req.file ? req.file.path : '';

      const nuevo = new Ram({ name, price, specs: parsedSpecs, link, model, imagePath });
      await nuevo.save();

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear RAM:', error);
      res.status(500).json({ message: 'Error al crear RAM' });
    }
  },

  getRams: async (req, res) => {
    try {
      const rams = await Ram.find();
      res.json(rams);
    } catch (error) {
      console.error('Error al obtener RAMs:', error);
      res.status(500).json({ message: 'Error al obtener RAMs' });
    }
  },

  updateRam: async (req, res) => {
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

      const updated = await Ram.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updated);
    } catch (error) {
      console.error('Error al actualizar RAM:', error);
      res.status(500).json({ message: 'Error al actualizar RAM' });
    }
  },

  deleteRam: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Ram.findByIdAndDelete(id);

      if (deleted?.imagePath && fs.existsSync(deleted.imagePath)) {
        fs.unlinkSync(deleted.imagePath);
      }

      res.json({ message: 'RAM eliminada' });
    } catch (error) {
      console.error('Error al eliminar RAM:', error);
      res.status(500).json({ message: 'Error al eliminar RAM' });
    }
  },
};

export default ramController;
