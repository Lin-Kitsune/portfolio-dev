import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Recomendador', path: '/recomendador' },
  { label: 'Armar PC', path: '/build' },
  { label: 'Historial', path: '/historial' },
];

export default function Navbar() {
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('usuario');
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
  }, []);

  return (
    <header className="w-full bg-[#1A1A1A]/90 backdrop-blur border-b border-[#5A32A3] shadow-md z-50">
      {/* Agrega sticky top-0 si quieres que quede fijo */}
      {/* <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur border-b border-[#5A32A3] shadow-md"> */}
      <nav className="max-w-screen-2xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* 🔹 Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-[#7F00FF] hover:text-white transition-colors"
        >
          Build by <span className="text-white">LinMad</span>
        </Link>

        {/* 🔹 Menú navegación */}
        <ul className="flex gap-6 list-none">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={classNames(
                  'text-white hover:text-[#7F00FF] transition-colors font-medium tracking-wide',
                  {
                    'text-[#7F00FF] underline underline-offset-4':
                      location.pathname === item.path,
                  }
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 🔹 Acciones derecha */}
        <div className="flex gap-4 items-center">
          {!usuario ? (
            <>
              <Link
                to="/login"
                className="text-white border border-white px-4 py-1 rounded hover:bg-white hover:text-[#0D0D0D] transition"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-[#7F00FF] text-white px-4 py-1 rounded hover:bg-[#5A32A3] transition"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <Link
              to="/perfil"
              title="Mi perfil"
              className="text-white hover:text-[#C28BFF] transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12q-1.275 0-2.137-.862T9 9q0-1.25.863-2.125T12 6q1.25 0 2.125.875T15 9q0 1.275-.875 2.138T12 12m-6 5v-.9q0-.525.263-.987t.712-.738q1.15-.675 2.413-1.025T12 13t2.613.35t2.412 1.025q.45.275.713.738T18 16.1v.9q0 .425-.288.713T17 18H7q-.425 0-.712-.288T6 17m-2 5q-.825 0-1.412-.587T2 20v-3q0-.425.288-.712T3 16t.713.288T4 17v3h3q.425 0 .713.288T8 21t-.288.713T7 22zM2 7V4q0-.825.588-1.412T4 2h3q.425 0 .713.288T8 3t-.288.713T7 4H4v3q0 .425-.288.713T3 8t-.712-.288T2 7m18 15h-3q-.425 0-.712-.288T16 21t.288-.712T17 20h3v-3q0-.425.288-.712T21 16t.713.288T22 17v3q0 .825-.587 1.413T20 22m0-15V4h-3q-.425 0-.712-.288T16 3t.288-.712T17 2h3q.825 0 1.413.588T22 4v3q0 .425-.288.713T21 8t-.712-.288T20 7" />
              </svg>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
