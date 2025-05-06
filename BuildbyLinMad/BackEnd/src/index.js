import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import componentRoutes from './routes/component.routes.js';
import dynamicComponentRoutes from './routes/component.routes.js';
import authRoutes from './routes/auth.routes.js';
import buildRoutes from './routes/build.routes.js';

// Componentes PCs
import caseRoutes from './routes/components/case.routes.js';
import coolerRoutes from './routes/components/cooler.routes.js';
import diskRoutes from './routes/components/disk.routes.js';
import fanRoutes from './routes/components/fan.routes.js';
import gpuRoutes from './routes/components/gpu.routes.js';
import motherboardRoutes from './routes/components/motherboard.routes.js';
import processorRoutes from './routes/components/processor.routes.js';
import psuRoutes from './routes/components/psu.routes.js';
import ramRoutes from './routes/components/ram.routes.js';
import ssdRoutes from './routes/components/ssd.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Necesario para __dirname en ESM (porque usas `import`)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Esto sirve archivos desde /uploads como imágenes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/components', componentRoutes);
app.use('/api/componentes', dynamicComponentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/builds', buildRoutes);

// Componentes pc
app.use('/api/cases', caseRoutes);
app.use('/api/coolers', coolerRoutes);
app.use('/api/disks', diskRoutes);
app.use('/api/fans', fanRoutes);
app.use('/api/gpus', gpuRoutes);
app.use('/api/motherboards', motherboardRoutes);
app.use('/api/processors', processorRoutes);
app.use('/api/psus', psuRoutes);
app.use('/api/rams', ramRoutes);
app.use('/api/ssds', ssdRoutes);

// 🚀 Conexión Mongo + servidor
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Servidor levantado en http://localhost:${PORT}`));
  })
  .catch((err) => console.error('❌ Error de conexión con MongoDB:', err));

