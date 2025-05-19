import { FaDiscord, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import Logo from '../../assets/img/logo.png';
import './Footer.css';

export default function Footer() {
  return (
        <footer className="footer-container text-white text-sm mt-20">
            {/* Capa trasera */}
            <div className="footer-layer back-layer">
                <svg viewBox="0 0 1440 150" preserveAspectRatio="none">
                <defs>
                <linearGradient id="gradientBack" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7F00FF" stopOpacity="0.5" />
                    <stop offset="40%" stopColor="#7F00FF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#00FFFF" stopOpacity="0.5" />
                </linearGradient>
                </defs>
                <polygon
                    points="0,120 300,60 600,100 900,40 1200,90 1440,60 1440,0 0,0"
                    fill="url(#gradientBack)"
                />
                </svg>
            </div>

            {/* Capa delantera */}
            <div className="footer-layer front-layer">
                <svg viewBox="0 0 1440 150" preserveAspectRatio="none">
                <defs>
                <linearGradient id="gradientFront" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7F00FF" />
                    <stop offset="40%" stopColor="#7F00FF" />
                    <stop offset="100%" stopColor="#00FFFF" />
                </linearGradient>

                </defs>
                <polygon
                    points="0,100 250,40 600,70 900,30 1250,70 1440,50 1440,0 0,0"
                    fill="url(#gradientFront)"
                />
                </svg>
            </div>

            <div className="footer-content text-[#1A1A1A] grid grid-cols-1 md:grid-cols-5 gap-x-1 md:gap-x-2 gap-y-4 items-start text-left">
                {/* Branding */}
                <div className="flex items-center gap-6 col-span-2 footer-col morado">
                    <img src={Logo} alt="Logo LinMad" className="w-36 h-auto bg-[#0D0D0D] p-3 rounded-md" />
                    <p className="text-[20px] font-bold text-white leading-snug max-w-xs">
                        "Tu plataforma para armar la PC ideal con inteligencia"
                    </p>
                </div>

                {/* Navegación */}
                <div className="flex flex-col justify-start place-self-start space-y-2 footer-col morado">
                    <h3 className="uppercase font-bold text-base text-[#1A1A1A] border-b-2 border-[#00FFFF] w-fit pb-1 mb-2 footer-title">Navegación</h3>
                    <ul className="list-none pl-0 space-y-1 text-[15px] font-medium">
                    <li><a href="/recomendador" className="hover:text-black no-underline">Recomendador</a></li>
                    <li><a href="/build" className="hover:text-black no-underline">Armar PC</a></li>
                    <li><a href="/historial" className="hover:text-black no-underline">Historial</a></li>
                    <li><a href="/perfil" className="hover:text-black no-underline">Mi perfil</a></li>
                    </ul>
                </div>

                {/* Soporte */}
                <div className="flex flex-col justify-start place-self-start space-y-2 footer-col celeste">
                    <h3 className="uppercase font-bold text-base text-[#1A1A1A] border-b-2 border-[#00FFFF] w-fit pb-1 mb-2 footer-title">Soporte</h3>
                    <ul className="list-none pl-0 space-y-1 text-[15px] font-medium">
                    <li><a href="mailto:soporte@linmad.cl" className="hover:text-black no-underline">soporte@linmad.cl</a></li>
                    <li><a href="/faq" className="hover:text-black no-underline">Preguntas frecuentes</a></li>
                    </ul>
                </div>

                {/* Links */}
                <div className="flex flex-col justify-start place-self-start space-y-2 footer-col celeste">
                    <h3 className="uppercase font-bold text-base text-[#1A1A1A] border-b-2 border-[#00FFFF] w-fit pb-1 mb-2 footer-title">Links</h3>
                    <ul className="list-none pl-0 space-y-1 text-[15px] font-medium">
                    <li><a href="/terminos" className="hover:text-black no-underline">Términos</a></li>
                    <li><a href="/privacidad" className="hover:text-black no-underline">Privacidad</a></li>
                    <li><a href="/contacto" className="hover:text-black no-underline">Contacto</a></li>
                    </ul>
                </div>

                {/* Redes Sociales */}
                <div className="flex flex-col justify-start place-self-start space-y-2 footer-col celeste">
                    <h3 className="uppercase font-bold text-base text-[#1A1A1A] border-b-2 border-[#00FFFF] w-fit pb-1 mb-2 footer-title">Síguenos</h3>
                    <ul className="list-none pl-0 space-y-2 text-sm font-medium text-[#1A1A1A]">
                        <li className="flex items-center gap-2">
                            <FaDiscord className="text-lg" />
                            <span>@LinMadDs</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <FaGithub className="text-lg" />
                            <span>/LinMad</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <FaLinkedinIn className="text-lg" />
                            <span>/in/linmad</span>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
  );
}
