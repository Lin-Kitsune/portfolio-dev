import { useRef, useEffect, useState } from 'react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider, KeenSliderInstance } from 'keen-slider/react';
import axios from 'axios';
import { FaDesktop } from 'react-icons/fa';
// Imagenes
import potencia from '../../assets/img/potencia.png';
import recomendacion from '../../assets/img/recomendacion.png';
import disenoProfesional from '../../assets/img/diseno-profesional.png';

// Card

import BuildCard from './BuildCard'; // ajusta la ruta si está en una subcarpeta

function Home() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderInstance = useRef<KeenSliderInstance | null>(null);

  const [refCallback] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    created: (instance) => {
      sliderInstance.current = instance;
    },
  });

  const [buildsRef] = useKeenSlider<HTMLDivElement>({
  loop: true,
  mode: 'free',
  slides: {
    perView: 2.5,
    spacing: 16,
  },
  breakpoints: {
    '(max-width: 768px)': {
      slides: { perView: 1.2, spacing: 12 },
    },
    '(min-width: 769px) and (max-width: 1024px)': {
      slides: { perView: 2, spacing: 14 },
    },
  },
});


  useEffect(() => {
    if (!sliderRef.current || !sliderInstance.current) return;

    let timeoutId: ReturnType<typeof setInterval>;

    const clearNext = () => clearInterval(timeoutId);

    const autoplay = () => {
      timeoutId = setInterval(() => {
        sliderInstance.current?.next();
      }, 3500);
    };

    autoplay();

    const el = sliderRef.current;
    el.addEventListener('mouseover', clearNext);
    el.addEventListener('mouseout', autoplay);

    return () => {
      clearNext();
      el.removeEventListener('mouseover', clearNext);
      el.removeEventListener('mouseout', autoplay);
    };
  }, []);

  const slides = [
    {
      title: 'Potencia tu PC con Build by LinMad',
      description: 'Elige, recomienda y crea la mejor configuración sin esfuerzo.',
      image: potencia,
    },
    {
      title: 'Recomendaciones Inteligentes',
      description: 'Basado en tus necesidades reales. Rápido y eficaz.',
      image: recomendacion,
    },
    {
      title: 'Diseño profesional y tecnológico',
      description: 'Tu experiencia importa, por eso la cuidamos al máximo.',
      image: disenoProfesional,
    },
  ];

  // 🚀 Estado para las builds recomendadas
  const [builds, setBuilds] = useState<any[]>([]);

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
const res = await axios.get('http://localhost:5000/api/builds/recommended')
        console.log('Builds API response:', res.data);
        setBuilds(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error al cargar builds recomendadas:', error);
        setBuilds([]); // aseguramos que sea array
      }
    };

    fetchBuilds();
  }, []);

