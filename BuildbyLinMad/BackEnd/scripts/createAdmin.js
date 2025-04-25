import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/linmadDB';

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const correo = 'admin@linmad.cl';
  const nombre = 'Administrador';
  const passwordPlano = 'admin123';

  const exists = await User.findOne({ correo });
  if (exists) {
    console.log('⚠️ Ya existe un usuario con ese correo.');
    return mongoose.disconnect();
  }

  const password = await bcrypt.hash(passwordPlano, 10);

  const admin = new User({
    nombre,
    correo,
    password,
    role: 'admin'
  });

  await admin.save();

  console.log('✅ Usuario administrador creado correctamente.');
  await mongoose.disconnect();
}

main();
