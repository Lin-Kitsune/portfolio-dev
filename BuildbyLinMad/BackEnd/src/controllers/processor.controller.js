import Processor from '../models/components/Processor.js';
import fs from 'fs';

const processorController = {
  createProcessor: async (req, res) => {
    try {
      const { name, price, specs, link, model } = req.body;
      const parsedSpecs = JSON.parse(specs);
      const imagePath = req.file ? req.file.path : '';

      const nuevo = new Processor({ name, price, specs: parsedSpecs, link, model, imagePath, createdAt: new Date(), });
      await nuevo.save();

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear processor:', error);
      res.status(500).json({ message: 'Error al crear processor' });
    }
  },

  getProcessors: async (req, res) => {
    try {
      const processors = await Processor.find();
      res.json(processors);
    } catch (error) {
      console.error('Error al obtener processors:', error);
      res.status(500).json({ message: 'Error al obtener processors' });
    }
  },

  updateProcessor: async (req, res) => {
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

      const updated = await Processor.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updated);
    } catch (error) {
      console.error('Error al actualizar processor:', error);
      res.status(500).json({ message: 'Error al actualizar processor' });
    }
  },

  deleteProcessor: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Processor.findByIdAndDelete(id);

      if (deleted?.imagePath && fs.existsSync(deleted.imagePath)) {
        fs.unlinkSync(deleted.imagePath);
      }

      res.json({ message: 'Processor eliminado' });
    } catch (error) {
      console.error('Error al eliminar processor:', error);
      res.status(500).json({ message: 'Error al eliminar processor' });
    }
  },
};

export default processorController;
