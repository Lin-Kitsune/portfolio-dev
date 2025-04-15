import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './Pages/Home/Home';
import Recomendador from './Pages/Recomendador/Recomendador';
import BuildAsistido from './Pages/BuildAsistido/BuildAsistido';
import Historial from './Pages/Historial/Historial';
import Perfil from './Pages/Perfil/Perfil';
import Login from './Pages/Auth/Login/Login';
import Register from './Pages/Auth/Register/Register';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar SIEMPRE visible y a pantalla completa */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recomendador" element={<Recomendador />} />
        <Route path="/build" element={<BuildAsistido />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
