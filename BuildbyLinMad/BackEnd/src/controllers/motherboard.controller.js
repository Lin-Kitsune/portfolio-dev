import Motherboard from '../models/components/Motherboard.js';
import fs from 'fs';

const motherboardController = {
  createMotherboard: async (req, res) => {
    try {
      const { name, price, specs, link, model } = req.body;
      const parsedSpecs = JSON.parse(specs);
      const imagePath = req.file ? req.file.path : '';

      const nuevo = new Motherboard({ name, price, specs: parsedSpecs, link, model, imagePath });
      await nuevo.save();

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear motherboard:', error);
      res.status(500).json({ message: 'Error al crear motherboard' });
    }
  },

  getMotherboards: async (req, res) => {
    try {
      const motherboards = await Motherboard.find();
      res.json(motherboards);
    } catch (error) {
      console.error('Error al obtener motherboards:', error);
      res.status(500).json({ message: 'Error al obtener motherboards' });
    }
  },

  updateMotherboard: async (req, res) => {
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

      const updated = await Motherboard.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updated);
    } catch (error) {
      console.error('Error al actualizar motherboard:', error);
      res.status(500).json({ message: 'Error al actualizar motherboard' });
    }
  },

  deleteMotherboard: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Motherboard.findByIdAndDelete(id);

      if (deleted?.imagePath && fs.existsSync(deleted.imagePath)) {
        fs.unlinkSync(deleted.imagePath);
      }

      res.json({ message: 'Motherboard eliminada' });
    } catch (error) {
      console.error('Error al eliminar motherboard:', error);
      res.status(500).json({ message: 'Error al eliminar motherboard' });
    }
  },
};

export default motherboardController;
