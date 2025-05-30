import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildService } from '../../services/buildService';
import { toast } from 'react-toastify';
import './Historia.css';
import BuildCard from './BuildCard';

function Historial() {
  const [builds, setBuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buildsPersonales, setBuildsPersonales] = useState<any[]>([]);
  const [buildsGuardadas, setBuildsGuardadas] = useState<any[]>([]);
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
        setBuildsPersonales(data.filter((b: any) => !b.source || b.source !== 'guardada'));
        setBuildsGuardadas(data.filter((b: any) => b.source === 'guardada'));

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
    <div className="pt-16 px-6 text-white min-h-screen">
      {/* Builds hechas por el usuario */}
      <section>
        <h2 className="text-white text-2xl md:text-3xl font-bold tracking-wide text-center flex items-center justify-center gap-4 uppercase relative mb-4 mt-4">
          <span className="hidden md:inline-block flex-1 h-px bg-white max-w-[120px]" />
           Tus Builds
          <span className="hidden md:inline-block flex-1 h-px bg-white max-w-[120px]" />
        </h2>
        <div>
          {loading ? (
            <p className="text-gray-300">Cargando builds...</p>
          ) : buildsPersonales.length === 0 ? (
            <p className="text-gray-400">Aún no has creado builds.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 w-full px-6">
              {buildsPersonales.map((build, index) => (
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
      </section>
      {/* Builds guardadas */}
      <section>
        <h2 className="text-white text-2xl md:text-3xl font-bold tracking-wide text-center flex items-center justify-center gap-4 uppercase relative mb-5 mt-9">
          <span className="hidden md:inline-block flex-1 h-px bg-white max-w-[120px]" />
           Builds Guardadas
          <span className="hidden md:inline-block flex-1 h-px bg-white max-w-[120px]" />
        </h2>
        <div>
          {loading ? (
            <p className="text-gray-300">Cargando builds guardadas...</p>
          ) : buildsGuardadas.length === 0 ? (
            <p className="text-gray-400">Aún no has guardado builds de otros usuarios.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 w-full px-6">
              {buildsGuardadas.map((build, index) => (
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
      </section>
    </div>
  );
}

export default Historial;
