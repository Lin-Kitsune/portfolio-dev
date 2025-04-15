import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ correo: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
  
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const { user } = res.data;
  
      localStorage.setItem('usuario', JSON.stringify(user));
      setMessage('Login exitoso. Redirigiendo...');
      setTimeout(() => {
        navigate('/');
        window.location.reload(); // 🔄
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };
  

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4">
      <div className="w-full max-w-md bg-[#1A1A1A] rounded-lg shadow-lg p-6 text-[#F4F4F5]">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#7F00FF]">
          Iniciar sesión
        </h2>
        {message && (
          <p className="mb-4 text-center text-sm text-[#C28BFF]">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={form.correo}
            onChange={handleChange}
            className="w-full bg-[#0D0D0D] border border-[#5A32A3] text-[#F4F4F5] rounded px-3 py-2 placeholder:text-[#C28BFF] focus:outline-none focus:ring-2 focus:ring-[#7F00FF]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-[#0D0D0D] border border-[#5A32A3] text-[#F4F4F5] rounded px-3 py-2 placeholder:text-[#C28BFF] focus:outline-none focus:ring-2 focus:ring-[#7F00FF]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#7F00FF] text-white py-2 rounded hover:bg-[#5A32A3] transition"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  );
}
