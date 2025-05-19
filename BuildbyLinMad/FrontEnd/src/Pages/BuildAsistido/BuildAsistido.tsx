import { useState, useEffect } from 'react';
import ComponentSelector from '../../components/Build/ComponentSelector';
import { isCompatible } from '../../utils/compatibility';
import { toast } from 'react-toastify';
import 'flowbite';
import { buildService } from '../../services/buildService';
import { Button } from '@mui/material';
import { FlipCard } from './FlipCard'
import { generarPDFBuild } from '../../services/pdfService';
import PdfButton from './PdfButton';

// Puedes reemplazar las imágenes por las tuyas reales luego
const COMPONENTES = [
    {
        key: 'cases',
        label: 'Gabinetes',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACe0lEQVR4nO2au27UQBSGj1JAJJIidASouYhLHy0dFHQgESpQQDwCLMuGPkIgJBAN8BAoCU8ACR2XEkFDSN4AaBKk/ZCjP2jWu3LW2l17PJ5PGq3P2TMX/x6PxzM2i0QiwwJ8oHjWzBcoCfMFogDlYL5AN3NjrKfhvQAWUF1DNWpc3T0K4GC+QIGN8l4AoDHGei5UQYDCMF+gm/gYHCfe9wDr4xtld48COJgvUGCjvBeA+BgsDvMFSqLs845ERO1vAeo+BhAFyM02cB+YVWrJlwvzBfLT6lNGq04CzDo7Srs7POoJtRNgDXhfRwFafcp4UCcBtnXP13YQHAnmC+TjB3APOAMcUjoLNIGNkAXoAI+AAxnlHAQehyrAXcVOAAvAOvBHaV2+CcU0QxPgjXOFVx3/XGrHd2Wvh+g4CAE6wAnFvZDvF7Dj5N+RL+G5fKeUt/ICfFTMceAv8BWYAS45+S8Ch4Fvijkm/+cQBHipmDuyr8i+5eRf0O+8Ym7Lfh2CAEuKacuelr2l+z/Z8NxKTYfbspdCEOBVqge4AuyxmRIgqB7wKTUGXJV9WSJsJsfyXVfMUdlfQhCgA5x0ngLJQDfTp4xkYPwOPJN9ep9yKyNAwrIzD1iRCNeAI0rzOvllZx7wln0wX2Awms5M8GayDgD8VnoH3HBmggO9GlvFBEh4AkxmlDMJPGVAzBfIx4YWRM8BU0rntSbwM09BVlEBRob5AiVhvkAUoIeeL8Wc1962VoEWnfi0Lyv/f8wXGLBh+ntKx9NOli7fsPUUDr00Mr7yXNTI/9CJT/uy8ldCgEIwX6AkzBeIApSD+QJRAJJd3qLZ3VWORCI2DP8AlLcpNg8alh4AAAAASUVORK5CYII='
    },
    { key: 'coolers', label: 'Coolers', icon: '/icon/cooler.png' },
    { key: 'disks', label: 'Discos', icon: '/icon/disk.png' },
    { key: 'fans', label: 'Ventiladores', icon: '/icon/fan.png' },
    { key: 'gpus', label: 'Gráficas', icon: '/icon/fan.png' },
    { key: 'motherboards', label: 'Placa Madre', icon: '/icon/motherboard.png' },
    { key: 'processors', label: 'Procesadores', icon: '/icon/cpu.png' },
    { key: 'psus', label: 'Psu', icon: '/icon/psu.png' },
    { key: 'rams', label: 'Memorias RAM', icon: '/icon/ram.png' },
    { key: 'ssds', label: 'Unidades SSD', icon: '/icon/ssd.png' },
  ];

const nodePositions = COMPONENTES.map((_, i) => {
  const total = COMPONENTES.length;
  const angle = (360 / total) * i - 90; // empieza arriba
  const radius = 360; // más espacio para evitar solapamientos
  const centerX = 400;
  const centerY = 400;
  const x = centerX + radius * Math.cos(angle * (Math.PI / 180));
  const y = centerY + radius * Math.sin(angle * (Math.PI / 180));
  return {
    top: `${y}px`,
    left: `${x}px`,
    angle,
  };
});