const [selectedBuild, setSelectedBuild] = useState<any | null>(null);

  return (
    <main className="bg-[#0D0D0D] text-[#F4F4F5] min-h-screen">
      <div className="relative">
        {/* Carrusel */}
        <div
          ref={(node) => {
            sliderRef.current = node;
            refCallback(node);
          }}
          className="keen-slider h-[550px]"
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="keen-slider__slide bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40 flex flex-col items-start justify-center px-10 text-left">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-xl">
                  {slide.title}
                </h2>
                <p className="text-lg max-w-xl text-white mb-6">{slide.description}</p>

                <div className="flex gap-4">
                  {index === 0 && (
                    <button
                      type="button"
                      className="bg-primario font-bold hover:bg-acento text-white hover:text-[#0D0D0D] font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-0 shadow-none border-none"
                    >
                      Ver configurador
                    </button>
                  )}

                  {index === 1 && (
                    <button
                      type="button"
                      className="bg-primario font-bold hover:bg-acento hover:text-[#0D0D0D] text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-0 shadow-none border-none"
                    >
                      Ir al recomendador
                    </button>
                  )}

                  {index === 2 && (
                    <>
                      <button
                        type="button"
                        className="bg-primario font-bold hover:bg-acento text-white hover:text-[#0D0D0D] font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-200 focus:outline-none focus:ring-0 shadow-none border-none"
                      >
                        Conoce nuestro diseño
                      </button>
                      <button
                        type="button"
                        className="py-2.5 px-5 font-bold text-sm font-medium text-textoSecundario bg-transparent border border-textoSecundario rounded-lg hover:bg-blancoHueso hover:text-fondo transition-all duration-200 focus:outline-none focus:ring-0"
                      >
                        Ver nuestro equipo
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tarjetas sobrepuestas */}
        <section className="w-full flex justify-center px-4 md:px-8 mt-[-25px] relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-hover px-6 py-6 w-full max-w-6xl">
            {[
              {
                title: 'Recomendador de Componentes',
                desc: 'Te guiamos paso a paso según tus necesidades reales.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="59" height="59" viewBox="0 0 24 24">
                    <path
                      fill="none"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8.85 6.15L12 3l3.15 3.15L12 9.3zm5.85 6.3l3.15-3.15L21 12.45l-3.15 3.15zm-5.85 5.4L12 14.7l3.15 3.15L12 21zM3 12l3.15-3.15L9.3 12l-3.15 3.15z"
                    />
                  </svg>
                ),
              },
              {
                title: 'Build Asistido',
                desc: 'Configura tu equipo completo con compatibilidad garantizada.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="58" height="58" viewBox="0 0 16 16">
                    <path
                      fill="#fff"
                      fillRule="evenodd"
                      d="m14.773 3.485l-.78-.184l-2.108 2.096l-1.194-1.216l2.056-2.157l-.18-.792a4.4 4.4 0 0 0-1.347-.228a3.6 3.6 0 0 0-1.457.28a3.8 3.8 0 0 0-1.186.84a3.7 3.7 0 0 0-.875 1.265a3.94 3.94 0 0 0 0 2.966a335 335 0 0 0-6.173 6.234c-.21.275-.31.618-.284.963a1.4 1.4 0 0 0 .464.967q.188.205.437.328c.17.075.353.118.538.127c.316-.006.619-.126.854-.337c1.548-1.457 4.514-4.45 6.199-6.204c.457.194.948.294 1.444.293a3.74 3.74 0 0 0 2.677-1.133a3.9 3.9 0 0 0 1.111-2.73a4.2 4.2 0 0 0-.196-1.378"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
              },
            {
              title: 'Historial y Guardados',
              desc: 'Revisa tus configuraciones y proyectos anteriores.',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="59" height="59" viewBox="0 0 24 24">
                  <path
                    fill="#fff"
                    d="m19.65 20.35l.7-.7l-1.85-1.85V15h-1v3.2zm-7.15-6.675V10H15l-1-1h-1.5V5q0-.425.288-.712T13.5 4h2.425q.275 0 .513.138t.362.387L18.75 8H17.3l-1-2H14v1h1.7l1 2h2.6l1.475 2.575q-.65-.275-1.35-.425T18 11q-1.675 0-3.113.725t-2.387 1.95ZM10.5 20H8.075q-.275 0-.513-.137t-.362-.388L5.25 16H6.7l1 2H10v-1H8.3l-1-2H4.7l-1.425-2.5q-.05-.125-.087-.25T3.15 12q0-.1.125-.5L4.7 9h2.6l1-2H10V6H7.7l-1 2H5.25L7.2 4.525q.125-.25.362-.387T8.076 4H10.5q.425 0 .713.288T11.5 5v4H10l-1 1h2.5v3H9.3l-1-2H6l-1 1h2.7l1 2h2.8v1.4q-.25.6-.375 1.25T11 18q0 .425.038.85t.162.85q-.125.125-.312.213T10.5 20m7.5 3q-2.075 0-3.537-1.463T13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23"
                  />
                </svg>
              ),
            },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-hover px-4 py-4 rounded-lg flex flex-col items-center text-center"
              >
                <div className="text-3xl mb-2">{card.icon}</div>
                <h3 className="text-base font-bold text-white m-0 leading-tight">{card.title}</h3>
                <p className="text-sm text-blancoHueso mt-1 leading-snug">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

    {/* Carrusel de Builds Recomendadas */}
    
      {builds.length > 0 && (
        <section className="w-full px-4 md:px-10 mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
              {builds.map((build, index) => (
                <BuildCard
                  key={index}
                  title={`Build #${index + 1}`}
                  onClick={() => setSelectedBuild(build)}
                />
              ))}
            </div>
         </section>
      )}

      </div>

      {selectedBuild && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1F1F1F] rounded-xl shadow-2xl p-6 w-[90%] max-w-2xl relative border border-[#9F5BFF]">
            {/* Botón de cerrar */}
            <button
              onClick={() => setSelectedBuild(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#9F5BFF] text-white hover:bg-white hover:text-[#9F5BFF] transition-all"
            >
              ×
            </button>

            <h2 className="text-white text-2xl font-bold mb-4">
              Build #{builds.indexOf(selectedBuild) + 1}
            </h2>
            <p className="text-[#ccc] mb-4">Lista completa de componentes:</p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-[#F4F4F5]">
              {Object.entries(selectedBuild.components).flatMap(([key, comp]: any) =>
                Array.isArray(comp)
                  ? comp.map((c, i) => <li key={`${key}-${i}`}>• {c.name}</li>)
                  : comp?.name
                  ? [<li key={key}>• {comp.name}</li>]
                  : []
              )}
            </ul>
    </div>

    
  </div>

  
)}


    </main>
    
  );
}

export default Home;
