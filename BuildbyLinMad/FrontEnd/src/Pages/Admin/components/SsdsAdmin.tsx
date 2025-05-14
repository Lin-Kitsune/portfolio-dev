import {
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
} from '@mui/material';
import { FaSearch, FaSortUp, FaSortDown, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { ssdService } from '../../../services/ssdService';
import { toast } from 'react-toastify';

export default function SsdsAdmin() {
  const [ssds, setSsds] = useState<any[]>([]);

  // General
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Filtros
  const [filterCapacidad, setFilterCapacidad] = useState('');
  const [filterFormato, setFilterFormato] = useState('');
  const [filterBus, setFilterBus] = useState('');
  const [filterPoseeDram, setFilterPoseeDram] = useState('');
  const [filterTipoMemoria, setFilterTipoMemoria] = useState('');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');  

  // Crear
  const [nombre, setNombre] = useState('');
  const [modelo, setModelo] = useState('');
  const [link, setLink] = useState('');
  const [precio, setPrecio] = useState('');
  const [formato, setFormato] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [bus, setBus] = useState('');
  const [tipoMemoria, setTipoMemoria] = useState('');
  const [poseeDram, setPoseeDram] = useState(false);

  // Editar
  const [editNombre, setEditNombre] = useState('');
  const [editModelo, setEditModelo] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editFormato, setEditFormato] = useState('');
  const [editCapacidad, setEditCapacidad] = useState('');
  const [editBus, setEditBus] = useState('');
  const [editTipoMemoria, setEditTipoMemoria] = useState('');
  const [editPoseeDram, setEditPoseeDram] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const selectEstilos = {
    backgroundColor: '#0D0D0D',
    borderRadius: '6px',
    color: '#F4F4F5',
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: '#7F00FF',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#00FFFF',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#5A32A3',
    },
    '.MuiSelect-icon': {
      color: '#F4F4F5',
    },
  };

  useEffect(() => {
    loadSsds();
  }, []);

  const loadSsds = async () => {
    try {
      const data = await ssdService.getSsds();
      setSsds(data);
    } catch (error) {
      console.error('Error al cargar SSDs:', error);
      toast.error('Error al cargar SSDs');
    }
  };

  const handleSort = (field: string) => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortField('');
      setSortDirection('asc');
    }
  };  

  const resetForm = () => {
    setNombre('');
    setPrecio('');
    setLink('');
    setModelo('');
    setImageFile(null);
    setPreview(null);
    setFormato('');
    setCapacidad('');
    setBus('');
    setTipoMemoria('');
    setPoseeDram(false);
  };

  // Crear
  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', nombre);
      formData.append('price', precio.toString());
      formData.append('link', link);
      formData.append('model', modelo);
      formData.append(
        'specs',
        JSON.stringify({
          capacidad,
          formato,
          bus,
          poseeDram,
          tipoMemoria,
        })
      );
  
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      await ssdService.createSsd(formData);
      toast.success('SSD agregado correctamente');
      await loadSsds();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error al crear SSD:', error);
      toast.error('Error al crear SSD');
    }
  };

  // Editar
  const handleEditClick = (item: any) => {
    setSelected(item);
    setEditNombre(item.name);
    setEditPrecio(item.price);
    setEditLink(item.link);
    setEditModelo(item.model || '');
    setEditFormato(item.specs?.formato || '');
    setEditCapacidad(item.specs?.capacidad || '');
    setEditBus(item.specs?.bus || '');
    setEditTipoMemoria(item.specs?.tipoMemoria || '');
    setEditPoseeDram(item.specs?.poseeDram || false);
    setPreview(item.imagePath ? `http://localhost:5000/${item.imagePath}` : null);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editNombre);
      formData.append('price', editPrecio.toString());
      formData.append('link', editLink);
      formData.append('model', editModelo);
      formData.append(
        'specs',
        JSON.stringify({
          capacidad: editCapacidad,
          formato: editFormato,
          bus: editBus,
          tipoMemoria: editTipoMemoria,
          poseeDram: editPoseeDram,
        })
      );
  
      if (editImage) {
        formData.append('image', editImage);
      }
  
      await ssdService.updateSsd(selected._id, formData);
      toast.success('SSD actualizado correctamente');
      await loadSsds();
      setIsEditModalOpen(false);
      setSelected(null);
    } catch (error) {
      console.error('Error al actualizar SSD:', error);
      toast.error('Error al actualizar SSD');
    }
  };
  
  // Eliminar
  const handleDelete = async () => {
    try {
      await ssdService.deleteSsd(selected._id);
      toast.success('SSD eliminado correctamente');
      await loadSsds();
      setIsDeleteModalOpen(false);
      setSelected(null);
    } catch (error) {
      console.error('Error al eliminar SSD:', error);
      toast.error('Error al eliminar SSD');
    }
  };
  
  const filteredData = ssds
  .filter((item) => {
    const matchesName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacidad = filterCapacidad ? item.specs?.capacidad === filterCapacidad : true;
    const matchesFormato = filterFormato ? item.specs?.formato === filterFormato : true;
    const matchesTipoMemoria = filterTipoMemoria ? item.specs?.tipoMemoria === filterTipoMemoria : true;
    const matchesPoseeDram =
      filterPoseeDram !== ''
        ? String(item.specs?.poseeDram) === filterPoseeDram
        : true;
    const matchesBus = filterBus ? item.specs?.bus === filterBus : true;
    const matchesPriceMin = filterPriceMin ? item.price >= parseInt(filterPriceMin) : true;
    const matchesPriceMax = filterPriceMax ? item.price <= parseInt(filterPriceMax) : true;

    return (
      matchesName &&
      matchesCapacidad &&
      matchesFormato &&
      matchesTipoMemoria &&
      matchesPoseeDram &&
      matchesBus &&
      matchesPriceMin &&
      matchesPriceMax
    );
  })
  .sort((a, b) => {
    const getValue = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc?.[part], obj);
    };
  
    const fieldA = getValue(a, sortField);
    const fieldB = getValue(b, sortField);
  
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }
  
    if (typeof fieldA === 'number' && typeof fieldB === 'number') {
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    }
  
    if (typeof fieldA === 'boolean' && typeof fieldB === 'boolean') {
      return sortDirection === 'asc'
        ? Number(fieldA) - Number(fieldB)
        : Number(fieldB) - Number(fieldA);
    }
  
    return 0;
  });  

