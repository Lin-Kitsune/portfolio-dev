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

// Admin
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import CasesAdmin from './Pages/Admin/components/CasesAdmin';
import CoolersAdmin from './Pages/Admin/components/CoolersAdmin';
import DisksAdmin from './Pages/Admin/components/DisksAdmin';
import FansAdmin from './Pages/Admin/components/FansAdmin';
import GpusAdmin from './Pages/Admin/components/GpusAdmin';
import MotherboardsAdmin from './Pages/Admin/components/MotherboardsAdmin';
import ProcessorsAdmin from './Pages/Admin/components/ProcessorsAdmin';
import PsusAdmin from './Pages/Admin/components/PsusAdmin';
import RamsAdmin from './Pages/Admin/components/RamsAdmin';
import SsdsAdmin from './Pages/Admin/components/SsdsAdmin';

import AdminUserBuilds from './Pages/Admin/components/AdminUserBuilds';

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
        {/* Admin */}
        <Route
          path="/admin"
          element={<ProtectedRoute role="admin" element={<AdminDashboard />} />}
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/cases" element={<CasesAdmin />} />
        <Route path="/admin/coolers" element={<CoolersAdmin />} />
        <Route path="/admin/disks" element={<DisksAdmin />} />
        <Route path="/admin/fans" element={<FansAdmin />} />
        <Route path="/admin/gpus" element={<GpusAdmin />} />
        <Route path="/admin/motherboards" element={<MotherboardsAdmin />} />
        <Route path="/admin/processors" element={<ProcessorsAdmin />} />
        <Route path="/admin/psus" element={<PsusAdmin />} />
        <Route path="/admin/rams" element={<RamsAdmin />} />
        <Route path="/admin/ssds" element={<SsdsAdmin />} />
        <Route path="/admin/user-builds" element={<AdminUserBuilds />} />
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
