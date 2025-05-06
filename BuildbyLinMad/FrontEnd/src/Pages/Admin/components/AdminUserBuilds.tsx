import { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  TextField, InputAdornment, Select, MenuItem,
  Dialog, DialogTitle, DialogContent, Typography, Box, Divider, IconButton
} from '@mui/material';
import {
  FaSearch, FaEye, FaMemory, FaMicrochip, FaHdd, FaFan,
  FaServer, FaDatabase, FaThLarge, FaPowerOff
} from 'react-icons/fa';
import axios from 'axios';

interface Build {
  _id: string;
  userId: string;
  components: { [key: string]: any };
  total: number;
  createdAt: string;
}

interface User {
  _id: string;
  nombre: string;
  correo: string;
}

export default function AdminUserBuilds() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [filteredBuilds, setFilteredBuilds] = useState<Build[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterParts, setFilterParts] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(null);

  const iconMap: Record<string, JSX.Element> = {
    cpu: <FaMicrochip />,
    gpu: <FaServer />,
    ram: <FaMemory />,
    ssd: <FaDatabase />,
    hdd: <FaHdd />,
    cooler: <FaFan />,
    psu: <FaPowerOff />,
    motherboard: <FaThLarge />,
    case: <FaThLarge />,
    fans: <FaFan />,
  };

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/builds');
        const data = Array.isArray(res.data) ? res.data : res.data.builds || [];
        setBuilds(data);
        setFilteredBuilds(data);
      } catch (err) {
        console.error('Error al cargar builds', err);
        setBuilds([]);
      }
    };
    fetchBuilds();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/users');
        const users: User[] = res.data;
        const map: Record<string, string> = {};
        users.forEach((u) => {
          map[u._id] = u.nombre;
        });
        setUserMap(map);
      } catch (err) {
        console.error('Error al cargar usuarios', err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let data = [...builds];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((b) =>
        b._id.toLowerCase().includes(q) ||
        b.userId.toLowerCase().includes(q) ||
        (userMap[b.userId]?.toLowerCase().includes(q))
      );
    }
    if (filterUser) {
      data = data.filter((b) => b.userId === filterUser);
    }
    if (filterParts) {
      const partCount = parseInt(filterParts);
      data = data.filter((b) =>
        b.components ? Object.keys(b.components).length === partCount : false
      );
    }
    setFilteredBuilds(data);
  }, [search, filterUser, filterParts, builds, userMap]);

  const abrirModal = (build: Build) => {
    setSelectedBuild(build);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setSelectedBuild(null);
  };

  return (
    <div className="min-h-screen mt-32 px-6 bg-fondo text-blancoHueso">
      <div className="text-textoSecundario text-sm mb-4">
        Admin <span className="mx-2">{'>'}</span>
        <span className="font-semibold">Builds de Usuarios</span>
      </div>

      <div className="flex gap-6">
        {/* Filtros */}
        <div className="w-64 bg-[#1A1A1A] p-5 rounded-xl shadow-lg border border-[#7F00FF] text-white">
          <h3 className="text-lg font-bold text-acento mb-5">Filtros</h3>
          <div className="flex flex-col gap-5 text-sm font-medium text-blancoHueso">
            <div>
              <label className="block mb-1 text-textoSecundario">Buscar:</label>
              <TextField
                size="small"
                placeholder="ID o Usuario"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch style={{ color: '#C2B9FF', fontSize: '14px' }} />
                    </InputAdornment>
                  ),
                  sx: { color: 'white', backgroundColor: '#0D0D0D' },
                }}
                fullWidth
              />
            </div>

            <div>
              <label className="block mb-1 text-textoSecundario">Usuario:</label>
              <Select
                size="small"
                fullWidth
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                sx={{
                  backgroundColor: '#0D0D0D',
                  color: '#F4F4F5',
                  borderRadius: '6px',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: '#7F00FF' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00FFFF' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#5A32A3' },
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                {[...new Set(builds.map((b) => b.userId))].map((uid) => (
                  <MenuItem key={uid} value={uid}>{userMap[uid] || uid}</MenuItem>
                ))}
              </Select>
            </div>

            <div>
              <label className="block mb-1 text-textoSecundario">Partes:</label>
              <Select
                size="small"
                fullWidth
                value={filterParts}
                onChange={(e) => setFilterParts(e.target.value)}
                sx={{
                  backgroundColor: '#0D0D0D',
                  color: '#F4F4F5',
                  borderRadius: '6px',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: '#7F00FF' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00FFFF' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#5A32A3' },
                }}
              >
                <MenuItem value="">Todas</MenuItem>
                {[...new Set(builds.map((b) =>
                  b.components ? Object.keys(b.components).length : 0
                ))]
                  .sort((a, b) => a - b)
                  .map((count) => (
                    <MenuItem key={count} value={count.toString()}>
                      {count} partes
                    </MenuItem>
                  ))}
              </Select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="flex-1">
          <div className="overflow-auto rounded-lg border border-primario bg-[#0E0E10]">
            <Table
              sx={{
                '& .MuiTableCell-root': {
                  borderBottom: '1px solid #222',
                  color: '#FFFFFF',
                },
                '& .MuiTableRow-root:last-child .MuiTableCell-root': {
                  borderBottom: 'none',
                },
              }}
            >
              <TableHead>
                <TableRow className="bg-[#7F00FF]">
                  <TableCell sx={{ fontWeight: 'bold' }}>Nombre Build</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Partes</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBuilds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No se encontraron builds.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBuilds.map((build, index) => (
                    <TableRow key={build._id}>
                      <TableCell>{`Build #${index + 1}`}</TableCell>
                      <TableCell>{userMap[build.userId] || build.userId}</TableCell>
                      <TableCell>{Object.keys(build.components || {}).length}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => abrirModal(build)}
                          sx={{
                            backgroundColor: '#222',
                            border: '1px solid #00FFFF',
                            color: '#00FFFF',
                            padding: '6px',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: '#00FFFF',
                              color: '#0E0E10',
                              transform: 'scale(1.15)',
                            },
                          }}
                        >
                          <FaEye />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal visual de partes */}
      <Dialog open={modalOpen} onClose={cerrarModal} fullWidth maxWidth="sm"
        PaperProps={{
          sx: {
            background: 'linear-gradient(to bottom, #1A1A1A, #0D0D0D)',
            border: '1px solid #7F00FF',
            borderRadius: 3,
            padding: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#00FFFF', fontSize: '1.25rem' }}>
          Detalle de la Build
        </DialogTitle>
        <DialogContent>
          {selectedBuild && Object.entries(selectedBuild.components).map(([tipo, comp]) => (
            <Box key={tipo} className="flex items-center gap-4 mb-4">
              <span className="text-2xl text-acento">{iconMap[tipo] || <FaThLarge />}</span>
              <Box>
                <Typography className="capitalize font-bold text-white">{tipo}</Typography>
                <Typography variant="body2" className="text-textoSecundario">{comp?.name || 'Sin nombre'}</Typography>
                {comp?.price && (
                  <Typography variant="body2" className="text-[#CCCCCC]">
                    ${comp.price.toLocaleString('es-CL')}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
          <Divider sx={{ borderColor: '#333', my: 3 }} />
          <Box className="bg-[#1F1F1F] p-3 rounded-lg text-right">
            <Typography variant="h6" className="text-white font-bold">
              Total: ${selectedBuild?.total?.toLocaleString('es-CL') || 0}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
