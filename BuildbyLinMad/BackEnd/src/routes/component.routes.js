import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// 🔁 Ruta dinámica para traer cualquier componente por tipo
router.get('/:type', async (req, res) => {
  const { type } = req.params;

  // ✅ Lista de colecciones válidas
  const coleccionesValidas = [
    'processors',
    'gpus',
    'motherboards',
    'rams',
    'ssds',
    'disks',
    'psus',
    'cases',
    'coolers',
    'fans'
  ];

  if (!coleccionesValidas.includes(type)) {
    return res.status(400).json({ error: '❌ Tipo de componente no válido' });
  }

  try {
    const data = await mongoose.connection.collection(type).find().toArray();
    res.json(data);
  } catch (err) {
    console.error(`❌ Error al consultar la colección "${type}"`, err);
    res.status(500).json({ error: '❌ Error al obtener los datos' });
  }
});

export default router;
