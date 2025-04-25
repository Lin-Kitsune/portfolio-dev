import Cooler from '../models/components/Cooler.js';
import fs from 'fs';

const coolerController = {
  createCooler: async (req, res) => {
    try {
      const { name, price, specs, link, model } = req.body;
      const parsedSpecs = JSON.parse(specs);
      const imagePath = req.file ? req.file.path : '';

      const nuevo = new Cooler({ name, price, specs: parsedSpecs, link, model, imagePath });
      await nuevo.save();

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear cooler:', error);
      res.status(500).json({ message: 'Error al crear cooler' });
    }
  },

  getCoolers: async (req, res) => {
    try {
      const coolers = await Cooler.find();
      res.json(coolers);
    } catch (error) {
      console.error('Error al obtener coolers:', error);
      res.status(500).json({ message: 'Error al obtener coolers' });
    }
  },

  updateCooler: async (req, res) => {
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

      const updated = await Cooler.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updated);
    } catch (error) {
      console.error('Error al actualizar cooler:', error);
      res.status(500).json({ message: 'Error al actualizar cooler' });
    }
  },

  deleteCooler: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Cooler.findByIdAndDelete(id);

      if (deleted?.imagePath && fs.existsSync(deleted.imagePath)) {
        fs.unlinkSync(deleted.imagePath);
      }

      res.json({ message: 'Cooler eliminado' });
    } catch (error) {
      console.error('Error al eliminar cooler:', error);
      res.status(500).json({ message: 'Error al eliminar cooler' });
    }
  },
};

export default coolerController;
