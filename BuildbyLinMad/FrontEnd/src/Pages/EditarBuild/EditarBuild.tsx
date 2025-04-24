import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ComponentSelector from '../../components/Build/ComponentSelector';
import { isCompatible } from '../../utils/compatibility';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { buildService } from '../../services/buildService';

function EditarBuild() {
  const location = useLocation();
  const navigate = useNavigate();
  const buildToEdit = location.state?.build;

  const [build, setBuild] = useState<any>({
    cpu: null, gpu: null, motherboard: null, ram: null,
    ssd: null, hdd: null, psu: null, case: null,
    cooler: null, fans: [],
  });

  useEffect(() => {
    if (buildToEdit) {
      setBuild(buildToEdit.components);
    } else {
      toast.error('⚠️ No se encontró ninguna build para editar');
      navigate('/historial');
    }
  }, [buildToEdit]);

  const handleSelect = (type: string, component: any) => {
    const result = isCompatible(type, build, component);

    if (!result.compatible) {
      toast.error(`❌ ${result.reason || 'Componente incompatible'}`);
      return;
    }

    setBuild((prev: any) => ({
      ...prev,
      [type]: component,
    }));
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

  const handleUpdate = async () => {
    try {
      await buildService.actualizarBuild(buildToEdit._id, {
        components: build,
        total,
      });
      toast.success('✅ Build actualizada correctamente');
      navigate('/historial');
    } catch (error) {
      console.error('❌ Error al actualizar build:', error);
      toast.error('No se pudo actualizar la build');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-cafe-macchiato">✏️ Editar Build</h2>
        <button
          onClick={() => navigate('/historial')}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {[
            { key: 'cpu', label: 'Procesador (CPU)' },
            { key: 'gpu', label: 'Tarjeta gráfica (GPU)' },
            { key: 'motherboard', label: 'Placa madre' },
            { key: 'ram', label: 'Memoria RAM' },
            { key: 'ssd', label: 'Almacenamiento SSD' },
            { key: 'hdd', label: 'Disco Duro (HDD)' },
            { key: 'psu', label: 'Fuente de poder (PSU)' },
            { key: 'case', label: 'Gabinete' },
            { key: 'cooler', label: 'Cooler (Opcional)' },
            { key: 'fans', label: 'Ventiladores (Opcional)' },
          ].map((item) => (
            <ComponentSelector
              key={item.key}
              type={item.key}
              label={item.label}
              selected={build[item.key]}
              onSelect={(component) => handleSelect(item.key, component)}
            />
          ))}
        </div>

        <div className="bg-[#1e1e1e] p-6 rounded-xl shadow-md h-fit sticky top-10">
          <h4 className="text-xl font-bold text-tercero mb-4">🧩 Tu Build</h4>
          <ul className="space-y-2 text-sm">
            {Object.entries(build).map(([key, comp]) => (
              <li key={key} className="flex justify-between">
                <span className="capitalize text-gray-300">{key}</span>
                <span className="text-white font-medium">
                  {comp
                    ? comp.quantity
                      ? `${comp.name} ×${comp.quantity}`
                      : comp.name || '✔️'
                    : '—'}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-600 mt-4 pt-4 space-y-4">
            <p className="text-white text-base font-semibold">
              💰 Total estimado: ${total.toLocaleString('es-CL')}
            </p>

            <button
              onClick={handleUpdate}
              className="w-full bg-cafe-macchiato hover:bg-opacity-90 text-white py-2 rounded-lg transition font-medium flex items-center justify-center gap-2"
            >
              <FaSave /> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditarBuild;
