import React from 'react';

type Props = {
  data: any;
  title: string;
  color: string;
};

const BASE_URL = 'http://localhost:5000'; // puedes moverlo a env si prefieres

const RecomendacionCard = ({ data, title, color }: Props) => {
  const imageUrl = data?.imagePath
    ? `${BASE_URL}/${data.imagePath.replace(/\\/g, '/')}`
    : '/placeholder.png';

  return (
    <div className="bg-neutral-900 rounded-lg shadow-md border p-4 flex flex-col items-center">
      <h3 className={`text-lg font-bold mb-2 ${color}`}>{title}</h3>
      <img
        src={imageUrl}
        alt={data?.name}
        className="w-32 h-32 object-contain rounded mb-3"
      />
      <p className="font-semibold text-center text-white">{data?.name}</p>
      <p className="text-sm text-gray-400 mt-1">${data?.price?.toLocaleString('es-CL')}</p>
      <div className="text-xs text-gray-300 mt-2 space-y-1 w-full text-left">
        {data?.specs?.socket && <p><strong>Socket:</strong> {data.specs.socket}</p>}
        {data?.specs?.vram && <p><strong>VRAM:</strong> {data.specs.vram} GB</p>}
        {data?.specs?.frecuenciaCore?.base && (
          <p>
            <strong>Base:</strong> {data.specs.frecuenciaCore.base} MHz |{' '}
            <strong>Boost:</strong> {data.specs.frecuenciaCore.boost ?? '-'}
          </p>
        )}
        {data?.specs?.frequency && (
          <p><strong>Frecuencia:</strong> {data.specs.frequency} MHz</p>
        )}
        {data?.specs?.tipo && <p><strong>Tipo:</strong> {data.specs.tipo}</p>}
      </div>
      {data?.link && (
        <a
          href={data.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-sm text-blue-400 hover:underline"
        >
          Ver producto
        </a>
      )}
    </div>
  );
};

export default RecomendacionCard;
