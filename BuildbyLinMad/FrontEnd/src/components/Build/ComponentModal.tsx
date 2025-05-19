import { useEffect, useState } from 'react';
import { componentService } from '../componentService';
import { toast } from 'react-toastify';
import { isCompatible } from '../../utils/compatibility';
import './ComponentModal.css';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


import {
  FaMicrochip, FaBolt, FaCogs, FaMemory, FaProjectDiagram,
} from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

interface ComponentModalProps {
  type: string;
  onClose: () => void;
  onSelect: (comp: any) => void;
  build: any;
}

export default function ComponentModal({ type, onClose, onSelect, build }: ComponentModalProps) {
  const [items, setItems] = useState<any[]>([]);
  const [visible, setVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState({
    precioMin: '',
    precioMax: '',
    
    ssds: {
      capacidad: '',
      formato: '',
      bus: '',
      tipoMemoria: '',
    },

    cases: {
      formato: '',
      iluminacion: '',
      fuenteDePoderIncluida: '',
      ubicacionFuente: '',
      panelLateral: '',
      ventiladoresIncluidos: '',
    },

    coolers: {
      rpm: '',
      flujoAire: '',
      altura: '',
      ruido: '',
    },

    disk: {
      capacidad: '',
      tamaño: '',
      tipo: '',
      bus: '',
      rpm: '',
    },

    ram: {
      capacidad: '',
      tipo: '',
      velocidad: '',
      formato: '',
      voltaje: '',
    },

    psu: {
      potencia: '',
      certificacion: '',
      corriente12V: '',
      modular: '',
      pfcActivo: '',
    },

    processor: {
      socket: '',
    },

    motherboard: {
      socket: '',
      chipset: '',
      tipoMemoria: '',
      formato: '',
    },

    gpu: {
      memoria: '',
      tipoMemoria: '',
      frecuenciaCore: '',
      frecuenciaMemorias: '',
      bus: '',
    },
    
    fans: {
      tamaño: '',
      iluminacion: '',
      bearing: '',
      flujoAireMin: '',
      rpmMin: '',
      ruidoMax: '',
    }


  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const paginatedItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(items.length / itemsPerPage);

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

  const normalizarTipo = (tipo: string) => {
    if (tipo.toLowerCase() === 'ssds') return 'ssd';
    return tipo.toLowerCase();
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await componentService.getByType(normalizarTipo(type));

      const filteredItems = result.filter((item) => {
        const specs = item.specs || {};
        const socket = specs.socket?.toUpperCase()?.trim() || '';
        const isIntel = item.name?.toLowerCase().includes('intel');
        const isAMD = item.name?.toLowerCase().includes('amd');

        if (normalizarTipo(type) === 'cpu') {
          if (isIntel && (!/^LGA\d+$/i.test(socket))) {
            console.warn(`CPU descartado: socket inválido → ${item.name}`);
            return false;
          }
          if (isAMD && !(socket === 'AM4' || socket === 'AM5')) {
            console.warn(`CPU AMD descartado: socket no reconocido → ${item.name}`);
            return false;
          }
        }

        const compat = isCompatible(type, build, item);
        if (!compat.compatible) {
          console.warn(` ${type.toUpperCase()} descartado por compatibilidad → ${item.name}`);
          return false;
        }
        
        return true;
      });
      
      const filtradoPorBusqueda = searchTerm.trim()
        ? filteredItems.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : filteredItems;

      const filtradoFinal = filtradoPorBusqueda.filter((item) => {
        const specs = item.specs || {};
        const precio = item.price || 0;

        // valores numéricos generales
        const rpm = Number(specs.rpm);
        const ruido = parseFloat(specs.ruido?.replace('dB', '').trim());
        const flujoAire = parseFloat(specs.flujoAire?.replace('CFM', '').trim());
        const altura = parseFloat(specs.altura?.replace('mm', '').trim());
        const tamaño = specs.tamaño?.replace(/"/g, '').trim();
        const tipo = specs.tipo?.trim();

        // 🎯 Filtros comunes
        if (filtros.precioMin && precio < parseFloat(filtros.precioMin)) return false;
        if (filtros.precioMax && precio > parseFloat(filtros.precioMax)) return false;

        // 💾 SSD
        if (filtros.ssds?.capacidad && specs.capacidad !== filtros.ssds.capacidad) return false;
        if (filtros.ssds?.formato && specs.formato !== filtros.ssds.formato) return false;
        if (filtros.ssds?.bus && specs.bus !== filtros.ssds.bus) return false;
        if (filtros.ssds?.tipoMemoria && specs.tipoMemoria !== filtros.ssds.tipoMemoria) return false;

        // 🧊 Coolers
        if (filtros.coolers?.rpm && (!rpm || rpm < parseFloat(filtros.coolers.rpm))) return false;
        if (filtros.coolers?.ruido && (!ruido || ruido > parseFloat(filtros.coolers.ruido))) return false;
        if (filtros.coolers?.flujoAire && (!flujoAire || flujoAire < parseFloat(filtros.coolers.flujoAire))) return false;
        if (filtros.coolers?.altura && (!altura || altura > parseFloat(filtros.coolers.altura))) return false;

        // 🧱 Cases
        if (filtros.cases?.formato && specs.formato !== filtros.cases.formato) return false;
        if (filtros.cases?.iluminacion && specs.iluminacion !== filtros.cases.iluminacion) return false;
        if (filtros.cases?.fuenteDePoderIncluida && specs.fuenteDePoderIncluida !== filtros.cases.fuenteDePoderIncluida) return false;
        if (filtros.cases?.ubicacionFuente && specs.ubicacionFuente !== filtros.cases.ubicacionFuente) return false;
        if (filtros.cases?.panelLateral && specs.panelLateral !== filtros.cases.panelLateral) return false;
        if (filtros.cases?.ventiladoresIncluidos && specs.ventiladoresIncluidos !== filtros.cases.ventiladoresIncluidos) return false;

        // 💽 Disk (HDD)
        if (filtros.disk?.capacidad && specs.capacidad !== filtros.disk.capacidad) return false;
        if (filtros.disk?.tamaño && tamaño !== filtros.disk.tamaño) return false;
        if (filtros.disk?.tipo && tipo !== filtros.disk.tipo) return false;
        if (filtros.disk?.bus && specs.bus !== filtros.disk.bus) return false;
        if (filtros.disk?.rpm && rpm !== parseInt(filtros.disk.rpm)) return false;

        // 🧠 RAM
        if (filtros.ram?.capacidad && specs.capacidadPorModulo !== filtros.ram.capacidad) return false;
        if (filtros.ram?.tipo && specs.tipo !== filtros.ram.tipo) return false;
        if (filtros.ram?.velocidad && specs.velocidad !== filtros.ram.velocidad) return false;
        if (filtros.ram?.formato && specs.formato !== filtros.ram.formato) return false;
        if (filtros.ram?.voltaje && parseFloat(specs.voltaje) !== parseFloat(filtros.ram.voltaje)) return false;

        // 🔌 PSU
        if (filtros.psu?.potencia && specs.potencia?.toString() !== filtros.psu.potencia) return false;
        if (filtros.psu?.certificacion && specs.certificacion !== filtros.psu.certificacion) return false;
        if (filtros.psu?.corriente12V && specs.corriente12V?.toString() !== filtros.psu.corriente12V) return false;
        if (filtros.psu?.modular && specs.modular?.toString() !== filtros.psu.modular) return false;
        if (filtros.psu?.pfcActivo && specs.pfcActivo?.toString() !== filtros.psu.pfcActivo) return false;

        // 🧠 processors CPU
        if (filtros.processor?.socket && specs.socket?.trim().toUpperCase() !== filtros.processor.socket) return false;

        // 🧠 Motherboards
        if (filtros.motherboard?.socket && specs.socket !== filtros.motherboard.socket) return false;
        if (filtros.motherboard?.chipset && specs.chipset !== filtros.motherboard.chipset) return false;
        if (filtros.motherboard?.tipoMemoria && specs.memorias?.tipo !== filtros.motherboard.tipoMemoria) return false;
        if (filtros.motherboard?.formato && specs.formato !== filtros.motherboard.formato) return false;

        // GPU
        if (filtros.gpu?.memoria && specs.memoria?.cantidad !== filtros.gpu.memoria) return false;
        if (filtros.gpu?.frecuenciaCore && specs.frecuenciaCore?.base < parseFloat(filtros.gpu.frecuenciaCore)) return false;
        if (filtros.gpu?.frecuenciaMemorias && specs.frecuenciaMemorias < parseFloat(filtros.gpu.frecuenciaMemorias)) return false;
        if (filtros.gpu?.bus && specs.memoria?.bus !== filtros.gpu.bus) return false;

        // FAN
        const ruidoFan = parseFloat(specs.ruido?.replace('dB', '').trim());
        const flujoFan = parseFloat(specs.flujoAire?.replace('CFM', '').trim());
        const rpmFan = Number(specs.rpm);

        if (filtros.fans?.tamaño && specs.tamaño !== filtros.fans.tamaño) return false;
        if (filtros.fans?.iluminacion && specs.iluminacion !== filtros.fans.iluminacion) return false;
        if (filtros.fans?.bearing && specs.bearing !== filtros.fans.bearing) return false;
        if (filtros.fans?.flujoAireMin && (!flujoFan || flujoFan < parseFloat(filtros.fans.flujoAireMin))) return false;
        if (filtros.fans?.rpmMin && (!rpmFan || rpmFan < parseFloat(filtros.fans.rpmMin))) return false;
        if (filtros.fans?.ruidoMax && (!ruidoFan || ruidoFan > parseFloat(filtros.fans.ruidoMax))) return false;


        return true;
      });

      setItems(filtradoFinal);
    };

    fetchData();
  }, [type, build, searchTerm, filtros]);

  const handleSelect = (item: any) => {
    const compat = isCompatible(type, build, item);

    if (!compat.compatible) {
      toast.error(` ${compat.reason}`);
      return;
    }

    // 🧠 Si es RAM, pedimos cantidad
    if (type === 'ram') {
      const cantidadStr = prompt('¿Cuántos módulos deseas agregar?', '2');
      const cantidad = parseInt(cantidadStr || '1', 10);

      if (isNaN(cantidad) || cantidad <= 0) {
        toast.error('Cantidad inválida. Debe ser un número mayor a 0.');
        return;
      }

      onSelect({ ...item, cantidad });
    } else {
      onSelect(item);
    }

    onClose();
  };

  const formatSpec = (value: any) => {
    if (!value) return null;
    return typeof value === 'object' ? Object.values(value).join(' / ') : value;
  };

  const renderSpecs = (specs: any) => {
    // Especificaciones
    switch (normalizarTipo(type)) {
      case 'gpus':
        return (
          <>
            {specs.memoria?.cantidad && <p className="flex items-center gap-2"><FaMemory /> Memoria: {formatSpec(specs.memoria.cantidad)} GB</p>}
            {specs.frecuenciaCore?.base && (
              <p className="flex items-center gap-2"><FaBolt /> Frec. Base: {specs.frecuenciaCore.base} MHz</p>
            )}
            {specs.frecuenciaCore?.boost && (
              <p className="flex items-center gap-2"><FaBolt /> Frec. Boost: {specs.frecuenciaCore.boost} MHz</p>
            )}
            {specs.frecuenciaMemorias && (
              <p className="flex items-center gap-2"><FaBolt /> Frec. Memorias: {specs.frecuenciaMemorias} MHz</p>
            )}
            {specs.memoria?.bus && <p className="flex items-center gap-2"><FaProjectDiagram /> Bus: {formatSpec(specs.memoria.bus)}</p>}
          </>
        );
      case 'motherboards':
      return (
        <>
          {specs.socket && <p className="flex items-center gap-2"><FaMicrochip /> Socket: {formatSpec(specs.socket)}</p>}
          {specs.chipset && <p className="flex items-center gap-2"><FaCogs /> Chipset: {formatSpec(specs.chipset)}</p>}
          {specs.memorias?.tipo && <p className="flex items-center gap-2"><FaMemory /> Memorias: {formatSpec(specs.memorias.tipo)}</p>}
          {specs.formato && <p className="flex items-center gap-2"><FaProjectDiagram /> Formato: {formatSpec(specs.formato)}</p>}
        </>
      );
      case 'rams':
        return (
          <>
            {specs.capacidad && <p className="flex items-center gap-2"><FaMemory /> Capacidad: {formatSpec(specs.capacidad)}</p>}
            {specs.tipo && <p className="flex items-center gap-2"><FaCogs /> Tipo: {formatSpec(specs.tipo)}</p>}
            {specs.velocidad && <p className="flex items-center gap-2"><FaBolt /> Velocidad: {formatSpec(specs.velocidad)}</p>}
            {specs.formato && <p className="flex items-center gap-2"><FaProjectDiagram /> Formato: {formatSpec(specs.formato)}</p>}
          </>
        );
      case 'ssds':
      case 'ssd':
      return (
        <>
          {specs.capacidad && <p className="flex items-center gap-2"><FaMemory /> Capacidad: {formatSpec(specs.capacidad)}</p>}
          {specs.formato && <p className="flex items-center gap-2"><FaCogs /> Formato: {formatSpec(specs.formato)}</p>}
          {specs.bus && <p className="flex items-center gap-2"><FaProjectDiagram /> Bus: {formatSpec(specs.bus)}</p>}
          {specs.tipoMemoria && <p className="flex items-center gap-2"><FaMicrochip /> Tipo: {formatSpec(specs.tipoMemoria)}</p>}
        </>
      );
      case 'cases':
      return (
        <>
          {specs.formato && (
            <p className="flex items-center gap-2">
              <FaProjectDiagram /> Formato: {formatSpec(specs.formato)}
            </p>
          )}
          {specs.iluminacion && (
            <p className="flex items-center gap-2">
              <FaBolt /> Iluminación: {formatSpec(specs.iluminacion)}
            </p>
          )}
          {specs.fuenteDePoderIncluida !== undefined && (
            <p className="flex items-center gap-2">
              <FaCogs /> Fuente incluida: {specs.fuenteDePoderIncluida ? 'Sí' : 'No'}
            </p>
          )}
          {specs.panelLateral && (
            <p className="flex items-center gap-2">
              <FaMemory /> Panel lateral: {formatSpec(specs.panelLateral)}
            </p>
          )}
          {specs.ubicacionFuente && (
            <p className="flex items-center gap-2">
              <FaProjectDiagram /> Ubicación fuente: {formatSpec(specs.ubicacionFuente)}
            </p>
          )}
          {specs.ventiladoresIncluidos !== undefined && (
            <p className="flex items-center gap-2">
              <FaCogs /> Ventiladores incluidos: {specs.ventiladoresIncluidos ? 'Sí' : 'No'}
            </p>
          )}
        </>
      );
      case 'coolers':
        return (
          <>
            {specs.rpm && <p className="flex items-center gap-2"><FaBolt /> RPM: {specs.rpm}</p>}
            {specs.ruido && <p className="flex items-center gap-2"><FaCogs /> Ruido: {specs.ruido}</p>}
            {specs.flujoAire && <p className="flex items-center gap-2"><FaProjectDiagram /> Flujo: {specs.flujoAire}</p>}
            {specs.altura && <p className="flex items-center gap-2"><FaMemory /> Altura: {specs.altura}</p>}
          </>
        );
      case 'disks':
        return (
          <>
            {specs.tipo && <p className="flex items-center gap-2"><FaMicrochip /> Tipo: {specs.tipo}</p>}
            {specs.capacidad && <p className="flex items-center gap-2"><FaMemory /> Capacidad: {specs.capacidad}</p>}
            {specs.rpm && <p className="flex items-center gap-2"><FaBolt /> RPM: {specs.rpm}</p>}
            {specs.tamaño && <p className="flex items-center gap-2"><FaProjectDiagram /> Tamaño: {specs.tamaño}</p>}
            {specs.bus && <p className="flex items-center gap-2"><FaCogs /> Bus: {specs.bus}</p>}
          </>
        );
      case 'psus':
      return (
        <>
          {specs.potencia && <p className="flex items-center gap-2"><FaBolt /> Potencia: {specs.potencia} W</p>}
          {specs.certificacion && <p className="flex items-center gap-2"><FaCogs /> Certificación: {specs.certificacion}</p>}
          {specs.corriente12V && <p className="flex items-center gap-2"><FaBolt /> Corriente 12V: {specs.corriente12V} A</p>}
          {specs.modular !== undefined && (
            <p className="flex items-center gap-2">
              <FaMemory /> Modular: {specs.modular ? 'Sí' : 'No'}
            </p>
          )}
          {specs.pfcActivo !== undefined && (
            <p className="flex items-center gap-2">
              <FaMicrochip /> PFC Activo: {specs.pfcActivo ? 'Sí' : 'No'}
            </p>
          )}
        </>
      );
      case 'processors':
      return (
        <>
          {specs.socket && <p className="flex items-center gap-2"><FaMicrochip /> Socket: {specs.socket}</p>}
        </>
      );
      case 'fans':
        return (
          <>
            {specs.tamaño && <p className="flex items-center gap-2"><FaCogs /> Tamaño: {formatSpec(specs.tamaño)}</p>}
            {specs.iluminacion && <p className="flex items-center gap-2"><FaBolt /> Iluminación: {formatSpec(specs.iluminacion)}</p>}
            {specs.bearing && <p className="flex items-center gap-2"><FaMemory /> Rodamiento: {formatSpec(specs.bearing)}</p>}
            {specs.flujoAire && <p className="flex items-center gap-2"><FaProjectDiagram /> Flujo Aire: {formatSpec(specs.flujoAire)}</p>}
            {specs.rpm && <p className="flex items-center gap-2"><FaBolt /> RPM: {formatSpec(specs.rpm)}</p>}
            {specs.ruido && <p className="flex items-center gap-2"><FaBolt /> Ruido: {formatSpec(specs.ruido)}</p>}
          </>
        );


      default:
        return (
          <>
            {specs.socket && <p className="flex items-center gap-2"><FaMicrochip /> Socket: {formatSpec(specs.socket)}</p>}
            {specs.frecuenciaBase && specs.frecuenciaBoost && (
              <p className="flex items-center gap-2"><FaBolt /> Frecuencia: {specs.frecuenciaBase} - {specs.frecuenciaBoost} MHz</p>
            )}
            {specs.nucleos && specs.hilos && <p className="flex items-center gap-2"><FaCogs /> Núcleos / Hilos: {specs.nucleos} / {specs.hilos}</p>}
            {specs.cacheL3 && <p className="flex items-center gap-2"><FaMemory /> Cache L3: {formatSpec(specs.cacheL3)}</p>}
            {specs.arquitectura && <p className="flex items-center gap-2"><FaProjectDiagram /> Arquitectura: {formatSpec(specs.arquitectura)}</p>}
          </>
        );
    }
  };

  if (!visible) return null;
  // Filtros
  const renderFiltrosPorTipo = () => {
    switch (normalizarTipo(type)) {
      case 'ssd':
      case 'ssds':
        return (
          <>
            {/* Capacidad */}
            <div>
              <Select
                size="small"
                value={filtros.ssds.capacidad}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    ssds: {
                      ...filtros.ssds,
                      tipoMemoria: e.target.value,
                    },
                  })
                }
                displayEmpty
                fullWidth
                sx={selectEstilos}
              >
                <MenuItem value="">Capacidad</MenuItem>
                <MenuItem value="240 GB">240 GB</MenuItem>
                <MenuItem value="480 GB">480 GB</MenuItem>
                <MenuItem value="500 GB">500 GB</MenuItem>
                <MenuItem value="1 TB">1 TB</MenuItem>
                <MenuItem value="2 TB">2 TB</MenuItem>
              </Select>
            </div>

            {/* Formato */}
            <div>
              <Select
                size="small"
                value={filtros.ssds.formato}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    ssds: {
                      ...filtros.ssds,
                      formato: e.target.value,
                    },
                  })
                }
                displayEmpty
                fullWidth
                sx={selectEstilos}
              >
                <MenuItem value="">Formato</MenuItem>
                <MenuItem value="2.5">2.5"</MenuItem>
                <MenuItem value="M.2 (2280)">M.2 (2280)</MenuItem>
              </Select>
            </div>

            {/* Bus */}
            <div>
              <Select
                size="small"
                value={filtros.ssds.bus}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    ssds: {
                      ...filtros.ssds,
                      bus: e.target.value,
                    },
                  })
                }
                displayEmpty
                fullWidth
                sx={selectEstilos}
              >
                <MenuItem value="">Bus</MenuItem>
                <MenuItem value="SATA 3 (6.0 Gb/s)">SATA 3 (6.0 Gb/s)</MenuItem>
                <MenuItem value="PCIe 4.0 x4">PCIe 4.0 x4</MenuItem>
              </Select>
            </div>

            {/* Tipo de memoria */}
            <div>
              <Select
                size="small"
                value={filtros.ssds.tipoMemoria}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    ssds: {
                      ...filtros.ssds,
                      tipoMemoria: e.target.value,
                    },
                  })
                }
                displayEmpty
                fullWidth
                sx={selectEstilos}
              >
                <MenuItem value="">Tipo Memoria</MenuItem>
                <MenuItem value="NANDTLC">NANDTLC</MenuItem>
                <MenuItem value="NANDQLC">NANDQLC</MenuItem>
              </Select>
            </div>
          </>
        );
      case 'cases':
        return (
          <>
            {/* Formato */}
            <div>
              <Select
                size="small"
                value={filtros.cases.formato}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    cases: {
                      ...filtros.cases,
                      formato: e.target.value,
                    },
                  })
                }
                displayEmpty
                fullWidth
                sx={selectEstilos}
              >
                <MenuItem value="">Formato</MenuItem>
                <MenuItem value="ATX">ATX</MenuItem>
                <MenuItem value="Micro ATX">Micro ATX</MenuItem>
                <MenuItem value="Mini ITX">Mini ITX</MenuItem>
              </Select>
            </div>

            {/* Iluminación */}
            <div>
              <Select
                size="small"
                value={filtros.cases.iluminacion}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    cases: {
                      ...filtros.cases,
                      iluminacion: e.target.value,
                    },
                  })
                }
                displayEmpty
                fullWidth
                sx={selectEstilos}
              >
                <MenuItem value="">Iluminación</MenuItem>
                <MenuItem value="Sí">Sí</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </div>

            {/* Fuente de poder incluida */}
            <div>
              <Select
                size="small"
                value={filtros.cases.fuenteDePoderIncluida}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    cases: {
                      ...filtros.cases,
                      fuenteDePoderIncluida: e.target.value,
                    },
                  })
                }
                displayEmpty
                fullWidth
                sx={selectEstilos}
              >
                <MenuItem value="">Fuente incluida</MenuItem>
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </div>

            {/* Ubicación fuente */}
            <div>
              <Select
                size="small"
                value={filtros.cases.ubicacionFuente}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    cases: {
                      ...filtros.cases,
                      ubicacionFuente: e.target.value,
                    },
                  })
                }
                displayEmpty
                fullWidth
                sx={selectEstilos}
              >
                <MenuItem value="">Ubicación fuente</MenuItem>
                <MenuItem value="Inferior">Inferior</MenuItem>
                <MenuItem value="Superior">Superior</MenuItem>
              </Select>
            </div>

            {/* Panel lateral */}
            <div>
              <Select
                size="small"
                value={filtros.cases.panelLateral}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    cases: {
                      ...filtros.cases,
                      panelLateral: e.target.value,
                    },
                  })
                }
                displayEmpty
                fullWidth
                sx={selectEstilos}
              >
                <MenuItem value="">Panel lateral</MenuItem>
                <MenuItem value="Vidrio templado">Vidrio templado</MenuItem>
                <MenuItem value="Acrílico">Acrílico</MenuItem>
              </Select>
            </div>

            {/* Ventiladores incluidos */}
            <div>
              <Select
                size="small"
                value={filtros.cases.ventiladoresIncluidos}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    cases: {
                      ...filtros.cases,
                      ventiladoresIncluidos: e.target.value,
                    },
                  })
                }
                displayEmpty
                fullWidth
                sx={selectEstilos}
              >
                <MenuItem value="">Ventiladores incluidos</MenuItem>
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </div>
          </>
        );
      case 'coolers':
        return (
          <>
            {/* RPM */}
            <div>
              <TextField
                size="small"
                placeholder="RPM mínima"
                type="number"
                value={filtros.coolers.rpm}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    coolers: {
                      ...filtros.coolers,
                      rpm: e.target.value,
                    },
                  })
                }
                InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
              />
            </div>

            {/* Ruido */}
            <div>
              <TextField
                size="small"
                placeholder="Máximo ruido (dB)"
                type="number"
                value={filtros.coolers.ruido}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    coolers: {
                      ...filtros.coolers,
                      ruido: e.target.value,
                    },
                  })
                }
                InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
              />
            </div>

            {/* Flujo de aire */}
            <div>
              <TextField
                size="small"
                placeholder="Flujo mínimo (CFM)"
                type="number"
                value={filtros.coolers.flujoAire}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    coolers: {
                      ...filtros.coolers,
                      flujoAire: e.target.value,
                    },
                  })
                }
                InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
              />
            </div>

            {/* Altura */}
            <div>
              <TextField
                size="small"
                placeholder="Altura máxima (mm)"
                type="number"
                value={filtros.coolers.altura}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    coolers: {
                      ...filtros.coolers,
                      altura: e.target.value,
                    },
                  })
                }
                InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
              />
            </div>
          </>
        );
      case 'disks':
      return (
        <>
          {/* Tipo de disco */}
          <div>
            <Select
              size="small"
              value={filtros.disk.tipo}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  disk: {
                    ...filtros.disk,
                    tipo: e.target.value,
                  },
                })
              }
              displayEmpty
              fullWidth
              sx={selectEstilos}
            >
              <MenuItem value="">Tipo</MenuItem>
              <MenuItem value="HDD">HDD</MenuItem>
              <MenuItem value="SSD">SSD</MenuItem>
            </Select>
          </div>

          {/* Capacidad */}
          <div>
            <Select
              size="small"
              value={filtros.disk.capacidad}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  disk: {
                    ...filtros.disk,
                    capacidad: e.target.value,
                  },
                })
              }

              displayEmpty
              fullWidth
              sx={selectEstilos}
            >
              <MenuItem value="">Capacidad</MenuItem>
              <MenuItem value="1 TB">1 TB</MenuItem>
              <MenuItem value="2 TB">2 TB</MenuItem>
              <MenuItem value="4 TB">4 TB</MenuItem>
              <MenuItem value="6 TB">6 TB</MenuItem>
              <MenuItem value="8 TB">8 TB</MenuItem>
            </Select>
          </div>

          {/* RPM */}
          <div>
            <TextField
              size="small"
              placeholder="RPM mínima"
              type="number"
              value={filtros.disk.rpm}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  disk: {
                    ...filtros.disk,
                    rpm: e.target.value,
                  },
                })
              }

              InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
              sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
            />
          </div>

          {/* Tamaño */}
          <div>
            <Select
              size="small"
              value={filtros.disk.tamaño}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  disk: {
                    ...filtros.disk,
                    tamaño: e.target.value,
                  },
                })
              }

              displayEmpty
              fullWidth
              sx={selectEstilos}
            >
              <MenuItem value="">Tamaño</MenuItem>
              <MenuItem value="2.5">2.5"</MenuItem>
              <MenuItem value="3.5">3.5"</MenuItem>
            </Select>
          </div>

          {/* Bus */}
          <div>
            <Select
              size="small"
              value={filtros.disk.bus}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  disk: {
                    ...filtros.disk,
                    bus: e.target.value,
                  },
                })
              }

              displayEmpty
              fullWidth
              sx={selectEstilos}
            >
              <MenuItem value="">Bus</MenuItem>
              <MenuItem value="SATA 3 (6.0 Gb/s)">SATA 3 (6.0 Gb/s)</MenuItem>
              <MenuItem value="SATA 2 (3.0 Gb/s)">SATA 2 (3.0 Gb/s)</MenuItem>
            </Select>
          </div>
        </>
      );
      case 'rams':
      return (
        <>
          {/* Capacidad por módulo */}
          <div>
            <Select
              size="small"
              value={filtros.ram.capacidad}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  ram: {
                    ...filtros.ram,
                    capacidad: e.target.value,
                  },
                })
              }
              displayEmpty
              fullWidth
              sx={selectEstilos}
            >
              <MenuItem value="">Capacidad</MenuItem>
              <MenuItem value="8 GB">8 GB</MenuItem>
              <MenuItem value="16 GB">16 GB</MenuItem>
              <MenuItem value="32 GB">32 GB</MenuItem>
            </Select>
          </div>

          {/* Tipo */}
          <div>
            <Select
              size="small"
              value={filtros.ram.tipo}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  ram: {
                    ...filtros.ram,
                    tipo: e.target.value,
                  },
                })
              }
              displayEmpty
              fullWidth
              sx={selectEstilos}
            >
              <MenuItem value="">Tipo</MenuItem>
              <MenuItem value="DDR3">DDR3</MenuItem>
              <MenuItem value="DDR4">DDR4</MenuItem>
              <MenuItem value="DDR4V">DDR4V</MenuItem>
              <MenuItem value="DDR5">DDR5</MenuItem>
            </Select>
          </div>

          {/* Velocidad */}
          <div>
            <TextField
              size="small"
              placeholder="Velocidad mínima (MT/s)"
              type="number"
              value={filtros.ram.velocidad}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  ram: {
                    ...filtros.ram,
                    velocidad: e.target.value,
                  },
                })
              }

              InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
              sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
            />
          </div>

          {/* Formato */}
          <div>
            <Select
              size="small"
              value={filtros.ram.formato}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  ram: {
                    ...filtros.ram,
                    formato: e.target.value,
                  },
                })
              }

              displayEmpty
              fullWidth
              sx={selectEstilos}
            >
              <MenuItem value="">Formato</MenuItem>
              <MenuItem value="DIMMV">DIMMV</MenuItem>
              <MenuItem value="SO-DIMM">SO-DIMM</MenuItem>
            </Select>
          </div>

          {/* Voltaje */}
          <div>
            <TextField
              size="small"
              placeholder="Voltaje máximo"
              type="number"
              value={filtros.ram.voltaje}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  ram: {
                    ...filtros.ram,
                    voltaje: e.target.value,
                  },
                })
              }

              InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
              sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
            />
          </div>
        </>
      );
      case 'psus':
      return (
        <>
          {/* Potencia */}
          <div>
            <Select
              size="small"
              value={filtros.psu.potencia}
              onChange={(e) =>
                setFiltros({ ...filtros, psu: { ...filtros.psu, potencia: e.target.value } })
              }
              displayEmpty
              fullWidth
              sx={selectEstilos}
            >
              <MenuItem value="">Potencia</MenuItem>
              <MenuItem value="550">550 W</MenuItem>
              <MenuItem value="650">650 W</MenuItem>
              <MenuItem value="750">750 W</MenuItem>
              <MenuItem value="850">850 W</MenuItem>
            </Select>
          </div>

          {/* Certificación */}
          <div>
            <Select
              size="small"
              value={filtros.psu.certificacion}
              onChange={(e) =>
                setFiltros({ ...filtros, psu: { ...filtros.psu, certificacion: e.target.value } })
              }
              displayEmpty
              fullWidth
              sx={selectEstilos}
            >
              <MenuItem value="">Certificación</MenuItem>
              <MenuItem value="80PLUS Bronze">80PLUS Bronze</MenuItem>
              <MenuItem value="80PLUS Gold">80PLUS Gold</MenuItem>
              <MenuItem value="80PLUS Platinum">80PLUS Platinum</MenuItem>
            </Select>
          </div>

          {/* Modular */}
          <div>
            <Select
              size="small"
              value={filtros.psu.modular}
              onChange={(e) =>
                setFiltros({ ...filtros, psu: { ...filtros.psu, modular: e.target.value } })
              }
              displayEmpty
              fullWidth
              sx={selectEstilos}
            >
              <MenuItem value="">¿Modular?</MenuItem>
              <MenuItem value="true">Sí</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </div>

          {/* PFC Activo */}
          <div>
            <Select
              size="small"
              value={filtros.psu.pfcActivo}
              onChange={(e) =>
                setFiltros({ ...filtros, psu: { ...filtros.psu, pfcActivo: e.target.value } })
              }
              displayEmpty
              fullWidth
              sx={selectEstilos}
            >
              <MenuItem value="">¿PFC Activo?</MenuItem>
              <MenuItem value="true">Sí</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </div>
        </>
      );
      case 'processors':
      return (
        <>
          {/* Socket */}
          <div>
            <Select
              size="small"
              value={filtros.processor.socket}
              onChange={(e) =>
                setFiltros({
                  ...filtros,
                  processor: {
                    ...filtros.processor,
                    socket: e.target.value,
                  },
                })
              }

              displayEmpty
              fullWidth
              sx={selectEstilos}
            >
              <MenuItem value="">Socket</MenuItem>
              <MenuItem value="AM4">AM4</MenuItem>
              <MenuItem value="AM5">AM5</MenuItem>
              <MenuItem value="LGA1151">LGA1151</MenuItem>
              <MenuItem value="LGA1200">LGA1200</MenuItem>
              <MenuItem value="LGA1700">LGA1700</MenuItem>
            </Select>
          </div>
        </>
      );
      case 'motherboards':
        return (
          <>
            {/* Socket */}
            <div>
              <Select
                size="small"
                value={filtros.motherboard.socket}
                onChange={(e) =>
                  setFiltros({ ...filtros, motherboard: { ...filtros.motherboard, socket: e.target.value } })
                }
                displayEmpty fullWidth sx={selectEstilos}
              >
                <MenuItem value="">Socket</MenuItem>
                <MenuItem value="AM4">AM4</MenuItem>
                <MenuItem value="AM5">AM5</MenuItem>
                <MenuItem value="LGA1200">LGA1200</MenuItem>
                <MenuItem value="LGA1700">LGA1700</MenuItem>
              </Select>
            </div>

            {/* Chipset */}
            <div>
              <TextField
                size="small"
                placeholder="Chipset"
                value={filtros.motherboard.chipset}
                onChange={(e) =>
                  setFiltros({ ...filtros, motherboard: { ...filtros.motherboard, chipset: e.target.value } })
                }
                InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
              />
            </div>

            {/* Tipo Memoria */}
            <div>
              <Select
                size="small"
                value={filtros.motherboard.tipoMemoria}
                onChange={(e) =>
                  setFiltros({ ...filtros, motherboard: { ...filtros.motherboard, tipoMemoria: e.target.value } })
                }
                displayEmpty fullWidth sx={selectEstilos}
              >
                <MenuItem value="">Tipo Memoria</MenuItem>
                <MenuItem value="DDR4">DDR4</MenuItem>
                <MenuItem value="DDR5">DDR5</MenuItem>
              </Select>
            </div>

            {/* Formato */}
            <div>
              <Select
                size="small"
                value={filtros.motherboard.formato}
                onChange={(e) =>
                  setFiltros({ ...filtros, motherboard: { ...filtros.motherboard, formato: e.target.value } })
                }
                displayEmpty fullWidth sx={selectEstilos}
              >
                <MenuItem value="">Formato</MenuItem>
                <MenuItem value="ATX">ATX</MenuItem>
                <MenuItem value="Micro ATX">Micro ATX</MenuItem>
                <MenuItem value="Mini ITX">Mini ITX</MenuItem>
              </Select>
            </div>
          </>
        );
      case 'gpus':
        return (
          <>
            {/* Memoria (cantidad) */}
            <div>
              <Select
                size="small"
                value={filtros.gpu.memoria}
                onChange={(e) => setFiltros({
                  ...filtros,
                  gpu: { ...filtros.gpu, memoria: e.target.value }
                })}
                displayEmpty fullWidth sx={selectEstilos}
              >
                <MenuItem value="">Memoria</MenuItem>
                <MenuItem value="4">4 GB</MenuItem>
                <MenuItem value="6">6 GB</MenuItem>
                <MenuItem value="8">8 GB</MenuItem>
                <MenuItem value="12">12 GB</MenuItem>
                <MenuItem value="16">16 GB</MenuItem>
              </Select>
            </div>

            {/* Frecuencia base mínima */}
            <div>
              <TextField
                size="small"
                placeholder="Frec. Core mín (MHz)"
                type="number"
                value={filtros.gpu.frecuenciaCore}
                onChange={(e) => setFiltros({
                  ...filtros,
                  gpu: { ...filtros.gpu, frecuenciaCore: e.target.value }
                })}
                InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
              />
            </div>

            {/* Frecuencia de memoria mínima */}
            <div>
              <TextField
                size="small"
                placeholder="Frec. Memorias mín (MHz)"
                type="number"
                value={filtros.gpu.frecuenciaMemorias}
                onChange={(e) => setFiltros({
                  ...filtros,
                  gpu: { ...filtros.gpu, frecuenciaMemorias: e.target.value }
                })}
                InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
              />
            </div>

            {/* Bus */}
            <div>
              <Select
                size="small"
                value={filtros.gpu.bus}
                onChange={(e) => setFiltros({
                  ...filtros,
                  gpu: { ...filtros.gpu, bus: e.target.value }
                })}
                displayEmpty fullWidth sx={selectEstilos}
              >
                <MenuItem value="">Bus</MenuItem>
                <MenuItem value="128 bit">128 bit</MenuItem>
                <MenuItem value="192 bit">192 bit</MenuItem>
                <MenuItem value="256 bit">256 bit</MenuItem>
              </Select>
            </div>
          </>
        );
      case 'fans':
        return (
          <>
            {/* Tamaño */}
            <div>
              <Select
                size="small"
                value={filtros.fans.tamaño}
                onChange={(e) => setFiltros({
                  ...filtros,
                  fans: { ...filtros.fans, tamaño: e.target.value }
                })}
                displayEmpty fullWidth sx={selectEstilos}
              >
                <MenuItem value="">Tamaño</MenuItem>
                <MenuItem value="120 mm">120 mm</MenuItem>
                <MenuItem value="140 mm">140 mm</MenuItem>
              </Select>
            </div>

            {/* Iluminación */}
            <div>
              <Select
                size="small"
                value={filtros.fans.iluminacion}
                onChange={(e) => setFiltros({
                  ...filtros,
                  fans: { ...filtros.fans, iluminacion: e.target.value }
                })}
                displayEmpty fullWidth sx={selectEstilos}
              >
                <MenuItem value="">Iluminación</MenuItem>
                <MenuItem value="ARGB / Rainbow">ARGB / Rainbow</MenuItem>
                <MenuItem value="No">Sin Iluminación</MenuItem>
              </Select>
            </div>

            {/* Bearing */}
            <div>
              <Select
                size="small"
                value={filtros.fans.bearing}
                onChange={(e) => setFiltros({
                  ...filtros,
                  fans: { ...filtros.fans, bearing: e.target.value }
                })}
                displayEmpty fullWidth sx={selectEstilos}
              >
                <MenuItem value="">Rodamiento</MenuItem>
                <MenuItem value="Hydraulic Bearing">Hydraulic</MenuItem>
                <MenuItem value="Sleeve Bearing">Sleeve</MenuItem>
                <MenuItem value="Ball Bearing">Ball</MenuItem>
              </Select>
            </div>

            {/* Flujo de aire mínimo */}
            <div>
              <TextField
                size="small"
                placeholder="Flujo aire mín (CFM)"
                type="number"
                value={filtros.fans.flujoAireMin}
                onChange={(e) => setFiltros({
                  ...filtros,
                  fans: { ...filtros.fans, flujoAireMin: e.target.value }
                })}
                InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
              />
            </div>

            {/* RPM mínima */}
            <div>
              <TextField
                size="small"
                placeholder="RPM mín"
                type="number"
                value={filtros.fans.rpmMin}
                onChange={(e) => setFiltros({
                  ...filtros,
                  fans: { ...filtros.fans, rpmMin: e.target.value }
                })}
                InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
              />
            </div>

            {/* Ruido máximo */}
            <div>
              <TextField
                size="small"
                placeholder="Ruido máx (dB)"
                type="number"
                value={filtros.fans.ruidoMax}
                onChange={(e) => setFiltros({
                  ...filtros,
                  fans: { ...filtros.fans, ruidoMax: e.target.value }
                })}
                InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
              />
            </div>
          </>
        );
  
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
      <div className="bg-[#0D0D0D] max-h-[80vh] w-full max-w-5xl rounded-xl p-6 overflow-y-auto relative shadow-xl border border-[#2a2a2a] scroll-estetico">
        {/* Boton de cerrar */}
        <button
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#1A1A1A] border border-[#7F00FF] hover:bg-[#7F00FF] transition"
          aria-label="Cerrar"
        >
          <FiX className="text-white" size={20} />
        </button>

        <h3 className="text-center text-3xl font-extrabold mb-8 uppercase tracking-wide bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400  bg-clip-text">
          Selecciona un {type}
        </h3>

        {/* Buscador y filtro */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {/* Buscador con MUI */}
          <div className="relative w-[250px]">
            <TextField
              size="small"
              label="Buscar por nombre"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch style={{ color: '#C2B9FF', fontSize: '14px' }} />
                  </InputAdornment>
                ),
                style: { color: '#F4F4F5' },
              }}
              InputLabelProps={{
                style: { color: '#C2B9FF' },
              }}
              sx={{
                width: '250px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#7F00FF' },
                  '&:hover fieldset': { borderColor: '#5A32A3' },
                  '&.Mui-focused fieldset': { borderColor: '#00FFFF' },
                },
                '& label.Mui-focused': { color: '#00FFFF' },
              }}
            />
          </div>
          {/* filtro */}
          <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="w-10 h-10 rounded-full bg-[#7F00FF] flex items-center justify-center hover:bg-[#9A1BFF] transition"
              title="Mostrar filtros"
            >
              <FaFilter className="text-white" size={18} />
            </button>

        </div>

        {mostrarFiltros && (
          <div className="max-w-full overflow-hidden bg-[#1A1A1A] p-6 rounded-xl shadow-lg border border-[#7F00FF] text-white mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full text-sm font-medium text-blancoHueso">
              
              {/* Filtro por precio */}
              <div>
                <TextField
                  size="small"
                  placeholder="Precio mínimo"
                  type="number"
                  value={filtros.precioMin}
                  onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
                  InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                  sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
                />
              </div>
              <div>
                <TextField
                  size="small"
                  placeholder="Precio máximo"
                  type="number"
                  value={filtros.precioMax}
                  onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
                  InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                  sx={{ '& fieldset': { borderColor: '#7F00FF' }, width: '100%' }}
                />
              </div>

              {/* Filtros dinámicos */}
              {renderFiltrosPorTipo()}

            </div>
          </div>
        )}

        {items.length === 0 ? (
          <p className="text-center text-gray-400">No se encontraron componentes.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedItems.map((item) => (
                <div
                    key={item._id}
                    onClick={() => handleSelect(item)}
                    className="custom-glow-card"
                >
                {/* Franja rosa izquierda */}
                <div className="w-[6px] h-full bg-gradient-to-b from-pink-500 to-fuchsia-600 rounded-l-xl absolute left-0 top-0" />

                {/* Contenido de la card */}
                <div className="ml-3 flex flex-col w-full justify-between min-h-[120px]">
                  {/* Nombre */}
                  <h4 className="text-white font-semibold text-sm sm:text-base mb-2 truncate">{item.name}</h4>

                  {/* Specs */}
                  <div className="text-xs sm:text-sm text-white/70 space-y-1 mb-3 mt-auto">
                    {renderSpecs(item.specs || {})}
                  </div>

                  {/* Precio */}
                  <div className="mt-auto">
                    <div className="bg-[#7F00FF] text-white text-sm font-semibold px-5 py-1 rounded-2xl inline-block shadow-md">
                      ${item.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    </div>
                  </div>

                </div>

              </div>
            ))}


          </div>
        )}
        {/* Paginación centrada */}
        <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
          {/* Botón Anterior */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 flex items-center justify-center rounded-md font-bold transition-all duration-200
              ${currentPage === 1
                ? 'bg-[#444] text-white opacity-50'
                : 'bg-[#7F00FF] text-white hover:bg-[#5A32A3]'}
              outline-none border-none shadow-none focus:outline-none`}
          >
            ‹
          </button>

          {/* Números de página */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-md font-bold transition-all duration-200
                ${
                  currentPage === page
                    ? 'bg-[#00FFFF] text-[#0D0D0D]'
                    : 'bg-[#7F00FF] text-white hover:bg-[#5A32A3]'
                }
                outline-none border-none shadow-none focus:outline-none`}
            >
              {page}
            </button>
          ))}

          {/* Botón Siguiente */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 flex items-center justify-center rounded-md font-bold transition-all duration-200
              ${currentPage === totalPages
                ? 'bg-[#444] text-white opacity-50'
                : 'bg-[#7F00FF] text-white hover:bg-[#5A32A3]'}
              outline-none border-none shadow-none focus:outline-none`}
          >
            ›
          </button>
        </div>
      </div>

    </div>
  );
}
