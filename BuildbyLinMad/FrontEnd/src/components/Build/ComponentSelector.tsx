import { useState } from 'react';
import ComponentModal from './ComponentModal';

type ComponentType = 'cpu' | 'gpu' | 'ram' | 'motherboard' | 'ssd' | 'psu' | 'case';

interface ComponentSelectorProps {
  label: string;
  type: ComponentType;
  selected: any;
  onSelect: (comp: any) => void;
  build: any;
}

export default function ComponentSelector({ type, selected, onSelect }: ComponentSelectorProps) {
  const [mostrarModal, setMostrarModal] = useState(true);

  if (!mostrarModal) return null;
  return (
    <ComponentModal
      type={type}
      build={selected}
      onClose={() => setMostrarModal(false)} // puedes dejarlo vacío o manejarlo tú
      onSelect={onSelect}
    />
  );
}

