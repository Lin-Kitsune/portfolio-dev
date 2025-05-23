import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildService } from '../../services/buildService';
import { toast } from 'react-toastify';
import './Historia.css';
import BuildCard from './BuildCard';

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
          toast.error('Debes iniciar sesión para ver tu historial');
          return;
        }

        const data = await buildService.getBuildsByUser(userId);
        // 🔍 Imprimir los IDs y títulos de las builds
        console.log("Builds del usuario:");
        data.forEach((build: any, index: number) => {
          console.log(`Build ${index + 1}: ID = ${build._id}, título = ${build.title}`);
        });
        setBuilds(data);
      } catch (err) {
        console.error('Error al obtener builds:', err);
        toast.error('Error al cargar tu historial de builds');
      } finally {
        setLoading(false);
      }
    };

    fetchBuilds();
  }, []);

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const isAdmin = usuario?.role === 'admin';

  const eliminarBuild = async (id: string) => {
    try {
      await buildService.eliminarBuild(id);
      setBuilds(builds.filter((b) => b._id !== id));
      toast.success('Build eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar build:', error);
      toast.error('No se pudo eliminar la build');
    }
  };

  const editarBuild = (build: any) => {
    navigate('/editar-build', { state: { build } });
  };

  const toggleRecomendada = async (id: string, estadoActual: boolean) => {
    try {
      if (estadoActual) {
        await buildService.desmarcarBuildComoRecomendada(id);
        toast.info('Build desmarcada como recomendada');
      } else {
        await buildService.marcarBuildComoRecomendada(id);
        toast.success('Build marcada como recomendada');
      }

      setBuilds((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, recommended: !estadoActual } : b
        )
      );
    } catch (error) {
      console.error('Error al actualizar recomendación:', error);
      toast.error('No se pudo actualizar la recomendación');
    }
  };

  return (
    <div className="pt-28 px-8 text-white min-h-screen">

      {loading ? (
        <p className="text-gray-300">Cargando builds...</p>
      ) : builds.length === 0 ? (
        <p className="text-gray-400">Aún no has guardado builds.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 w-full px-6">
          {builds.map((build, index) => (
            <BuildCard
              key={build._id}
              build={build}
              index={index}
              isAdmin={isAdmin}
              onEdit={() => navigate('/build', { state: { build } })}
              onDelete={() => eliminarBuild(build._id)}
              onToggleRecommended={() => toggleRecomendada(build._id, build.recommended)}
            />
          ))}
        </div>

      )}
    </div>
  );
}

export default Historial;
