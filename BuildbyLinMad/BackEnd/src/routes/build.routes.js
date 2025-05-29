import express from 'express';
import { componentModelMap } from '../models/componentModelMap.js';
import Build from '../models/Build.js';

const router = express.Router();

// 📌 Guardar una nueva build
router.post('/save', async (req, res) => {
  try {
    const { userId, components, total, title } = req.body;

    if (!userId || !components || !title) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    const newBuild = new Build({ userId, title, components, total });
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

// 📌 Marcar una build como recomendada
router.put('/:id/recommend', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBuild = await Build.findByIdAndUpdate(
      id,
      { recommended: true },
      { new: true }
    );

    if (!updatedBuild) {
      return res.status(404).json({ message: 'Build no encontrada' });
    }

    return res.status(200).json({ message: 'Build marcada como recomendada', build: updatedBuild });
  } catch (error) {
    console.error('❌ Error al marcar build como recomendada:', error);
    return res.status(500).json({ message: 'Error al actualizar la build' });
  }
});

// 📌 Obtener todas las builds (para admin)
router.get('/', async (req, res) => {
  try {
    const builds = await Build.find().sort({ createdAt: -1 });
    return res.status(200).json(builds);
  } catch (error) {
    console.error('❌ Error al obtener todas las builds:', error);
    return res.status(500).json({ message: 'Error al obtener las builds' });
  }
});

// 📌 Obtener builds recomendadas
router.get('/recommended', async (req, res) => {
  try {
    const builds = await Build.find({ recommended: true }).sort({ createdAt: -1 });
    return res.status(200).json(builds);
  } catch (error) {
    console.error('❌ Error al obtener builds recomendadas:', error);
    return res.status(500).json({ message: 'Error al obtener builds recomendadas' });
  }
});

// 📌 Desmarcar una build como recomendada
router.put('/:id/unrecommend', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBuild = await Build.findByIdAndUpdate(
      id,
      { recommended: false },
      { new: true }
    );

    if (!updatedBuild) {
      return res.status(404).json({ message: 'Build no encontrada' });
    }

    return res.status(200).json({ message: 'Build desmarcada como recomendada', build: updatedBuild });
  } catch (error) {
    console.error('❌ Error al desmarcar build como recomendada:', error);
    return res.status(500).json({ message: 'Error al actualizar la build' });

// 📌 Obtener los componentes más usados en builds
router.get('/popular-components', async (req, res) => {
  try {
    const builds = await Build.find();
    const usageMap = new Map();

    // 1. Contar los más usados
    builds.forEach((build) => {
      const { components } = build;

      Object.entries(components).forEach(([type, value]) => {
        if (!value || !value._id) return;

        if (type === 'fans' && Array.isArray(value)) {
          value.forEach((fan) => {
            if (!fan?._id) return;
            const key = `fans-${fan._id}`;
            usageMap.set(key, {
              ...usageMap.get(key),
              type: 'fans',
              id: fan._id,
              name: fan.name,
              count: (usageMap.get(key)?.count || 0) + 1,
            });
          });
        } else {
          const key = `${type}-${value._id}`;
          usageMap.set(key, {
            ...usageMap.get(key),
            type,
            id: value._id,
            name: value.name,
            count: (usageMap.get(key)?.count || 0) + 1,
          });
        }
      });
    });

    const results = await Promise.all(
      Array.from(usageMap.values()).map(async (item) => {
        const Model = componentModelMap[item.type];
        if (!Model) return item;

        const data = await Model.findById(item.id);

        return {
          ...item,
          price: data?.price ?? null,
          model: data?.model ?? null,
          link: data?.link ?? null,
          imagePath: data?.imagePath ?? null,
        };
      })
    );

    results.sort((a, b) => b.count - a.count);
    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error al procesar componentes populares:', error);
    res.status(500).json({ message: 'Error al procesar componentes populares' });
  }
});

export default router;
