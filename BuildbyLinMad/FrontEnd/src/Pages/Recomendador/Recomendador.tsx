import { useEffect, useState } from 'react';
import { buildService } from '../../services/buildService';
import { recomendarMejoras } from '../../services/recommenderService';
import './Recomendador.css'; // si usas fondo animado como en historial
import RecomendacionCard from './RecomendacionCard';

function Recomendador() {
  const [builds, setBuilds] = useState<any[]>([]);
  const [selectedBuild, setSelectedBuild] = useState<any>(null);
  const [recomendaciones, setRecomendaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario?.id) return;

    buildService.getBuildsByUser(usuario.id).then(data => {
      setBuilds(data || []);
    });
  }, []);

  const handleSeleccionarBuild = async (id: string) => {
    const build = builds.find(b => b._id === id);
    console.log('🔍 Build seleccionada:', build);
    setSelectedBuild(build);
    setRecomendaciones([]);
    setLoading(true);
    const mejoras = await recomendarMejoras(build);
    setRecomendaciones(mejoras);
    setLoading(false);
  };

  return (
    <div className="pt-28 px-8 text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-primario">🔧 Recomendador de Mejora de Builds</h2>

      <div className="mb-6">
        <label className="block text-lg mb-2">Selecciona una de tus builds:</label>
        <select
          onChange={(e) => handleSeleccionarBuild(e.target.value)}
          className="bg-neutral-900 text-white p-2 rounded border border-gray-600 w-full"
        >
          <option value="">-- Elige una build --</option>
          {builds.map((b) => (
            <option key={b._id} value={b._id}>
              {b.titulo || `Build #${b._id.slice(-5)}`}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-300">🔄 Analizando mejoras posibles...</p>}

      {recomendaciones.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {recomendaciones.map((rec, idx) => (
            <div
              key={idx}
              className="bg-neutral-800 rounded-lg shadow-md border border-primario p-4"
            >
              <h3 className="text-xl font-semibold text-primario mb-2">
                {rec.type} - {rec.motivo}
              </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RecomendacionCard title="Actual" data={rec.actual} color="text-red-400" />
                  <RecomendacionCard title="Sugerido" data={rec.sugerido} color="text-green-400" />
                </div>
            </div>
          ))}
        </div>
      )}

      {!loading && selectedBuild && recomendaciones.length === 0 && (
        <p className="text-gray-400 mt-6">No se encontraron mejoras para esta build.</p>
      )}
    </div>
  );
}

export default Recomendador;
