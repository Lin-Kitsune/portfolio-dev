import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Header y Footer
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Páginas
import Home from './Pages/Home/Home';
import Recomendador from './Pages/Recomendador/Recomendador';
import BuildAsistido from './Pages/BuildAsistido/BuildAsistido';
import Historial from './Pages/Historial/Historial';
import Perfil from './Pages/Perfil/Perfil';
import EditarBuild from './Pages/EditarBuild/EditarBuild';


// Iniciar y Registrarse
import Login from './Pages/Auth/Login/Login';
import Register from './Pages/Auth/Register/Register';


function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <BrowserRouter>
      {/* Navbar SIEMPRE visible */}
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

      {/* Rutas principales */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recomendador" element={<Recomendador />} />
        <Route path="/build" element={<BuildAsistido />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/register" element={<Navigate to="/" />} />
        <Route path="/editar-build" element={<EditarBuild />} />
      </Routes>

      <Footer />

      {/* ToastContainer global (necesario para mostrar toasts) */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;