const totalPages = Math.ceil(filteredData.length / itemsPerPage);

const paginatedData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  return (
    <div className="min-h-screen mt-32 px-6 bg-fondo text-blancoHueso">
      {/* Breadcrumb */}
      <div className="text-textoSecundario text-sm mb-4">
        Admin <span className="mx-2">{'>'}</span> <span className="font-semibold">SSDs</span>
      </div>

      <div className="flex gap-6">
        {/* Filtros */}
        <div className="w-64 bg-[#1A1A1A] p-5 rounded-xl shadow-lg border border-[#7F00FF] text-white">
          <h3 className="text-lg font-bold text-acento mb-5">Filtros</h3>

          <div className="flex flex-col gap-5 text-sm font-medium text-blancoHueso">
            {/* Capacidad */}
            <div>
              <label className="block mb-1 text-textoSecundario">Capacidad:</label>
              <Select
                size="small"
                value={filterCapacidad}
                onChange={(e) => setFilterCapacidad(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="250 GB">250 GB</MenuItem>
                <MenuItem value="500 GB">500 GB</MenuItem>
                <MenuItem value="1 TB">1 TB</MenuItem>
                <MenuItem value="2 TB">2 TB</MenuItem>
              </Select>
            </div>

            {/* Formato */}
            <div>
              <label className="block mb-1 text-textoSecundario">Formato:</label>
              <Select
                size="small"
                value={filterFormato}
                onChange={(e) => setFilterFormato(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="M.2 (2280)">M.2 (2280)</MenuItem>
                <MenuItem value="2.5 SATA">2.5 SATA</MenuItem>
                <MenuItem value="M.2 (2230)">M.2 (2230)</MenuItem>
              </Select>
            </div>

            {/* Bus */}
            <div>
              <label className="block mb-1 text-textoSecundario">Bus:</label>
              <Select
                size="small"
                value={filterBus}
                onChange={(e) => setFilterBus(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="PCIe 3.0 x4">PCIe 3.0 x4</MenuItem>
                <MenuItem value="PCIe 4.0 x4">PCIe 4.0 x4</MenuItem>
                <MenuItem value="SATA III">SATA III</MenuItem>
              </Select>
            </div>

            {/* ¿Posee DRAM? */}
            <div>
              <label className="block mb-1 text-textoSecundario">Posee DRAM:</label>
              <Select
                size="small"
                value={filterPoseeDram}
                onChange={(e) => setFilterPoseeDram(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </div>

            {/* Tipo de Memoria */}
            <div>
              <label className="block mb-1 text-textoSecundario">Tipo de Memoria:</label>
              <Select
                size="small"
                value={filterTipoMemoria}
                onChange={(e) => setFilterTipoMemoria(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="TLC">TLC</MenuItem>
                <MenuItem value="QLC">QLC</MenuItem>
                <MenuItem value="MLC">MLC</MenuItem>
                <MenuItem value="NANDQLC">NANDQLC</MenuItem>
              </Select>
            </div>

            {/* Rango de precios */}
            <div>
              <label className="block mb-1 text-textoSecundario">Precio (CLP):</label>
              <div className="flex gap-2">
                <TextField
                  size="small"
                  placeholder="Min"
                  type="number"
                  value={filterPriceMin}
                  onChange={(e) => setFilterPriceMin(e.target.value)}
                  InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                  sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
                />
                <TextField
                  size="small"
                  placeholder="Max"
                  type="number"
                  value={filterPriceMax}
                  onChange={(e) => setFilterPriceMax(e.target.value)}
                  InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                  sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Tabla + buscador */}
        <div className="flex-1">
          {/* Buscador + Agregar */}
          <div className="flex items-center gap-4 mb-4">
            {/* Buscador */}
            <div className="relative w-[250px]">
              <TextField
                size="small"
                label="Buscar por nombre"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch style={{ color: '#C2B9FF', fontSize: '14px' }} />
                    </InputAdornment>
                  ),
                  style: { color: '#F4F4F5' },
                }}
                InputLabelProps={{
                  style: { color: '#C2B9FF' },
                }}
                sx={{
                  width: '250px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#7F00FF' },
                    '&:hover fieldset': { borderColor: '#5A32A3' },
                    '&.Mui-focused fieldset': { borderColor: '#00FFFF' },
                  },
                  '& label.Mui-focused': { color: '#00FFFF' },
                }}
              />
            </div>

            {/* Botón agregar */}
            <Button
              onClick={() => setIsModalOpen(true)}
              startIcon={<FaPlus />}
              variant="contained"
              sx={{
                backgroundColor: '#7F00FF',
                '&:hover': { backgroundColor: '#5A32A3' },
                color: '#fff',
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3,
              }}
            >
              Agregar nuevo
            </Button>
          </div>

          <div className="overflow-auto rounded-lg border border-primario bg-[#0E0E10]">
            <Table
              sx={{
                '& .MuiTableCell-root': {
                  borderBottom: '1px solid #222', // borde más sutil y oscuro
                  color: '#FFFFFF', // texto blanco
                },
                '& .MuiTableRow-root:last-child .MuiTableCell-root': {
                  borderBottom: 'none', // elimina el borde inferior de la última fila
                },
              }}
            >
              <TableHead>
                <TableRow className="bg-[#7F00FF]">
                  {['name','model', 'specs.capacidad','specs.formato', 'specs.bus', 'specs.poseeDram', 'specs.tipoMemoria', 'price', ].map((field) => (
                    <TableCell
                      key={field}
                      onClick={() => handleSort(field)}
                      className="cursor-pointer"
                      sx={{
                        whiteSpace: 'nowrap',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                      }}
                    >
                      {field === 'name' && 'Nombre'}
                      {field === 'model' && 'Modelo'}
                      {field === 'specs.capacidad' && 'Capacidad'}
                      {field === 'specs.formato' && 'Formato'}
                      {field === 'specs.bus' && 'Bus'}
                      {field === 'specs.poseeDram' && '¿Posee DRAM?'}
                      {field === 'specs.tipoMemoria' && 'Tipo de Memoria'}
                      {field === 'price' && 'Precio'}

                      {sortField === field &&
                        (sortDirection === 'asc' ? (
                          <FaSortUp className="inline ml-1" />
                        ) : (
                          <FaSortDown className="inline ml-1" />
                        ))}
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="transition duration-200"
                    sx={{ '&:hover': { backgroundColor: '#1A1A1A' } }}
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-medium">{item.model || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.capacidad || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.formato || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.bus || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.poseeDram ? 'Sí' : 'No'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.tipoMemoria || '—'}</TableCell>

                    <TableCell className="font-medium">
                      ${item.price.toLocaleString('es-CL')}
                    </TableCell>
                    <TableCell className="py-4">
                    <Button
                      size="small"
                      onClick={() => handleEditClick(item)}
                      sx={{
                        minWidth: 'unset',
                        color: '#00FFFF',
                        fontSize: '18px', // tamaño del icono
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.3)',
                        },
                      }}
                    >
                      <FaEdit />
                    </Button>

                    <Button
                      size="small"
                      onClick={() => {
                        setSelected(item);
                        setIsDeleteModalOpen(true);
                      }}
                      sx={{
                        minWidth: 'unset',
                        color: '#FF4D4F',
                        fontSize: '18px',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.3)',
                        },
                      }}
                    >
                      <FaTrash />
                    </Button>

                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Paginación centrada */}
          <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
            {/* Botón Anterior */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded-md font-bold transition-all duration-200
                ${currentPage === 1
                  ? 'bg-[#444] text-white opacity-50'
                  : 'bg-[#7F00FF] text-white hover:bg-[#5A32A3]'}
                outline-none border-none shadow-none focus:outline-none`}
            >
              ‹
            </button>

            {/* Números de página */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-md font-bold transition-all duration-200
                  ${
                    currentPage === page
                      ? 'bg-[#00FFFF] text-[#0D0D0D]'
                      : 'bg-[#7F00FF] text-white hover:bg-[#5A32A3]'
                  }
                  outline-none border-none shadow-none focus:outline-none`}
              >
                {page}
              </button>
            ))}

            {/* Botón Siguiente */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded-md font-bold transition-all duration-200
                ${currentPage === totalPages
                  ? 'bg-[#444] text-white opacity-50'
                  : 'bg-[#7F00FF] text-white hover:bg-[#5A32A3]'}
                outline-none border-none shadow-none focus:outline-none`}
            >
              ›
            </button>
          </div>

        </div>
      </div>

      {/* Modal de agregar */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-xl shadow-xl border border-[#7F00FF] relative text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">Agregar nuevo SSD</h3>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Nombre */}
              <TextField
                label="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Modelo */}
              <TextField
                label="Modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Link del producto */}
              <TextField
                label="Link del producto"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Precio */}
              <TextField
                label="Precio"
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Capacidad */}
              <TextField
                label="Capacidad"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Formato */}
              <TextField
                label="Formato"
                value={formato}
                onChange={(e) => setFormato(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Bus */}
              <TextField
                label="Bus"
                value={bus}
                onChange={(e) => setBus(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Posee DRAM */}
              <TextField
                label="¿Posee DRAM? (true/false)"
                value={poseeDram}
                onChange={(e) => setPoseeDram(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Tipo de Memoria */}
              <TextField
                label="Tipo de Memoria"
                value={tipoMemoria}
                onChange={(e) => setTipoMemoria(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Imagen */}
              <div className="col-span-2">
                <label htmlFor="image_input" className="block text-sm font-semibold text-blancoHueso mb-1">
                  Imagen del producto
                </label>
                <input
                  id="image_input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="block w-full text-sm text-white border border-[#7F00FF] rounded-lg cursor-pointer bg-[#0D0D0D] focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#7F00FF] file:text-white hover:file:bg-[#5A32A3]"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="mt-2 max-h-40 rounded border border-[#333]"
                  />
                )}
              </div>

              {/* Botones */}
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <Button
                  variant="outlined"
                  onClick={() => setIsModalOpen(false)}
                  sx={{ borderColor: '#FF4D4F', color: '#FF4D4F' }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  sx={{
                    backgroundColor: '#7F00FF',
                    '&:hover': { backgroundColor: '#5A32A3' },
                    color: '#fff',
                    fontWeight: 'bold',
                    textTransform: 'none',
                  }}
                >
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de editar */}
      {isEditModalOpen && selected && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-2xl shadow-xl border border-[#7F00FF] relative text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">Editar SSD</h3>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Nombre */}
              <TextField
                label="Nombre"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Modelo */}
              <TextField
                label="Modelo"
                value={editModelo}
                onChange={(e) => setEditModelo(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Link del producto */}
              <TextField
                label="Link del producto"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Precio */}
              <TextField
                label="Precio"
                type="number"
                value={editPrecio}
                onChange={(e) => setEditPrecio(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Capacidad */}
              <TextField
                label="Capacidad"
                value={editCapacidad}
                onChange={(e) => setEditCapacidad(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Formato */}
              <TextField
                label="Formato"
                value={editFormato}
                onChange={(e) => setEditFormato(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Bus */}
              <TextField
                label="Bus"
                value={editBus}
                onChange={(e) => setEditBus(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Posee DRAM */}
              <TextField
                label="¿Posee DRAM? (true/false)"
                value={editPoseeDram}
                onChange={(e) => setEditPoseeDram(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Tipo de Memoria */}
              <TextField
                label="Tipo de Memoria"
                value={editTipoMemoria}
                onChange={(e) => setEditTipoMemoria(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Imagen */}
              <div className="col-span-2">
                <label className="block mb-1 text-sm font-semibold text-blancoHueso">Imagen del producto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditImage(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full text-sm text-white border border-[#7F00FF] rounded-lg cursor-pointer bg-[#0D0D0D] focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#7F00FF] file:text-white hover:file:bg-[#5A32A3]"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Vista previa"
                    className="mt-2 max-h-40 rounded border border-[#333]"
                  />
                )}
              </div>

              {/* Botones */}
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <Button
                  onClick={() => setIsEditModalOpen(false)}
                  variant="outlined"
                  sx={{ borderColor: '#FF4D4F', color: '#FF4D4F' }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpdate}
                  variant="contained"
                  sx={{
                    backgroundColor: '#7F00FF',
                    '&:hover': { backgroundColor: '#5A32A3' },
                    color: '#fff',
                    fontWeight: 'bold',
                    textTransform: 'none',
                  }}
                >
                  Guardar cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de eliminar */}
      {isDeleteModalOpen && selected && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-sm shadow-xl border border-[#7F00FF] text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">¿Eliminar SSD?</h3>

            <p className="mb-6 text-blancoHueso">
              ¿Estás seguro de que deseas eliminar <strong>{selected.name}</strong>? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                variant="outlined"
                sx={{
                  borderColor: '#FF4D4F',
                  color: '#FF4D4F',
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Cancelar
              </Button>

              <Button
                onClick={handleDelete}
                variant="contained"
                sx={{
                  backgroundColor: '#FF4D4F',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
