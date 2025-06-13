import React from 'react';
import Button from '@mui/material/Button';
import './RecomendacionCard.css';

type Props = {
  data: any;
  title: string;
  color: string;
};

const BASE_URL = 'http://localhost:5000';

const RecomendacionCard = ({ data, title, color }: Props) => {
  const imageUrl = data?.imagePath
    ? `${BASE_URL}/${data.imagePath.replace(/\\/g, '/')}`
    : '/placeholder.png';

  return (
    <div className="recomend-card">
      <div className="recomend-card-bg"></div>
       {/* Texto de fondo grande */}
      <div className="recomend-bg-title">
        {data?.name?.split(' ')[0] || ''}
      </div>
      {/* Imagen */}
      <div className="recomend-photo">
        <img src={imageUrl} alt={data?.name} />
      </div>
      <div className="recomend-content">
        <div
          className={`recomend-badge--estado ${
            title.toLowerCase() === 'actual'
              ? 'recomend-badge--actual'
              : 'recomend-badge--sugerido'
          }`}
        >
          {title}
        </div>
        <div className="recomend-name">{data?.name}</div>
        <div className="recomend-feature">
          <div className="recomend-label">PRECIO:</div>
          <span className="recomend-badge">
            ${data?.price?.toLocaleString('es-CL')}
          </span>
        </div>

        <div className="recomend-specs">
          {data?.specs?.socket && (
            <div className="recomend-feature">
              <div className="recomend-label">SOCKET:</div>
              <span className="recomend-badge--spec">{data.specs.socket}</span>
            </div>
          )}

          {data?.specs?.vram && (
            <div className="recomend-feature">
              <div className="recomend-label">VRAM:</div>
              <span className="recomend-badge--spec">{data.specs.vram} GB</span>
            </div>
          )}

          {data?.specs?.frecuenciaCore?.base && (
            <>
              <div className="recomend-feature">
                <div className="recomend-label">BASE:</div>
                <span className="recomend-badge--spec">{data.specs.frecuenciaCore.base} MHz</span>
              </div>
              <div className="recomend-feature">
                <div className="recomend-label">BOOST:</div>
                <span className="recomend-badge--spec">{data.specs.frecuenciaCore.boost ?? '-'} MHz</span>
              </div>
            </>
          )}


          {data?.specs?.frequency && (
            <div className="recomend-feature">
              <div className="recomend-label">FRECUENCIA:</div>
              <span className="recomend-badge--spec">{data.specs.frequency} MHz</span>
            </div>
          )}

          {data?.specs?.tipo && (
            <div className="recomend-feature">
              <div className="recomend-label">TIPO:</div>
              <span className="recomend-badge--spec">{data.specs.tipo}</span>
            </div>
          )}
        </div>

        {data?.link && (
          <Button
            variant="contained"
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              mt: 2,
              backgroundColor: '#7F00FF',
              '&:hover': {
                backgroundColor: '#5A32A3',
              },
              color: '#fff',
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '0.875rem',
              opacity: 0,
              transform: 'translateY(50px)',
              transition: '0.5s',
              transitionDelay: '0.3s',
              '.recomend-card:hover &': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            }}
          >
            Ver más
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecomendacionCard;
