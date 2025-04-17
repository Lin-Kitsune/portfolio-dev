import { useState } from 'react';
import axios from 'axios';
import './register.css';

export default function Register({ onClose, onLoginClick }) {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: '',
  });
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      setMessage(res.data.message);
      setForm({ nombre: '', correo: '', password: '', confirmPassword: ''});
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error al registrar');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-fondo">
      <div className="register-modal relative w-[90%] max-w-[360px] bg-grisCard bg-opacity-80 backdrop-blur-xl border border-primario/40 rounded-2xl p-6 shadow-xl text-blancoHueso">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 text-white hover:text-hover transition-colors duration-300 p-0 bg-transparent border-none outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Título */}
        <h2 className="text-3xl font-extrabold text-center mb-6">
          <span className="text-white">Crear</span>{' '}
          <span className="text-primario">Cuenta</span>
        </h2>

        {/* Mensaje */}
        {message && <p className="mb-4 text-center text-sm text-acento">{message}</p>}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[320px] mx-auto">
          
          {/* Nombre */}
          <div className="input-wrapper relative z-0 w-full">
            <input
              type="text"
              name="nombre"
              required
              value={form.nombre}
              onChange={handleChange}
              placeholder=" "
              className="peer block w-full appearance-none border-0 border-b-2 border-acento bg-transparent py-2.5 pr-15 text-sm text-white focus:border-primario focus:outline-none focus:ring-0"
            />
            {form.nombre === '' && (
              <label
                htmlFor="nombre"
                className="absolute left-0 text-sm text-acento duration-300 transform -translate-y-5 scale-75 top-2 z-10 peer-focus:text-primario"
              >
                Nombre completo
              </label>
            )}
          </div>

          {/* Correo */}
          <div className="input-wrapper relative z-0 w-full">
              <input
                type="email"
                name="correo"
                required
                value={form.correo}
                onChange={handleChange}
                placeholder=" "
                className="peer block w-full appearance-none border-0 border-b-2 border-acento bg-transparent py-2.5 pr-15 px-0 text-sm text-white focus:border-primario focus:outline-none focus:ring-0"
              />
              {form.correo === '' && (
                <label
                  htmlFor="correo"
                  className="absolute left-0 text-sm text-acento duration-300 transform -translate-y-5 scale-75 top-2 z-10 peer-focus:text-primario"
                >
                  Correo electrónico
                </label>
              )}
              <span className="absolute right-2 top-2.5 pointer-events-none ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5z" />
                </svg>
              </span>
            </div>

          {/* Contraseña */}
          <div className="input-wrapper relative z-0 w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder=" "
                className="peer block w-full appearance-none border-0 border-b-2 border-acento bg-transparent py-2.5 pr-15 px-0 text-sm text-white focus:border-primario focus:outline-none focus:ring-0"
              />
              {form.password === '' && (
                <label
                  htmlFor="password"
                  className="absolute left-0 text-sm text-acento duration-300 transform -translate-y-5 scale-75 top-2 z-10 peer-focus:text-primario"
                >
                  Contraseña
                </label>
              )}
              <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2.5 text-acento peer-focus:text-primario transition-colors duration-300 cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      className="w-5 h-5 fill-current"
                    >
                      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                        <path d="M10.12 10.827l4.026 4.027a.5.5 0 0 0 .708-.708l-13-13a.5.5 0 1 0-.708.708l3.23 3.23A6 6 0 0 0 3.2 6.182a6.7 6.7 0 0 0-1.117 1.982c-.021.061-.047.145-.047.145l-.018.062s-.076.497.355.611a.5.5 0 0 0 .611-.355l.001-.003l.008-.025l.035-.109a5.7 5.7 0 0 1 .945-1.674a5 5 0 0 1 1.124-1.014L6.675 7.38a2.5 2.5 0 1 0 3.446 3.446m-3.8-6.628l.854.854Q7.564 5 8 5c2.044 0 3.286.912 4.028 1.817a5.7 5.7 0 0 1 .945 1.674q.025.073.035.109l.008.025v.003l.001.001a.5.5 0 0 0 .966-.257v-.003l-.001-.004l-.004-.013a2 2 0 0 0-.06-.187a6.7 6.7 0 0 0-1.117-1.982C11.905 5.089 10.396 4 8.002 4c-.618 0-1.177.072-1.681.199"/>
                      </g>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 fill-current"
                    >
                      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                        <path d="M3 13c3.6-8 14.4-8 18 0" />
                        <path d="M12 17a3 3 0 1 1 0-6a3 3 0 0 1 0 6" />
                      </g>
                    </svg>
                  )}
                </span>
            </div>
            {/* Confirme contarsena */}
            <div className="input-wrapper relative z-0 w-full">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repetir contraseña"
                required
                className="peer block w-full appearance-none border-0 border-b-2 border-acento bg-transparent py-2.5 pr-15 px-0 text-sm text-white focus:border-primario focus:outline-none focus:ring-0 placeholder-transparent"
              />
              {form.confirmPassword === '' && (
                <label
                  htmlFor="confirmPassword"
                  className="absolute left-0 text-sm text-acento duration-300 transform -translate-y-5 scale-75 top-2 z-10 peer-focus:text-primario"
                >
                  Repetir contraseña
                </label>
              )}
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2.5 text-acento cursor-pointer transition-colors duration-300 peer-focus:text-primario"
              >
                {showConfirmPassword ? (
                  // Ojo cerrado
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    className="w-5 h-5 fill-current"
                  >
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                      <path d="M10.12 10.827l4.026 4.027a.5.5 0 0 0 .708-.708l-13-13a.5.5 0 1 0-.708.708l3.23 3.23A6 6 0 0 0 3.2 6.182a6.7 6.7 0 0 0-1.117 1.982c-.021.061-.047.145-.047.145l-.018.062s-.076.497.355.611a.5.5 0 0 0 .611-.355l.001-.003l.008-.025l.035-.109a5.7 5.7 0 0 1 .945-1.674a5 5 0 0 1 1.124-1.014L6.675 7.38a2.5 2.5 0 1 0 3.446 3.446m-3.8-6.628l.854.854Q7.564 5 8 5c2.044 0 3.286.912 4.028 1.817a5.7 5.7 0 0 1 .945 1.674q.025.073.035.109l.008.025v.003l.001.001a.5.5 0 0 0 .966-.257v-.003l-.001-.004l-.004-.013a2 2 0 0 0-.06-.187a6.7 6.7 0 0 0-1.117-1.982C11.905 5.089 10.396 4 8.002 4c-.618 0-1.177.072-1.681.199"/>
                    </g>
                  </svg>
                ) : (
                  // Ojo abierto
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-current"
                  >
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                      <path d="M3 13c3.6-8 14.4-8 18 0" />
                      <path d="M12 17a3 3 0 1 1 0-6a3 3 0 0 1 0 6" />
                    </g>
                  </svg>
                )}
              </span>
            </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-primario hover:bg-hover font-bold text-white rounded-lg text-sm px-5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-0 shadow-none border-none register-btn mt-4"
          >
            REGISTRARSE
          </button>
        </form>

        <p className="text-sm mt-6 text-center text-textoSecundario">
          ¿Ya tienes cuenta?{' '}
          <span
            className="underline cursor-pointer hover:text-white"
            onClick={() => {
              onClose();
              onLoginClick();
            }}
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}
