import Disk from '../models/components/Disk.js';
import fs from 'fs';

const diskController = {
  createDisk: async (req, res) => {
    try {
      const { name, price, specs, link, model } = req.body;
      const parsedSpecs = JSON.parse(specs);
      const imagePath = req.file ? req.file.path : '';

      const nuevo = new Disk({ name, price, specs: parsedSpecs, link, model, imagePath, createdAt: new Date(), });
      await nuevo.save();

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear disk:', error);
      res.status(500).json({ message: 'Error al crear disk' });
    }
  },

  getDisks: async (req, res) => {
    try {
      const disks = await Disk.find();
      res.json(disks);
    } catch (error) {
      console.error('Error al obtener disks:', error);
      res.status(500).json({ message: 'Error al obtener disks' });
    }
  },

  updateDisk: async (req, res) => {
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

      const updated = await Disk.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updated);
    } catch (error) {
      console.error('Error al actualizar disk:', error);
      res.status(500).json({ message: 'Error al actualizar disk' });
    }
  },

  deleteDisk: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Disk.findByIdAndDelete(id);

      if (deleted?.imagePath && fs.existsSync(deleted.imagePath)) {
        fs.unlinkSync(deleted.imagePath);
      }

      res.json({ message: 'Disk eliminado' });
    } catch (error) {
      console.error('Error al eliminar disk:', error);
      res.status(500).json({ message: 'Error al eliminar disk' });
    }
  },
};

export default diskController;
