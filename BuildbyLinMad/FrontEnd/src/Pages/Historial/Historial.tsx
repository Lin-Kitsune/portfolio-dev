import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildService } from '../../services/buildService';
import { toast } from 'react-toastify';
import { FaTrashAlt, FaEdit, FaClock } from 'react-icons/fa';

function Historial() {
  const [builds, setBuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const userId = usuario.id;

        if (!userId) {
          toast.error('⚠️ Debes iniciar sesión para ver tu historial');
          return;
        }

        const data = await buildService.getBuildsByUser(userId);
        setBuilds(data);
      } catch (err) {
        console.error('❌ Error al obtener builds:', err);
        toast.error('Error al cargar tu historial de builds');
      } finally {
        setLoading(false);
      }
    };

    fetchBuilds();
  }, []);

  const eliminarBuild = async (id: string) => {
    try {
      await buildService.eliminarBuild(id);
      setBuilds(builds.filter((b) => b._id !== id));
      toast.success('🗑️ Build eliminada correctamente');
    } catch (error) {
      console.error('❌ Error al eliminar build:', error);
      toast.error('No se pudo eliminar la build');
    }
  };

  const editarBuild = (build: any) => {
    navigate('/editar-build', { state: { build } });
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#121212]">
      <h2 className="text-3xl font-bold text-cafe-macchiato mb-6">
        📂 Historial de Builds
      </h2>

      {loading ? (
        <p className="text-gray-300">Cargando builds...</p>
      ) : builds.length === 0 ? (
        <p className="text-gray-400">Aún no has guardado builds.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {builds.map((build, index) => (
            <div
              key={index}
              className="bg-[#1e1e1e] border border-[#2f2f2f] rounded-xl p-5 shadow-lg hover:shadow-[#a67b5b88] transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-primario">
                  🧩 Build #{index + 1}
                </h3>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <FaClock className="text-cafe-macchiato" />
                  {new Date(build.createdAt).toLocaleString('es-CL')}
                </p>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm mb-4">
                {Object.entries(build.components).map(([key, comp]: any) =>
                  comp ? (
                    <li key={key} className="flex gap-1">
                      <span className="capitalize text-[#bbb] font-semibold">{key}:</span>
                      <span className="text-white">
                        {comp.name}
                        {comp.quantity ? ` ×${comp.quantity}` : ''}
                      </span>
                    </li>
                  ) : null
                )}
              </ul>

              <div className="flex justify-between items-center mt-4">
                <span className="text-green-400 font-bold text-base">
                  💰 Total: ${build.total.toLocaleString('es-CL')}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => editarBuild(build)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg flex items-center gap-2 text-sm font-semibold shadow"
                  >
                    <FaEdit /> Editar
                  </button>
                  <button
                    onClick={() => eliminarBuild(build._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 text-sm font-semibold shadow"
                  >
                    <FaTrashAlt /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Historial;
