import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import componentRoutes from './routes/component.routes.js';
import dynamicComponentRoutes from './routes/component.routes.js'; // Ruta dinámica: /componentes/:type
import authRoutes from './routes/auth.routes.js';
import buildRoutes from './routes/build.routes.js'; // 🆕 Importa la nueva ruta de builds

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🧩 Rutas API
app.use('/api/components', componentRoutes);
app.use('/api/componentes', dynamicComponentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/builds', buildRoutes); // 🆕 Nueva ruta para guardar/ver builds

// 🚀 Conexión Mongo + servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Servidor levantado en http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ Error de conexión con MongoDB:', err));
