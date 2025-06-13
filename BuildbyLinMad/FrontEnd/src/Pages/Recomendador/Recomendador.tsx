import { useEffect, useState } from 'react';
import { buildService } from '../../services/buildService';
import { recomendarMejoras } from '../../services/recommenderService';
import { Select, MenuItem } from '@mui/material';
import './Recomendador.css'; // si usas fondo animado como en historial
import RecomendacionCard from './RecomendacionCard';
import { MdInsights } from 'react-icons/md';
import { FaMicrochip, FaMemory, FaVideo } from 'react-icons/fa';

const ICONOS_POR_TIPO: Record<string, JSX.Element> = {
  CPU: <FaMicrochip className="text-white text-xl" />,
  GPU: <FaVideo className="text-white text-xl" />,
  RAM: <FaMemory className="text-white text-xl" />,
};

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
    console.log(' Build seleccionada:', build);
    setSelectedBuild(build);
    setRecomendaciones([]);
    setLoading(true);
    const mejoras = await recomendarMejoras(build);
    setRecomendaciones(mejoras);
    setLoading(false);
  };

  const selectEstilos = {
    backgroundColor: '#0D0D0D',
    borderRadius: '6px',
    color: '#F4F4F5',
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: '#7F00FF',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#00FFFF',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#5A32A3',
    },
    '.MuiSelect-icon': {
      color: '#F4F4F5',
    },
  };

  return (
    <div className="pt-16 px-6 text-white min-h-screen">
      <h2 className="text-white text-3xl md:text-4xl font-extrabold tracking-wide text-center flex items-center justify-center gap-4 uppercase relative mb-4 mt-4">
          <span className="hidden md:inline-block flex-1 h-px bg-white max-w-[120px]" />
            Mejora tus builds
          <span className="hidden md:inline-block flex-1 h-px bg-white max-w-[120px]" />
      </h2>

      <div className="mb-6 max-w-xs">
        <label className="block text-sm font-semibold text-textoSecundario mb-2 uppercase tracking-wide">
          Selecciona una de tus builds:
        </label>
        <Select
          size="small"
          fullWidth
          displayEmpty
          value={selectedBuild?._id || ''}
          onChange={(e) => handleSeleccionarBuild(e.target.value)}
          sx={selectEstilos}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 250, // altura máxima del dropdown
                overflowY: 'auto',
              },
            },
          }}
        >
          <MenuItem value="">
            Selecciona una build
          </MenuItem>
          {builds.map((b) => (
            <MenuItem key={b._id} value={b._id}>
              {b.titulo || `Build #${b._id.slice(-5)}`}
            </MenuItem>
          ))}
        </Select>
      </div>

      {loading && <p className="text-gray-300">Analizando mejoras posibles...</p>}

      {recomendaciones.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {recomendaciones.map((rec, idx) => (
            <div key={idx} className="borde-degradado rounded-[16px] p-[1px]">
              <div className="bg-[#0f0f0f] rounded-[16px] p-4">
                {/* Titulo contenedor */}
                <h3 className="text-xl font-bold text-white mb-4 text-center uppercase tracking-wide flex items-center justify-center gap-2">
                  {ICONOS_POR_TIPO[rec.type] || null}
                  {rec.type} - {rec.motivo.replace(/^⚡\s*/, '')}
                </h3>

                {/* Cards con piezas */}
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                  <RecomendacionCard title="Actual" data={rec.actual} color="text-red-400" />
                  <RecomendacionCard title="Sugerido" data={rec.sugerido} color="text-green-400" />
                </div>

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
