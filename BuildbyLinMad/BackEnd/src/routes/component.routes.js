import express from 'express';
import Test from '../models/Test.js';

const router = express.Router();

// Ruta GET que guarda un documento en MongoDB
router.get('/guardar', async (req, res) => {
  try {
    const nuevoTest = new Test({ nombre: 'Guardado desde ruta de prueba' });
    await nuevoTest.save();
    res.json({ message: '✅ Documento guardado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Error al guardar' });
  }
});



export default router;
