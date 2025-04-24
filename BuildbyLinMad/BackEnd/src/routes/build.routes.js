import express from 'express';
import Build from '../models/Build.js';

const router = express.Router();

// 📌 Guardar una nueva build
router.post('/save', async (req, res) => {
  try {
    const { userId, components, total } = req.body;

    if (!userId || !components) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    const newBuild = new Build({ userId, components, total });
    await newBuild.save();

    return res.status(201).json({ message: 'Build guardada exitosamente', build: newBuild });
  } catch (error) {
    console.error('❌ Error al guardar build:', error);
    return res.status(500).json({ message: 'Error al guardar la build' });
  }
});

// 📌 Obtener todas las builds de un usuario
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const builds = await Build.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({ builds });
  } catch (error) {
    console.error('❌ Error al obtener builds:', error);
    return res.status(500).json({ message: 'Error al obtener builds del usuario' });
  }
});

// 📌 Eliminar una build por ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Build.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Build eliminada' });
  } catch (error) {
    console.error('❌ Error al eliminar build:', error);
    return res.status(500).json({ message: 'Error al eliminar la build' });
  }
});

// 📌 Actualizar una build existente
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { components, total } = req.body;

    const updatedBuild = await Build.findByIdAndUpdate(
      id,
      { components, total },
      { new: true }
    );

    if (!updatedBuild) {
      return res.status(404).json({ message: 'Build no encontrada' });
    }

    return res.status(200).json({ message: 'Build actualizada', build: updatedBuild });
  } catch (error) {
    console.error('❌ Error al actualizar build:', error);
    return res.status(500).json({ message: 'Error al actualizar la build' });
  }
});


export default router;
