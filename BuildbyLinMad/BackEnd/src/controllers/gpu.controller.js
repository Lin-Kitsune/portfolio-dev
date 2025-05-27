import Gpu from '../models/components/Gpu.js';
import fs from 'fs';

const gpuController = {
  createGpu: async (req, res) => {
    try {
      const { name, price, specs, link, model } = req.body;
      const parsedSpecs = JSON.parse(specs);
      const imagePath = req.file ? req.file.path : '';

      const nuevo = new Gpu({ name, price, specs: parsedSpecs, link, model, imagePath, createdAt: new Date(), });
      await nuevo.save();

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear GPU:', error);
      res.status(500).json({ message: 'Error al crear GPU' });
    }
  },

  getGpus: async (req, res) => {
    try {
      const gpus = await Gpu.find();
      res.json(gpus);
    } catch (error) {
      console.error('Error al obtener GPUs:', error);
      res.status(500).json({ message: 'Error al obtener GPUs' });
    }
  },

  updateGpu: async (req, res) => {
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

      const updated = await Gpu.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updated);
    } catch (error) {
      console.error('Error al actualizar GPU:', error);
      res.status(500).json({ message: 'Error al actualizar GPU' });
    }
  },

  deleteGpu: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Gpu.findByIdAndDelete(id);

      if (deleted?.imagePath && fs.existsSync(deleted.imagePath)) {
        fs.unlinkSync(deleted.imagePath);
      }

      res.json({ message: 'GPU eliminada' });
    } catch (error) {
      console.error('Error al eliminar GPU:', error);
      res.status(500).json({ message: 'Error al eliminar GPU' });
    }
  },
};

export default gpuController;
