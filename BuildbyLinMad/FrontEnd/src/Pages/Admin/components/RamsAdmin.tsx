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
import { ramService } from '../../../services/ramService';
import { toast } from 'react-toastify';

export default function RamsAdmin() {
  const [rams, setRams] = useState<any[]>([]); 

  // General
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Filtros
  const [filterTipo, setFilterTipo] = useState('');
  const [filterFormato, setFilterFormato] = useState('');
  const [filterCapacidad, setFilterCapacidad] = useState('');
  const [filterVoltaje, setFilterVoltaje] = useState('');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [filterVelocidad, setFilterVelocidad] = useState('');

  // Crear
  const [nombre, setNombre] = useState('');
  const [modelo, setModelo] = useState('');
  const [link, setLink] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [capacidadPorModulo, setCapacidadPorModulo] = useState('');
  const [total, setTotal] = useState('');
  const [tipo, setTipo] = useState('');
  const [velocidad, setVelocidad] = useState('');
  const [formato, setFormato] = useState('');
  const [voltaje, setVoltaje] = useState('');

  // Editar
  const [editNombre, setEditNombre] = useState('');
  const [editModelo, setEditModelo] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editCantidad, setEditCantidad] = useState('');
  const [editCapacidadPorModulo, setEditCapacidadPorModulo] = useState('');
  const [editTotal, setEditTotal] = useState('');
  const [editTipo, setEditTipo] = useState('');
  const [editVelocidad, setEditVelocidad] = useState('');
  const [editFormato, setEditFormato] = useState('');
  const [editVoltaje, setEditVoltaje] = useState('');

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
    loadRams();
  }, []);

  const loadRams = async () => {
    try {
      const data = await ramService.getRams();
      setRams(data);
    } catch (error) {
      console.error('Error al cargar RAMs:', error);
      toast.error('Error al cargar RAMs');
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

  // Crear
  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', nombre);
      formData.append('price', precio.toString());
      formData.append('link', link);
      formData.append('model', modelo);
      formData.append('specs', JSON.stringify({
        cantidad,
        capacidadPorModulo,
        total,
        tipo,
        velocidad,
        formato,
        voltaje,
      }));
  
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      await ramService.createRam(formData);
      toast.success('RAM agregada correctamente');
      await loadRams();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al crear RAM:', error);
      toast.error('Error al crear RAM');
    }
  };

  // Editar
  const handleEditClick = (item: any) => {
    setSelected(item);
    setEditNombre(item.name);
    setEditPrecio(item.price);
    setEditLink(item.link);
    setEditModelo(item.model || '');
    setEditCantidad(item.specs?.cantidad?.toString() || '');
    setEditCapacidadPorModulo(item.specs?.capacidadPorModulo || '');
    setEditTotal(item.specs?.total || '');
    setEditTipo(item.specs?.tipo || '');
    setEditVelocidad(item.specs?.velocidad || '');
    setEditFormato(item.specs?.formato || '');
    setEditVoltaje(item.specs?.voltaje?.toString() || '');
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
      formData.append('specs', JSON.stringify({
        cantidad: Number(editCantidad),
        capacidadPorModulo: editCapacidadPorModulo,
        total: editTotal,
        tipo: editTipo,
        velocidad: editVelocidad,
        formato: editFormato,
        voltaje: Number(editVoltaje),
      }));
  
      if (editImage) {
        formData.append('image', editImage);
      }
  
      await ramService.updateRam(selected._id, formData);
      toast.success('RAM actualizada correctamente');
      await loadRams();
      setIsEditModalOpen(false);
      setSelected(null);
    } catch (error) {
      console.error('Error al actualizar RAM:', error);
      toast.error('Error al actualizar RAM');
    }
  };

  // Eliminar
  const handleDelete = async () => {
    try {
      await ramService.deleteRam(selected._id);
      toast.success('RAM eliminada correctamente');
      await loadRams();
      setIsDeleteModalOpen(false);
      setSelected(null);
    } catch (error) {
      console.error('Error al eliminar RAM:', error);
      toast.error('Error al eliminar RAM');
    }
  };  

  const filteredData = rams
  .filter((item) => {
    const matchesName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo ? item.specs?.tipo === filterTipo : true;
    const matchesFormato = filterFormato ? item.specs?.formato === filterFormato : true;
    const matchesCapacidad = filterCapacidad ? item.specs?.capacidadPorModulo === filterCapacidad : true;
    const matchesVelocidad = filterVelocidad ? item.specs?.velocidad === filterVelocidad : true;
    const matchesVoltaje = filterVoltaje ? item.specs?.voltaje?.toString() === filterVoltaje : true;
    const matchesPriceMin = filterPriceMin ? item.price >= parseInt(filterPriceMin) : true;
    const matchesPriceMax = filterPriceMax ? item.price <= parseInt(filterPriceMax) : true;

    return (
      matchesName &&
      matchesTipo &&
      matchesFormato &&
      matchesCapacidad &&
      matchesVoltaje &&
      matchesPriceMin &&
      matchesVelocidad &&
      matchesPriceMax 
    );
  })
  // Función auxiliar para obtener valores anidados usando dot notation
function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

