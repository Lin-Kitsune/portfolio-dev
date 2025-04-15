import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

// 📌 Ruta de Registro
router.post('/register', async (req, res) => {
  const { nombre, correo, password } = req.body;

  try {
    const existingUser = await User.findOne({ correo });
    if (existingUser) return res.status(400).json({ message: 'Correo ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      correo,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: '✅ Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ message: '❌ Error al registrar usuario', error: err.message });
  }
});

// 📌 Ruta de Login
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
    const user = await User.findOne({ correo });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    res.status(200).json({ message: '🔓 Login exitoso', user: { id: user._id, nombre: user.nombre } });
  } catch (err) {
    res.status(500).json({ message: '❌ Error al iniciar sesión', error: err.message });
  }
});

export default router;
