import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { newComponentsService, NewComponent } from '../../services/componentService';
import Button from '@mui/material/Button';

export default function NewComponentsSlider() {
  const [components, setComponents] = useState<NewComponent[]>([]);
  const carouselRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  let interval: NodeJS.Timeout;

  // 1. Cargar los componentes nuevos
  newComponentsService
    .getNewComponents()
    .then((data) => {
      setComponents(data);

      // 2. Iniciar scroll automático solo si hay datos
      if (data.length > 0) {
        interval = setInterval(() => {
          if (carouselRef.current) {
            carouselRef.current.scrollBy({
              left: 300,
              behavior: 'smooth',
            });

            const maxScrollLeft =
              carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

            if (carouselRef.current.scrollLeft >= maxScrollLeft - 10) {
              carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            }
          }
        }, 4000);
      }
    })
    .catch(console.error);

  return () => clearInterval(interval);
}, []);

  return (
    <CarouselWrapper>
      <div className="carousel" ref={carouselRef} style={{ padding: '0 1.5rem 1rem 1.5rem' }}>
        {components.map((item) => (
          <section className="product-container product-1" key={item._id}>
            <div className="card">
              <div className="photo">
                <img src={`http://localhost:5000/${item.imagePath}`} alt={item.name} />
              </div>
              <div className="content">
                <div className="title">{item.name}</div>
                <div className="bg-title">{item.name.split(' ')[0]}</div>
                <div className="feature size">
                  <div>precio:</div>
                  <span>${item.price.toLocaleString()}</span>
                </div>
                <div className="feature color">
                  <div>modelo:</div>
                  <span>{item.model || 'N/A'}</span>
                </div>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <Button
                        variant="contained"
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            mt: 1.5,
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
                            '.card:hover &': {
                            opacity: 1,
                            transform: 'translateY(0)',
                            },
                        }}
                        >
                        ver más
                    </Button>

                </a>

              </div>
            </div>
          </section>
        ))}
      </div>
    </CarouselWrapper>
  );
}

const CarouselWrapper = styled.div`
  padding: 0 2rem 2rem 2rem;

  .carousel-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

.carousel {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  scroll-snap-type: x mandatory;

  /* ✂️ eliminar esta línea ↓ */
  /* padding-bottom: 1rem; */

  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

  .carousel::-webkit-scrollbar-thumb {
    background-color: #c4c4c4;
    border-radius: 4px;
  }

  /* Reutiliza tu estilo anterior */
  ${/* pegamos aquí tu StyledWrapper CSS */ ''}
  
  .product-container {
    position: relative;
    scroll-snap-align: start;
    min-width: 290px; /* igual al ancho de la tarjeta */
    flex-shrink: 0;   /* evita que se achiquen */
    }

  .card {
    font-family: Lato, sans-serif;
    position: relative;
    width: 290px;
    height: 400px;
    background: #232323;
    border-radius: 20px;
    overflow: hidden;
  }

  .card:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom right, #7F00FF, #00FFFF);
    clip-path: circle(150px at 80% 20%);
    transition: .5s ease-in-out;
  }

  .card:hover:before {
    clip-path: circle(300px at 80% -20%);
  }

  .title {
    position: relative;
    font-weight: 600;
    letter-spacing: 1px;
    color: #fff;
    margin-top: 12px;
  }

  .bg-title {
    font-size: 10em;
    font-weight: 900;
    font-style: italic;
    color: rgba(255,255,255,.04);
    position: absolute;
    max-width: 120%;
    top: -150%;
    transition: .6s;
  }

  .card:hover .bg-title {
    transform: translateY(60%);
  }

  .photo {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    z-index: 10;
    transition: 0.5s;
  }

  .card:hover .photo {
    top: 0%;
    transform: translateY(0%);
  }

.photo img {
  max-width: 160px;
  max-height: 160px;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.card:hover .photo img {
  transform: scale(1.1);
}

  .content {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100px;
    text-align: center;
    transition: 1s;
    z-index: 5;
  }

  .card:hover .content {
    height: 190px;
  }

  .feature {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 20px;
    transition: .5s;
    visibility: hidden;
    opacity: 0;
  }

  .card:hover .feature {
    visibility: visible;
    opacity: 1;
    transition-delay: .5s;
  }

  .feature div {
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-right: 10px;
  }

  .feature span {
    min-width: 20px;
    font-weight: 600;
    padding: 0 4px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    font-size: 14px;
    display: inline-block;
    color: #111;
    background: #fff;
    margin: 0 5px;
    transition: .4s;
    border-radius: 4px;
    cursor: default;
  }

  .btn-buy {
    display: inline-block;
    padding: 10px 20px;
    background: #fff;
    border: none;
    border-radius: 4px;
    margin-top: 10px;
    font-weight: 600;
    color: #111;
    opacity: 0;
    transform: translateY(50px);
    transition: 0.5s;
    cursor: pointer;
  }

  .card:hover .btn-buy {
    opacity: 1;
    transform: translateY(0px);
    transition-delay: 0.5s;
  }

  .card:hover .btn-buy:hover {
    background: var(--product-color);
    transition-delay: 0;
  }
`;
