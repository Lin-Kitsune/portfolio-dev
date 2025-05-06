import { useNavigate } from 'react-router-dom';

import './admin-dashboard.css'; 
// Componentes
import CasesAdmin from './components/CasesAdmin';
import CoolersAdmin from './components/CoolersAdmin';
import DisksAdmin from './components/DisksAdmin';
import FansAdmin from './components/FansAdmin';
import GpusAdmin from './components/GpusAdmin';
import MotherboardsAdmin from './components/MotherboardsAdmin';
import ProcessorsAdmin from './components/ProcessorsAdmin';
import PsusAdmin from './components/PsusAdmin';
import RamsAdmin from './components/RamsAdmin';
import SsdsAdmin from './components/SsdsAdmin';

// Puedes reemplazar las imágenes por las tuyas reales luego
const COMPONENTES = [
    {
        key: 'cases',
        label: 'Gabinetes',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACe0lEQVR4nO2au27UQBSGj1JAJJIidASouYhLHy0dFHQgESpQQDwCLMuGPkIgJBAN8BAoCU8ACR2XEkFDSN4AaBKk/ZCjP2jWu3LW2l17PJ5PGq3P2TMX/x6PxzM2i0QiwwJ8oHjWzBcoCfMFogDlYL5AN3NjrKfhvQAWUF1DNWpc3T0K4GC+QIGN8l4AoDHGei5UQYDCMF+gm/gYHCfe9wDr4xtld48COJgvUGCjvBeA+BgsDvMFSqLs845ERO1vAeo+BhAFyM02cB+YVWrJlwvzBfLT6lNGq04CzDo7Srs7POoJtRNgDXhfRwFafcp4UCcBtnXP13YQHAnmC+TjB3APOAMcUjoLNIGNkAXoAI+AAxnlHAQehyrAXcVOAAvAOvBHaV2+CcU0QxPgjXOFVx3/XGrHd2Wvh+g4CAE6wAnFvZDvF7Dj5N+RL+G5fKeUt/ICfFTMceAv8BWYAS45+S8Ch4Fvijkm/+cQBHipmDuyr8i+5eRf0O+8Ym7Lfh2CAEuKacuelr2l+z/Z8NxKTYfbspdCEOBVqge4AuyxmRIgqB7wKTUGXJV9WSJsJsfyXVfMUdlfQhCgA5x0ngLJQDfTp4xkYPwOPJN9ep9yKyNAwrIzD1iRCNeAI0rzOvllZx7wln0wX2Awms5M8GayDgD8VnoH3HBmggO9GlvFBEh4AkxmlDMJPGVAzBfIx4YWRM8BU0rntSbwM09BVlEBRob5AiVhvkAUoIeeL8Wc1962VoEWnfi0Lyv/f8wXGLBh+ntKx9NOli7fsPUUDr00Mr7yXNTI/9CJT/uy8ldCgEIwX6AkzBeIApSD+QJRAJJd3qLZ3VWORCI2DP8AlLcpNg8alh4AAAAASUVORK5CYII='
    },
    { key: 'coolers', label: 'Coolers', icon: '/icon/cooler.png' },
    { key: 'disks', label: 'Discos', icon: '/icon/disk.png' },
    { key: 'fans', label: 'Ventiladores', icon: '/icon/fan.png' },
    { key: 'gpus', label: 'Gráficas', icon: '/icon/fan.png' },
    { key: 'motherboards', label: 'Placa Madre', icon: '/icon/motherboard.png' },
    { key: 'processors', label: 'Procesadores', icon: '/icon/cpu.png' },
    { key: 'psus', label: 'Psu', icon: '/icon/psu.png' },
    { key: 'rams', label: 'Memorias RAM', icon: '/icon/ram.png' },
    { key: 'ssds', label: 'Unidades SSD', icon: '/icon/ssd.png' },
  ];
  
  const GESTION = [

    { key: 'user-builds', label: 'BUILDS USUARIOS', icon: '/icon/cooler.png' },

  ];

  export default function AdminDashboard() {
    const navigate = useNavigate();
    
    const handleRedirect = (key: string) => {
        navigate(`/admin/${key}`);
      };
  
    return (
        <div className="min-h-screen pt-28 px-6 bg-fondo text-white">
        <h1 className="text-3xl font-extrabold text-center mb-10">COMPONENTES</h1>
  
        <div className="admin-grid">
          {COMPONENTES.map((comp) => (
            <button key={comp.key} className="admin-card" onClick={() => handleRedirect(comp.key)}>
              <img src={comp.icon} alt={comp.label} />
              <span>{comp.label}</span>
            </button>
          ))}
        </div>

        <h1 className="text-3xl font-extrabold text-center mb-10">GESTIÓN</h1>

        <div className="admin-grid">
          {GESTION.map((gest) => (
            <button key={gest.key} className="admin-card" onClick={() => handleRedirect(gest.key)}>
              <img src={gest.icon} alt={gest.label} />
              <span>{gest.label}</span>
            </button>
          ))}
        </div>

      </div>
      
    );
  }