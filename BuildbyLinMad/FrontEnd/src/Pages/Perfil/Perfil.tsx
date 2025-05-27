import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../Auth/Login/Login.css';
import Button from '@mui/material/Button';

function Perfil({ onClose }) {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (data) {
      setUsuario(JSON.parse(data));
    }
  }, []);

const handleLogout = () => {
    localStorage.removeItem('usuario');
    window.location.reload();
  };

  if (!usuario) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0D0D0D] text-[#F4F4F5]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#7F00FF] mb-4">No has iniciado sesión</h2>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{
              mt: 3,
              backgroundColor: '#7F00FF',
              '&:hover': { backgroundColor: '#5A32A3' },
              color: '#fff',
              textTransform: 'none',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          >
            Ir al inicio
          </Button>

        </div>
      </main>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-fondo">
      <div className="relative w-[90%] max-w-[420px] bg-grisCard bg-opacity-80 backdrop-blur-xl border border-primario/40 rounded-2xl p-6 shadow-xl text-blancoHueso animate-fadeIn">

        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 text-white hover:text-hover transition-colors duration-300 p-0 bg-transparent border-none outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="fill-current"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#7F00FF] bg-opacity-40 p-2 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#FFFFFF" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#C28BFF]">Mi Perfil</h2>
        </div>
        <p className="text-sm text-[#C2B9FF] mt-[-8px]">Área de usuario LinMad</p>

        <div className="h-px bg-white/10 my-4"></div>
        {/* Datos usuario */}
        <div className="space-y-5">
          <div>
            <label className="text-sm text-acento font-bold uppercase tracking-wide">Nombre</label>
            <p className="text-lg font-semibold">{usuario.nombre}</p>
          </div>
          <div>
            <label className="text-sm text-acento font-bold uppercase tracking-wide">Correo electrónico</label>
            <p className="text-lg font-semibold">{usuario.correo}</p>
          </div>
          <div>
            <label className="text-sm text-acento font-bold uppercase tracking-wide">Usuario desde</label>
            <p className="text-lg font-semibold">{new Date().toLocaleDateString('es-CL')}</p>
          </div>
        </div>

        {/* Botón */}
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            mt: 5,
            backgroundColor: '#7F00FF',
            '&:hover': { backgroundColor: '#5A32A3' },
            color: '#fff',
            textTransform: 'none',
            fontWeight: 'bold',
            width: '100%',
            py: 1.5,
            fontSize: '0.875rem',
            borderRadius: '8px'
          }}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

export default Perfil;
