import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Perfil() {
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
    navigate('/login');
    window.location.reload(); // 🔄 Fuerza actualización completa
  };

  if (!usuario) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0D0D0D] text-[#F4F4F5]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#7F00FF] mb-4">No has iniciado sesión</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#7F00FF] text-white px-6 py-2 rounded hover:bg-[#5A32A3] transition"
          >
            Iniciar Sesión
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4 text-[#F4F4F5]">
      <div className="w-full max-w-xl bg-[#1A1A1A] rounded-lg shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[#5A32A3] p-4 rounded-full">
            {/* Ícono tech */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#F4F4F5" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#7F00FF]">Mi Perfil</h2>
            <p className="text-sm text-[#C28BFF]">Área de usuario LinMad</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#C28BFF]">Nombre</label>
            <p className="text-lg font-medium">{usuario.nombre || 'Sin nombre'}</p>
          </div>
          <div>
            <label className="text-sm text-[#C28BFF]">Correo electrónico</label>
            <p className="text-lg font-medium">{usuario.correo || 'No disponible'}</p>
          </div>
          <div>
            <label className="text-sm text-[#C28BFF]">Usuario desde</label>
            <p className="text-lg font-medium">{new Date().toLocaleDateString('es-CL')}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-[#7F00FF] hover:bg-[#5A32A3] text-white py-2 rounded transition font-semibold"
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}

export default Perfil;
