import Psu from '../models/components/Psu.js';
import fs from 'fs';

const psuController = {
  createPsu: async (req, res) => {
    try {
      const { name, price, specs, link, model } = req.body;
      const parsedSpecs = JSON.parse(specs);
      const imagePath = req.file ? req.file.path : '';

      const nuevo = new Psu({ name, price, specs: parsedSpecs, link, model, imagePath });
      await nuevo.save();

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear PSU:', error);
      res.status(500).json({ message: 'Error al crear PSU' });
    }
  },

  getPsus: async (req, res) => {
    try {
      const psus = await Psu.find();
      res.json(psus);
    } catch (error) {
      console.error('Error al obtener PSUs:', error);
      res.status(500).json({ message: 'Error al obtener PSUs' });
    }
  },

  updatePsu: async (req, res) => {
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

      const updated = await Psu.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updated);
    } catch (error) {
      console.error('Error al actualizar PSU:', error);
      res.status(500).json({ message: 'Error al actualizar PSU' });
    }
  },

  deletePsu: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Psu.findByIdAndDelete(id);

      if (deleted?.imagePath && fs.existsSync(deleted.imagePath)) {
        fs.unlinkSync(deleted.imagePath);
      }

      res.json({ message: 'PSU eliminada' });
    } catch (error) {
      console.error('Error al eliminar PSU:', error);
      res.status(500).json({ message: 'Error al eliminar PSU' });
    }
  },
};

export default psuController;
