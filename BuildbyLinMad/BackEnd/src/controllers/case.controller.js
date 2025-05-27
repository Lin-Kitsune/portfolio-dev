import Case from '../models/components/Case.js';
import fs from 'fs';

const caseController = {
  createCase: async (req, res) => {
    try {
      const { name, price, specs, link, model } = req.body;
      const parsedSpecs = JSON.parse(specs);
      const imagePath = req.file ? req.file.path : '';

      const nuevo = new Case({ name, price, specs: parsedSpecs, link, model, imagePath, createdAt: new Date(), });
      await nuevo.save();

      res.status(201).json(nuevo);
    } catch (error) {
      console.error('Error al crear case:', error);
      res.status(500).json({ message: 'Error al crear case' });
    }
  },

  getCases: async (req, res) => {
    try {
      const cases = await Case.find();
      res.json(cases);
    } catch (error) {
      console.error('Error al obtener cases:', error);
      res.status(500).json({ message: 'Error al obtener cases' });
    }
  },

  updateCase: async (req, res) => {
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

      const updated = await Case.findByIdAndUpdate(id, updateData, { new: true });
      res.json(updated);
    } catch (error) {
      console.error('Error al actualizar case:', error);
      res.status(500).json({ message: 'Error al actualizar case' });
    }
  },

  deleteCase: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Case.findByIdAndDelete(id);

      if (deleted?.imagePath && fs.existsSync(deleted.imagePath)) {
        fs.unlinkSync(deleted.imagePath);
      }

      res.json({ message: 'Case eliminado' });
    } catch (error) {
      console.error('Error al eliminar case:', error);
      res.status(500).json({ message: 'Error al eliminar case' });
    }
  },
};

export default caseController;