function BuildAsistido() {
  const [build, setBuild] = useState({
    cpu: null,
    gpu: null,
    motherboard: null,
    ram: null,
    ssd: null,
    hdd: null,
    psu: null,
    case: null,
    cooler: null,
    fans: [],
  });

  const checklist = [
    { id: 'cpu', label: 'CPU seleccionado' },
    { id: 'motherboard', label: 'Placa madre lista' },
    { id: 'ram', label: 'RAM seleccionada' },
    { id: 'gpu', label: 'GPU seleccionada' },
    { id: 'psu', label: 'Fuente de poder' },
    { id: 'case', label: 'Gabinete' },
    { id: 'ssd', label: 'SSD seleccionado' },
    { id: 'hdd', label: 'Disco HDD (opcional)' },
    { id: 'cooler', label: 'Cooler (opcional)' },
    { id: 'fans', label: 'Ventiladores (opcional)' },
  ];

  const keyMap: Record<string, string> = {
    processors: 'cpu',
    gpus: 'gpu',
    motherboards: 'motherboard',
    rams: 'ram',
    ssds: 'ssd',
    disks: 'hdd',
    psus: 'psu',
    cases: 'case',
    coolers: 'cooler',
    fans: 'fans',
  };

  const [selectorActivo, setSelectorActivo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuildFromBackend = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        if (!usuario?.id) return;

        const builds = await buildService.getBuildsByUser(usuario.id);
        if (builds?.length > 0) {
          setBuild(builds[0].components); // ← último build más reciente
        }
      } catch (error) {
        console.error('❌ Error al cargar build:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuildFromBackend();
  }, []);

  const handleSelect = (type: string, component: any) => {
    const realKey = keyMap[type] || type;

    const result = isCompatible(realKey, build, component);
    if (!result.compatible) {
      toast.error(`❌ ${result.reason || 'Componente incompatible'}`);
      return;
    }

    setBuild((prev) => ({
      ...prev,
      [realKey]: component,
    }));
  };

  const handleClearBuild = () => {
    setBuild({
      cpu: null, gpu: null, motherboard: null, ram: null,
      ssd: null, hdd: null, psu: null, case: null,
      cooler: null, fans: [],
    });
  };

  const total = Object.values(build).reduce((acc, comp) => {
    if (Array.isArray(comp)) {
      return acc + comp.reduce((sum, fan) => sum + (fan.price || 0), 0);
    }
    if (comp?.price) {
      const quantity = comp.quantity || 1;
      return acc + comp.price * quantity;
    }
    return acc;
  }, 0);

  const handleSaveBuild = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      const userId = usuario.id;
  
      if (!userId) {
        toast.error('⚠️ Debes iniciar sesión para guardar tu build');
        return;
      }
  
      const buildData = {
        userId,
        components: build,
        total,
      };
  
      await buildService.guardarBuild(buildData);
      toast.success('✅ Build guardada correctamente');
    } catch (err) {
      console.error('Error al guardar build:', err);
      toast.error('❌ Error al guardar la build');
    }
  };

  const calcularCompatibilidad = () => {
    const keys = Object.keys(build);
    const seleccionados = keys.filter((key) => {
      const value = build[key as keyof typeof build];
      return Array.isArray(value) ? value.length > 0 : !!value;
    });

    // Si no hay nada seleccionado, 0%
    if (seleccionados.length === 0) return 0;

    // Consideramos compatibles si todos los seleccionados lo son con la CPU y Motherboard
    let compatibles = 0;
    for (const key of seleccionados) {
      const componente = build[key as keyof typeof build];
      const validacion = isCompatible(key, build, componente);
      if (validacion.compatible) {
        compatibles++;
      }
    }

    return Math.round((compatibles / seleccionados.length) * 100);
  };

  const calcularConsumo = () => {
    let totalWatts = 0;

    const consumos = {
      cpu: 95,
      gpu: 200,
      motherboard: 50,
      ram: 10,
      ssd: 5,
      hdd: 8,
      psu: 0,
      case: 0,
      cooler: 5,
      fans: 3,
    };

    for (const key in build) {
      const value = build[key];
      if (Array.isArray(value)) {
        totalWatts += value.length * (consumos[key] || 0);
      } else if (value) {
        totalWatts += consumos[key] || 0;
      }
    }

    return totalWatts;
  };
  
  return (
    <>
    <div className="animated-gradient" />
        <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 overflow-hidden">

          {/* Panel izquierdo - Checklist de progreso */}
          <div className="borde-degradado rounded-[16px] p-[2px] ml-3">
            <aside className="rounded-[14px] bg-[#121212] p-4 text-white">
              <h3 className="text-[#9F5BFF] font-bold mb-4">PROGRESO</h3>

            <div className="space-y-3 text-sm">
                {checklist.map(({ id, label }) => (
                  <div key={id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={id}
                      checked={Array.isArray(build[id]) ? build[id].length > 0 : !!build[id]}
                      readOnly
                      className="custom-checkbox w-5 h-5 border-2 border-[#9F5BFF] rounded-lg bg-transparent checked:bg-[#9F5BFF] checked:border-[#9F5BFF] transition-all duration-200"
                    />
                    <label htmlFor={id} className="ml-3 text-white font-medium">{label}</label>
                  </div>
                ))}
              </div>

            </aside>
          </div>

          {/* iconos */}
          <div className="build-layout relative w-[800px] h-[800px] mx-auto flex items-center justify-center">
            {COMPONENTES.map((comp, i) => {
              const selectedComponent = build[keyMap[comp.key] || comp.key];

              return (
                <div
                  key={comp.key}
                  className={`build-node node-${i}`}
                  style={{
                    top: nodePositions[i].top,
                    left: nodePositions[i].left,
                    position: 'absolute',
                    transform: `translate(-50%, -50%)`,
                  }}
                >
                  <FlipCard
                    enabled={
                      Array.isArray(selectedComponent)
                        ? selectedComponent.length > 0
                        : !!selectedComponent
                    }
                    frontContent={
                      <button
                        onClick={() => setSelectorActivo(comp.key)}
                        className="admin-card"
                      >
                        <img src={comp.icon} alt={comp.label} />
                        <span>{selectedComponent?.name || comp.label}</span>
                      </button>
                    }
                    backContent={
                    selectedComponent ? (
                      <div className="back-content">

                        {selectedComponent.link && (
                          <a
                            href={selectedComponent.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="component-link"
                          >
                            Ver link pieza
                          </a>

                        )}

                        <div className="spec-list">
                          {Object.entries(selectedComponent.specs || {})
                          .filter(([key]) => 
                            key !== 'capacidadPorModulo' 
                            && key !== 'cantidad'  
                            && key !== 'voltaje'
                            && key !== 'certificacion'
                            && key !== 'chipset'
                            && key !== 'memorias'
                            && key !== 'memoria'
                            && key !== 'rpm'
                            && key !== 'poseeDram'
                            && key !== 'fuenteDePoderIncluida'
                            && key !== 'ventiladoresIncluidos'
                            && key !== 'iluminacion'
                            && key !== 'bearing'
                            && key !== 'ubicacionFuente'
                            && key !== 'panelLateral'
                            && key !== 'gpu'
                            && key !== 'frecuenciaCore'
                            && key !== 'frecuenciaMemorias'
                            && key !== 'tipoMemoria'

                          )

                          .slice(0, 5)
                          .map(([key, value]) => (
                            <div key={key} className="spec-line">
                              <span className="spec-key">{key}:</span>
                              <span className="spec-value">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p>Sin selección</p>
                    )
                  }

                  />
                </div>
              );
            })}

            {/* Central */}
            <div
              className="build-center"
              style={{
                background: 'linear-gradient(to bottom right, #7F00FF, #00FFFF)',
                width: '255px',
                height: '255px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '16px',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                textAlign: 'center',
                cursor: 'default',
                transition: 'transform 0.2s ease-in-out',
                padding: '1rem',
                gap: '0.5rem',
              }}
            >
              <h4 style={{ margin: 0 }}>Tu Build</h4>
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAByUlEQVR4nO3YoYsVURSA8WsU12DbXUHEqP+BCAYNFtlkFZPVtE/3WTYYrEaTYBSb2SAsFkWTmMSm1SC4G/QnDybsLjOO973Z+2ZmzweThnPPuR/nXC43pSAIgiAIggqcxBms4wIu4Qqu4yZu4Tbu4h628RhP8BTP8QKvsIP3+IQv+IZfqa8oROorQkCnbOEUpod/pL6iW1aqNU83CcBlhSkpYDqTgIdNReCqEQtoZF++a465gBulcvZSQAmWmbsXhIBDZNk6KnrbAQpRbPchIC21A7b6cBVepoCVtqvw2AVM267CYxfQSLHdh4AUHWCJ3dcLsgUY2aNolgCFKLb7EJCiA8QIHCRrXo6KYgdAjECKEZDTfQpRrP+jA1J0gBiBg2TNyz/YxSbWqm+CPf/JvnxvFKYrAZs1sfdzi8BbAxWwWhO7mlsE3hmogLWa2LO5ReDjfNtoXrNtL10JmNTEPpi32N4g7xCcVI8m69X8Zx+CQxawEDV5z89eivAdH/ASj7AxE3wcBNxpCbk4dgHPWkK2xy7ga0vI51EKwI85wneq1+kTYxDwc4FlXuPc0AXsLrjUrIM2hizgdwfL/Sl2SAZBEARBEKQR8Rfj6v3FNjYTZwAAAABJRU5ErkJggg=="
                alt="Tu Build"
                style={{ width: '85px', height: '85px', margin: 0 }}
              />
              <p style={{ fontSize: '0.85rem', margin: '0', padding: 0 }}>Total estimado:</p>
              <p style={{ fontSize: '1.75rem', margin: '0', padding: 0 }}>${total.toLocaleString('es-CL')}</p>
              <div className="flex justify-center "
                style={{
                  display: 'flex',
                  gap: '0.4rem',
                  marginTop: '0.5rem'
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleClearBuild}
                  sx={{
                    backgroundColor: '#7F00FF',
                    borderColor: '#fff',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Vaciar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveBuild}
                  sx={{
                    backgroundColor: '#7F00FF',
                    '&:hover': { backgroundColor: '#5A32A3' },
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Guardar
                </Button>
              </div>
            </div>

          </div>

          {/* Panel con borde degradado real */}
          <div className="borde-degradado rounded-[16px] p-[1px] mr-8">
            <aside className="rounded-[14px] px-4 py-2 text-white space-y-2">
              <h3 className="text-[#00FFFF] text-base font-bold tracking-wide mb-1">RESUMEN</h3>

              <div className="flex items-center justify-start text-sm gap-x-2">
                <div className="flex items-center text-sm gap-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3a.75.75 0 01.75.75v1.13A6.5 6.5 0 0118.12 10h1.13a.75.75 0 010 1.5h-1.13a6.5 6.5 0 01-7.62 5.12v1.13a.75.75 0 01-1.5 0v-1.13A6.5 6.5 0 015.88 11.5H4.75a.75.75 0 010-1.5h1.13A6.5 6.5 0 019.75 4.88V3.75A.75.75 0 019.75 3z" />
                  </svg>
                  <span className="text-white">Compatibilidad:</span>
                </div>
                {(() => {
                  const compatibilidad = calcularCompatibilidad();
                  return (
                    <span className={`font-semibold ${
                      compatibilidad === 100
                        ? 'text-green-300'
                        : compatibilidad >= 50
                        ? 'text-yellow-300'
                        : 'text-red-400'
                    }`}>
                      {compatibilidad}%
                    </span>
                  );
                })()}
              </div>

              <div className="flex items-center justify-start text-sm gap-x-2">
                <div className="flex items-center text-sm gap-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-white">Consumo estimado:</span>
                </div>
                {(() => {
                  const watts = calcularConsumo();
                  const consumoColor =
                    watts < 150
                      ? 'text-green-300'
                      : watts < 300
                      ? 'text-yellow-300'
                      : 'text-red-400';
                  return (
                    <span className={`font-semibold ${consumoColor}`}>
                      {watts}W
                    </span>
                  );
                })()}
              </div>

              <p className="text-xs text-white/50 italic pt-1 max-w-[220px]">
                Asegúrate de que todos los componentes sean compatibles con tu gabinete y fuente.
              </p>

              {/* PDF */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                <PdfButton onClick={() => generarPDFBuild(build, total)} />
              </div>

            </aside>
          </div>

          {selectorActivo && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-[#1e1e1e] p-6 rounded-lg w-[90%] max-w-3xl relative">
                <button
                  onClick={() => setSelectorActivo(null)}
                  className="absolute top-2 right-2 text-white text-lg font-bold hover:text-red-500"
                >
                  ✕
                </button>
                <ComponentSelector
                  type={selectorActivo}
                  label={COMPONENTES.find((c) => c.key === selectorActivo)?.label || ''}
                  selected={build[selectorActivo]}
                  onSelect={(comp) => {
                    handleSelect(selectorActivo, comp);
                    setSelectorActivo(null);
                  }}
                />
              </div>
            </div>
          )}
        </div>
    </>
  );
}

export default BuildAsistido;