const sortedData = filteredData.sort((a, b) => {
  const fieldA = getNestedValue(a, sortField);
  const fieldB = getNestedValue(b, sortField);

  if (typeof fieldA === 'string') {
    return sortDirection === 'asc'
      ? fieldA.localeCompare(fieldB)
      : fieldB.localeCompare(fieldA);
  } else if (typeof fieldA === 'number') {
    return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
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
        Admin <span className="mx-2">{'>'}</span> <span className="font-semibold">RAMs</span>
      </div>

      <div className="flex gap-6">
        {/* Filtros */}
        <div className="w-64 bg-[#1A1A1A] p-5 rounded-xl shadow-lg border border-[#7F00FF] text-white">
          <h3 className="text-lg font-bold text-acento mb-5">Filtros</h3>

          <div className="flex flex-col gap-5 text-sm font-medium text-blancoHueso">
            {/* DDR */}
            <div>
              <label className="block mb-1 text-textoSecundario">Tipo:</label>
              <Select
                size="small"
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="DDR3">DDR3</MenuItem>
                <MenuItem value="DDR4">DDR4</MenuItem>
                <MenuItem value="DDR5">DDR5</MenuItem>
              </Select>
            </div>

            {/* Capacidad */}
            <div>
              <label className="block mb-1 text-textoSecundario">Capacidad por módulo:</label>
              <Select
                size="small"
                value={filterCapacidad}
                onChange={(e) => setFilterCapacidad(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="8 GB">8 GB</MenuItem>
                <MenuItem value="16 GB">16 GB</MenuItem>
                <MenuItem value="32 GB">32 GB</MenuItem>
              </Select>
            </div>

            {/* Velocidad */}
            <div>
              <label className="block mb-1 text-textoSecundario">Velocidad:</label>
              <Select
                size="small"
                value={filterVelocidad}
                onChange={(e) => setFilterVelocidad(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="2666 MT/s">2666 MT/s</MenuItem>
                <MenuItem value="3000 MT/s">3000 MT/s</MenuItem>
                <MenuItem value="3200 MT/s">3200 MT/s</MenuItem>
                <MenuItem value="3600 MT/s">3600 MT/s</MenuItem>
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
                <MenuItem value="DIMMV">DIMMV</MenuItem>
                <MenuItem value="SO-DIMM">SO-DIMM</MenuItem>
              </Select>
            </div>

            {/* Volataje */}
            <div>
              <label className="block mb-1 text-textoSecundario">Voltaje:</label>
              <Select
                size="small"
                value={filterVoltaje}
                onChange={(e) => setFilterVoltaje(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="1.2">1.2V</MenuItem>
                <MenuItem value="1.35">1.35V</MenuItem>
                <MenuItem value="1.5">1.5V</MenuItem>
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
                {['name','model','specs.capacidadPorModulo','specs.tipo','specs.velocidad','specs.formato','specs.voltaje','price',].map((field) => (
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
                      {field === 'specs.capacidadPorModulo' && 'Capacidad'}
                      {field === 'specs.tipo' && 'Tipo'}
                      {field === 'specs.velocidad' && 'Velocidad'}
                      {field === 'specs.formato' && 'Formato'}
                      {field === 'specs.voltaje' && 'Voltaje'}
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
                    <TableCell className="font-medium">{item.specs?.capacidadPorModulo || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.tipo || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.velocidad || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.formato || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.voltaje || '—'}</TableCell>

                    <TableCell className="font-medium">
                      ${item.price?.toLocaleString('es-CL') || '—'}
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
            <h3 className="text-xl font-bold mb-4 text-acento">Agregar nueva RAM</h3>

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

              {/* Cantidad */}
              <TextField
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Capacidad por módulo */}
              <TextField
                label="Capacidad por módulo"
                value={capacidadPorModulo}
                onChange={(e) => setCapacidadPorModulo(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Capacidad total */}
              <TextField
                label="Capacidad total"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Tipo */}
              <TextField
                label="Tipo (ej. DDR4)"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Velocidad */}
              <TextField
                label="Velocidad (ej. 3200 MT/s)"
                value={velocidad}
                onChange={(e) => setVelocidad(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Formato */}
              <TextField
                label="Formato (ej. DIMM)"
                value={formato}
                onChange={(e) => setFormato(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Voltaje */}
              <TextField
                label="Voltaje"
                type="number"
                value={voltaje}
                onChange={(e) => setVoltaje(e.target.value)}
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
            <h3 className="text-xl font-bold mb-4 text-acento">Editar RAM</h3>

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

              {/* Link */}
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

              {/* Cantidad */}
              <TextField
                label="Cantidad"
                type="number"
                value={editCantidad}
                onChange={(e) => setEditCantidad(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Capacidad por módulo */}
              <TextField
                label="Capacidad por módulo"
                value={editCapacidadPorModulo}
                onChange={(e) => setEditCapacidadPorModulo(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Capacidad total */}
              <TextField
                label="Capacidad total"
                value={editTotal}
                onChange={(e) => setEditTotal(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Tipo */}
              <TextField
                label="Tipo"
                value={editTipo}
                onChange={(e) => setEditTipo(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Velocidad */}
              <TextField
                label="Velocidad"
                value={editVelocidad}
                onChange={(e) => setEditVelocidad(e.target.value)}
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

              {/* Voltaje */}
              <TextField
                label="Voltaje"
                type="number"
                value={editVoltaje}
                onChange={(e) => setEditVoltaje(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Imagen */}
              <div className="col-span-2">
                <label className="block mb-1 text-sm font-semibold text-blancoHueso">
                  Imagen del producto
                </label>
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
            <h3 className="text-xl font-bold mb-4 text-acento">¿Eliminar RAM?</h3>

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
