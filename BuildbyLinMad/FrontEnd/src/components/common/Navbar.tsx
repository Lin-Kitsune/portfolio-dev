import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

const navItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Recomendador', path: '/recomendador' },
  { label: 'Armar PC', path: '/build' },
  { label: 'Historial', path: '/historial' },
  { label: 'Perfil', path: '/perfil' },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="w-full bg-fondo border-b border-primario shadow-md">
      <nav className="max-w-screen-2xl mx-auto px-6 py-4 flex justify-between items-center">
            {/* logo + menu */}
            <div className="flex gap-12 items-center">
                <Link to="/" className="text-2xl font-bold text-primario hover:text-white transition-colors">
                Build by <span className="text-white">LinMad</span>
                </Link>

                <ul className="flex gap-6">
                {navItems.map((item) => (
                    <li key={item.path}>
                    <Link
                        to={item.path}
                        className={classNames(
                        'text-white hover:text-primario transition-colors font-medium tracking-wide',
                        {
                            'text-primario underline underline-offset-4': location.pathname === item.path,
                        }
                        )}
                    >
                        {item.label}
                    </Link>
                    </li>
                ))}
                </ul>
            </div>

            {/* botones login/register aquí */}
            <div className="flex gap-4">
                <Link
                to="/login"
                className="text-white border border-white px-4 py-1 rounded hover:bg-white hover:text-fondo transition"
                >
                Iniciar Sesión
                </Link>
                <Link
                to="/register"
                className="bg-primario text-white px-4 py-1 rounded hover:bg-hover transition"
                >
                Registrarse
                </Link>
            </div>
        </nav>

    </header>
  );
}
