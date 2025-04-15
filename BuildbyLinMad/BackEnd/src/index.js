import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import componentRoutes from './routes/component.routes.js';
import authRoutes from './routes/auth.routes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/components', componentRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor levantado en http://localhost:${PORT}`));
  })
  .catch((err) => console.error('Error de conexión con MongoDB:', err));
