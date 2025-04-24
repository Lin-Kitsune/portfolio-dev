import { useState } from 'react';
import ComponentModal from './ComponentModal';

type ComponentType = 'cpu' | 'gpu' | 'ram' | 'motherboard' | 'ssd' | 'psu' | 'case';

interface ComponentSelectorProps {
  label: string;
  type: ComponentType;
  selected: any;
  onSelect: (comp: any) => void;
}

export default function ComponentSelector({ label, type, selected, onSelect }: ComponentSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#1e1e1e] p-4 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-tercero mb-2">{label}</h3>

      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer h-24 border border-gray-700 border-dashed rounded flex items-center justify-center text-gray-400 text-sm hover:border-primario hover:text-primario transition"
      >
        {selected ? <span>{selected.name}</span> : <span>Selecciona un {label.toLowerCase()}</span>}
      </div>

      {open && (
        <ComponentModal
          type={type}
          onClose={() => setOpen(false)}
          onSelect={(item) => {
            onSelect(item);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
