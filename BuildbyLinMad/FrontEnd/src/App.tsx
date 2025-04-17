import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Header y Footer
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Paginas
import Home from './Pages/Home/Home';
import Recomendador from './Pages/Recomendador/Recomendador';
import BuildAsistido from './Pages/BuildAsistido/BuildAsistido';
import Historial from './Pages/Historial/Historial';
import Perfil from './Pages/Perfil/Perfil';

// Inicar y Registrase
import Login from './Pages/Auth/Login/Login';
import Register from './Pages/Auth/Register/Register';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <BrowserRouter>
      {/* Navbar SIEMPRE visible y a pantalla completa */}
      <Navbar
        onLoginClick={() => {
          setShowLogin(true);
          setShowRegister(false);
        }}
        onRegisterClick={() => {
          setShowRegister(true);
          setShowLogin(false);
        }}
      />
      {/* Mostrar modales si están activos */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onRegisterClick={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onLoginClick={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recomendador" element={<Recomendador />} />
        <Route path="/build" element={<BuildAsistido />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/perfil" element={<Perfil />} />
        {/* Por si intenan navegar al login manda a home */}
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/register" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
