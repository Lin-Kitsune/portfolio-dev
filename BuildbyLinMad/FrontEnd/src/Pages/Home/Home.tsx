import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { useEffect, useState } from 'react';

function Home() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    autoplay: true,
  });

  const slides = [
    {
      title: 'Potencia tu PC con Build by LinMad',
      description: 'Elige, recomienda y crea la mejor configuración sin esfuerzo.',
      image: 'https://source.unsplash.com/featured/?pc,technology',
    },
    {
      title: 'Recomendaciones Inteligentes',
      description: 'Basado en tus necesidades reales. Rápido y eficaz.',
      image: 'https://source.unsplash.com/featured/?gaming,setup',
    },
    {
      title: 'Diseño profesional y tecnológico',
      description: 'Tu experiencia importa, por eso la cuidamos al máximo.',
      image: 'https://source.unsplash.com/featured/?keyboard,hardware',
    },
  ];

  return (
    <main className="bg-[#0D0D0D] text-[#F4F4F5] min-h-screen">
      {/* 🔁 Carrusel */}
      <div ref={sliderRef} className="keen-slider h-[400px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="keen-slider__slide flex items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center px-4 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-[#7F00FF] mb-4">{slide.title}</h2>
              <p className="text-lg max-w-xl text-[#C28BFF]">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🟪 Bienvenida */}
      <section className="px-8 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#7F00FF] mb-4">
          Bienvenido a <span className="text-white">Build by LinMad</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-[#C28BFF]">
          Plataforma moderna para ayudarte a armar el mejor PC posible. Inteligencia, estilo y rendimiento en un solo lugar.
        </p>
      </section>

      {/* 🔳 Tarjetas base */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 pb-20">
        {[
          {
            title: 'Recomendador de Componentes',
            desc: 'Te guiamos paso a paso según tus necesidades reales.',
            icon: '🧠',
          },
          {
            title: 'Build Asistido',
            desc: 'Configura tu equipo completo con compatibilidad garantizada.',
            icon: '🛠️',
          },
          {
            title: 'Historial y Guardados',
            desc: 'Revisa tus configuraciones y proyectos anteriores.',
            icon: '📂',
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg hover:shadow-2xl transition hover:scale-[1.02]"
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-xl font-semibold text-[#C28BFF] mb-2">{card.title}</h3>
            <p className="text-sm text-[#F4F4F5]">{card.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Home;
