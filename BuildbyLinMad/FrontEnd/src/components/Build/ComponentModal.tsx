import { useEffect, useState } from 'react';
import { componentService } from '../componentService';
import { isCompatible } from '../../utils/compatibility';
import { toast } from 'react-toastify';

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

  useEffect(() => {
    const fetchData = async () => {
      const result = await componentService.getByType(type);

      const filteredItems = result.filter((item) => {
        const specs = item.specs || {};
        const socket = specs.socket?.toUpperCase()?.trim() || '';
        const isIntel = item.name?.toLowerCase().includes('intel');
        const isAMD = item.name?.toLowerCase().includes('amd');

        if (type === 'cpu') {
          if (isIntel && (!/^LGA\d+$/i.test(socket))) {
            console.warn(`❌ CPU descartado: socket inválido → ${item.name}`);
            return false;
          }
          if (isAMD && !(socket === 'AM4' || socket === 'AM5')) {
            console.warn(`❌ CPU AMD descartado: socket no reconocido → ${item.name}`);
            return false;
          }
        }

        const compat = isCompatible(type, build, item);
        if (!compat.compatible) {
          console.warn(`❌ ${type.toUpperCase()} descartado por compatibilidad → ${item.name}`);
          return false;
        }

        return true;
      });

      setItems(filteredItems);
    };

    fetchData();
  }, [type, build]);

  const handleSelect = (item: any) => {
    const compat = isCompatible(type, build, item);

    if (!compat.compatible) {
      toast.error(`⚠️ ${compat.reason}`);
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
    switch (type) {
      case 'gpu':
        return (
          <>
            {specs.memoria && <p className="flex items-center gap-2"><FaMemory /> Memoria: {formatSpec(specs.memoria)}</p>}
            {specs.frecuenciaCore && <p className="flex items-center gap-2"><FaBolt /> Frec. Core: {formatSpec(specs.frecuenciaCore)}</p>}
            {specs.frecuenciaMemorias && <p className="flex items-center gap-2"><FaBolt /> Frec. Memorias: {formatSpec(specs.frecuenciaMemorias)}</p>}
            {specs.bus && <p className="flex items-center gap-2"><FaProjectDiagram /> Bus: {formatSpec(specs.bus)}</p>}
          </>
        );
      case 'motherboard':
        return (
          <>
            {specs.socket && <p className="flex items-center gap-2"><FaMicrochip /> Socket: {formatSpec(specs.socket)}</p>}
            {specs.chipset && <p className="flex items-center gap-2"><FaCogs /> Chipset: {formatSpec(specs.chipset)}</p>}
            {specs.memorias && <p className="flex items-center gap-2"><FaMemory /> Memorias: {formatSpec(specs.memorias)}</p>}
            {specs.formato && <p className="flex items-center gap-2"><FaProjectDiagram /> Formato: {formatSpec(specs.formato)}</p>}
          </>
        );
      case 'ram':
        return (
          <>
            {specs.capacidad && <p className="flex items-center gap-2"><FaMemory /> Capacidad: {formatSpec(specs.capacidad)}</p>}
            {specs.tipo && <p className="flex items-center gap-2"><FaCogs /> Tipo: {formatSpec(specs.tipo)}</p>}
            {specs.velocidad && <p className="flex items-center gap-2"><FaBolt /> Velocidad: {formatSpec(specs.velocidad)}</p>}
            {specs.formato && <p className="flex items-center gap-2"><FaProjectDiagram /> Formato: {formatSpec(specs.formato)}</p>}
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
      <div className="bg-[#1b1b1b] max-h-[80vh] w-full max-w-5xl rounded-xl p-6 overflow-y-auto relative shadow-xl border border-[#2a2a2a]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-[#2a2a2a] transition"
          aria-label="Cerrar"
        >
          <FiX size={22} />
        </button>
        <h3 className="text-2xl font-bold text-primario mb-6 text-center">
          Selecciona un {type.toUpperCase()}
        </h3>

        {items.length === 0 ? (
          <p className="text-center text-gray-400">No se encontraron componentes.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => handleSelect(item)}
                className="bg-[#242424] p-4 rounded-lg cursor-pointer hover:scale-[1.02] transition transform duration-200 ease-in-out hover:border hover:border-primario border border-transparent shadow-md"
              >
                <h4 className="text-white font-semibold text-lg mb-2 truncate">{item.name}</h4>

                <div className="text-sm text-gray-300 space-y-1">
                  {renderSpecs(item.specs || {})}
                </div>

                <p className="text-base text-tercero font-bold mt-4">
                  ${item.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
