import express from 'express';
const router = express.Router();

// ejemplo
router.get('/', (req, res) => {
  res.send('Componentes disponibles');
});

export default router;
