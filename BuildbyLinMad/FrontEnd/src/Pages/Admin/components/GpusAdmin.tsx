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
import { gpuService } from '@/services/gpuService';
import { toast } from 'react-toastify';

export default function GpusAdmin() {
  const [gpus, setGpus] = useState<any[]>([]);

  // Variables para agregar
  const [nombre, setNombre] = useState('');
  const [modelo, setModelo] = useState('');
  const [precio, setPrecio] = useState('');
  const [link, setLink] = useState('');
  const [gpu, setGpu] = useState('');
  const [vramCantidad, setVramCantidad] = useState('');
  const [vramTipo, setVramTipo] = useState('');
  const [vramBus, setVramBus] = useState('');
  const [baseClock, setBaseClock] = useState('');
  const [boostClock, setBoostClock] = useState('');
  const [ocClock, setOcClock] = useState('');
  const [frecuenciaMemorias, setFrecuenciaMemorias] = useState('');
  const [busInterface, setBusInterface] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Variables para editar
  const [editNombre, setEditNombre] = useState('');
  const [editModelo, setEditModelo] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editGpu, setEditGpu] = useState('');
  const [editVramCantidad, setEditVramCantidad] = useState('');
  const [editVramTipo, setEditVramTipo] = useState('');
  const [editVramBus, setEditVramBus] = useState('');
  const [editBaseClock, setEditBaseClock] = useState('');
  const [editBoostClock, setEditBoostClock] = useState('');
  const [editOcClock, setEditOcClock] = useState('');
  const [editFrecuenciaMemorias, setEditFrecuenciaMemorias] = useState('');
  const [editBusInterface, setEditBusInterface] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);

  const [selectedGpu, setSelectedGpu] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // filtros
  const [filterBrand, setFilterBrand] = useState('');
  const [filterVram, setFilterVram] = useState('');
  const [filterChipset, setFilterChipset] = useState('');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadGpus();
  }, []);

  const loadGpus = async () => {
    try {
      const data = await gpuService.getGpus();
      setGpus(data);
    } catch (error) {
      console.error('Error al cargar GPUs:', error);
      toast.error('Error al cargar GPUs');
    }
  };

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

  // Agregar gpu
  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', nombre);
      formData.append('price', precio.toString());
      formData.append('link', link);
      formData.append('model', modelo);
  
      formData.append('specs', JSON.stringify({
        gpu,
        memoria: {
          cantidad: vramCantidad,
          tipo: vramTipo,
          bus: vramBus,
        },
        frecuenciaCore: {
          base: baseClock,
          boost: boostClock,
          oc: ocClock,
        },
        frecuenciaMemorias,
        bus: busInterface,
      }));
  
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      await gpuService.createGpu(formData);
      toast.success('GPU agregada correctamente');
  
      await loadGpus();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error al crear GPU:', error);
      toast.error('Error al crear GPU');
    }
  };
  
  const resetForm = () => {
    setNombre('');
    setModelo('');
    setPrecio('');
    setLink('');
    setGpu('');
    setVramCantidad('');
    setVramTipo('');
    setVramBus('');
    setBaseClock('');
    setBoostClock('');
    setOcClock('');
    setFrecuenciaMemorias('');
    setBusInterface('');
    setImageFile(null);
    setPreview(null);
  };
  
  // editar gpu
  const handleEditClick = (item: any) => {
    setSelectedGpu(item);
    setEditNombre(item.name);
    setEditPrecio(item.price);
    setEditLink(item.link);
    setEditModelo(item.model);
  
    setEditGpu(item.specs?.gpu || '');
    setEditVramCantidad(item.specs?.memoria?.cantidad || '');
    setEditVramTipo(item.specs?.memoria?.tipo || '');
    setEditVramBus(item.specs?.memoria?.bus || '');
    setEditBaseClock(item.specs?.frecuenciaCore?.base || '');
    setEditBoostClock(item.specs?.frecuenciaCore?.boost || '');
    setEditOcClock(item.specs?.frecuenciaCore?.oc || '');
    setEditFrecuenciaMemorias(item.specs?.frecuenciaMemorias || '');
    setEditBusInterface(item.specs?.bus || '');
  
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
        gpu: editGpu,
        memoria: {
          cantidad: editVramCantidad,
          tipo: editVramTipo,
          bus: editVramBus,
        },
        frecuenciaCore: {
          base: editBaseClock,
          boost: editBoostClock,
          oc: editOcClock,
        },
        frecuenciaMemorias: editFrecuenciaMemorias,
        bus: editBusInterface,
      }));
  
      if (editImage) {
        formData.append('image', editImage);
      }
  
      await gpuService.updateGpu(selectedGpu._id, formData);
      toast.success('GPU actualizada correctamente');
  
      await loadGpus();
      setIsEditModalOpen(false);
      setSelectedGpu(null);
    } catch (error) {
      console.error('Error al actualizar GPU:', error);
      toast.error('Error al actualizar GPU');
    }
  };

  // eliminar gpu
  const handleDeleteClick = (item: any) => {
    setSelectedGpu(item);
    setIsDeleteModalOpen(true);
  };
  
  const handleDelete = async () => {
    if (!selectedGpu?._id) return;
  
    try {
      await gpuService.deleteGpu(selectedGpu._id);
      toast.success('GPU eliminada correctamente');
  
      await loadGpus();
      setIsDeleteModalOpen(false);
      setSelectedGpu(null);
    } catch (error) {
      console.error('Error al eliminar GPU:', error);
      toast.error('Error al eliminar GPU');
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

  const filteredData = gpus
  .filter((item) => {
    const matchesName = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    const brand = item.specs?.gpu?.toLowerCase().includes('nvidia')
      ? 'NVIDIA'
      : item.specs?.gpu?.toLowerCase().includes('amd')
      ? 'AMD'
      : '';

    const matchesBrand = filterBrand ? brand === filterBrand : true;
    const matchesVram = filterVram
      ? item.specs?.memoria?.cantidad?.toString() === filterVram
      : true;
    const matchesChipset = filterChipset
      ? item.specs?.gpu?.toLowerCase().includes(filterChipset.toLowerCase())
      : true;
    const matchesPriceMin = filterPriceMin
      ? item.price >= parseInt(filterPriceMin)
      : true;
    const matchesPriceMax = filterPriceMax
      ? item.price <= parseInt(filterPriceMax)
      : true;

    return matchesName && matchesBrand && matchesVram && matchesChipset && matchesPriceMin && matchesPriceMax;
  })
  .sort((a, b) => {
    let fieldA, fieldB;

    if (sortField in a) {
      fieldA = a[sortField];
      fieldB = b[sortField];
    } else if (sortField && a.specs && sortField in a.specs) {
      fieldA = a.specs[sortField];
      fieldB = b.specs[sortField];
    }

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
        Admin <span className="mx-2">{'>'}</span> <span className="font-semibold">Gpus</span>
      </div>

      <div className="flex gap-6">
        {/* Filtros */}
        <div className="w-64 bg-[#1A1A1A] p-5 rounded-xl shadow-lg border border-[#7F00FF] text-white">
          <h3 className="text-lg font-bold text-acento mb-5">Filtros</h3>

          <div className="flex flex-col gap-5 text-sm font-medium text-blancoHueso">
            {/* Marca */}
            <div>
              <label className="block mb-1 text-textoSecundario">Marca:</label>
              <Select
                size="small"
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="NVIDIA">NVIDIA</MenuItem>
                <MenuItem value="AMD">AMD</MenuItem>
              </Select>
            </div>

            {/* VRAM */}
            <div>
              <label className="block mb-1 text-textoSecundario">VRAM:</label>
              <Select
                size="small"
                value={filterVram}
                onChange={(e) => setFilterVram(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="6">6GB</MenuItem>
                <MenuItem value="8">8GB</MenuItem>
                <MenuItem value="12">12GB</MenuItem>
                <MenuItem value="16">16GB</MenuItem>
              </Select>
            </div>

            {/* Chipset */}
            <div>
              <label className="block mb-1 text-textoSecundario">Chipset (GPU):</label>
              <TextField
                size="small"
                placeholder="Ej: RTX 4070"
                value={filterChipset}
                onChange={(e) => setFilterChipset(e.target.value)}
                InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />
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
                  {/* Ahora los encabezados corregidos */}
                  {['name', 'model', 'gpu', 'vram', 'bus', 'base', 'boost', 'oc', 'frecuenciaMemorias', 'price'].map((field) => (
                    <TableCell
                      key={field}
                      onClick={() => handleSort(field)}
                      className="cursor-pointer"
                      sx={{
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                      }}
                    >
                      {field === 'name' && 'Nombre'}
                      {field === 'model' && 'Modelo'}
                      {field === 'gpu' && 'GPU'}
                      {field === 'vram' && 'VRAM'}
                      {field === 'bus' && 'Bus'}
                      {field === 'base' && 'Base Clock'}
                      {field === 'boost' && 'Boost Clock'}
                      {field === 'oc' && 'OC Clock'}
                      {field === 'frecuenciaMemorias' && 'Frecuencia Memorias'}
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
                    key={item._id}
                    className="transition duration-200"
                    sx={{ '&:hover': { backgroundColor: '#1A1A1A' } }}
                  >
                    {/* Ahora cada dato bien mostrado */}
                    <TableCell>{item.name || 'N/A'}</TableCell>
                    <TableCell>{item.model || 'N/A'}</TableCell>
                    <TableCell>{item.specs?.gpu || 'N/A'}</TableCell>
                    <TableCell>
                      {item.specs?.memoria?.cantidad && item.specs?.memoria?.tipo
                        ? `${item.specs.memoria.cantidad}${item.specs.memoria.tipo}`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{item.specs?.memoria?.bus || 'N/A'}</TableCell>
                    <TableCell>{item.specs?.frecuenciaCore?.base ? `${item.specs.frecuenciaCore.base} MHz` : 'N/A'}</TableCell>
                    <TableCell>{item.specs?.frecuenciaCore?.boost ? `${item.specs.frecuenciaCore.boost} MHz` : 'N/A'}</TableCell>
                    <TableCell>{item.specs?.frecuenciaCore?.oc ? `${item.specs.frecuenciaCore.oc} MHz` : 'N/A'}</TableCell>
                    <TableCell>{item.specs?.frecuenciaMemorias ? `${item.specs.frecuenciaMemorias} MHz` : 'N/A'}</TableCell>
                    <TableCell>
                      {item.price ? `$${item.price.toLocaleString('es-CL')}` : 'N/A'}
                    </TableCell>

                    <TableCell className="py-4">
                      <Button
                        size="small"
                        onClick={() => handleEditClick(item)}
                        sx={{
                          minWidth: 'unset',
                          color: '#00FFFF',
                          fontSize: '18px',
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
                        onClick={() => handleDeleteClick(item)}
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
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-md shadow-xl border border-[#7F00FF] relative text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">Agregar nueva GPU</h3>

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

              {/* GPU */}
              <TextField
                label="GPU (ej: AMD Radeon RX 7600)"
                value={gpu}
                onChange={(e) => setGpu(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* VRAM Cantidad */}
              <TextField
                label="Cantidad VRAM (ej: 8)"
                type="number"
                value={vramCantidad}
                onChange={(e) => setVramCantidad(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Tipo VRAM */}
              <TextField
                label="Tipo VRAM (ej: GDDR6)"
                value={vramTipo}
                onChange={(e) => setVramTipo(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Bus VRAM */}
              <TextField
                label="Bus VRAM (ej: 128 bit)"
                value={vramBus}
                onChange={(e) => setVramBus(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Base Clock */}
              <TextField
                label="Base Clock (MHz)"
                type="number"
                value={baseClock}
                onChange={(e) => setBaseClock(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Boost Clock */}
              <TextField
                label="Boost Clock (MHz)"
                type="number"
                value={boostClock}
                onChange={(e) => setBoostClock(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* OC Clock */}
              <TextField
                label="OC Clock (MHz)"
                type="number"
                value={ocClock}
                onChange={(e) => setOcClock(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Frecuencia Memorias */}
              <TextField
                label="Frecuencia Memorias (MHz)"
                type="number"
                value={frecuenciaMemorias}
                onChange={(e) => setFrecuenciaMemorias(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Bus Interface */}
              <TextField
                label="Bus Interface (ej: PCI Express 4.0 x8)"
                value={busInterface}
                onChange={(e) => setBusInterface(e.target.value)}
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

      {/* Modal editar */}
      {isEditModalOpen && selectedGpu && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-2xl shadow-xl border border-[#7F00FF] relative text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">Editar GPU</h3>

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

              {/* GPU */}
              <TextField
                label="GPU (ej: AMD Radeon RX 7600)"
                value={editGpu}
                onChange={(e) => setEditGpu(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* VRAM Cantidad */}
              <TextField
                label="Cantidad VRAM (ej: 8)"
                type="number"
                value={editVramCantidad}
                onChange={(e) => setEditVramCantidad(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Tipo VRAM */}
              <TextField
                label="Tipo VRAM (ej: GDDR6)"
                value={editVramTipo}
                onChange={(e) => setEditVramTipo(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Bus VRAM */}
              <TextField
                label="Bus VRAM (ej: 128 bit)"
                value={editVramBus}
                onChange={(e) => setEditVramBus(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Base Clock */}
              <TextField
                label="Base Clock (MHz)"
                type="number"
                value={editBaseClock}
                onChange={(e) => setEditBaseClock(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Boost Clock */}
              <TextField
                label="Boost Clock (MHz)"
                type="number"
                value={editBoostClock}
                onChange={(e) => setEditBoostClock(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* OC Clock */}
              <TextField
                label="OC Clock (MHz)"
                type="number"
                value={editOcClock}
                onChange={(e) => setEditOcClock(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Frecuencia Memorias */}
              <TextField
                label="Frecuencia Memorias (MHz)"
                type="number"
                value={editFrecuenciaMemorias}
                onChange={(e) => setEditFrecuenciaMemorias(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Bus Interface */}
              <TextField
                label="Bus Interface (ej: PCI Express 4.0 x8)"
                value={editBusInterface}
                onChange={(e) => setEditBusInterface(e.target.value)}
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
                    alt="Preview"
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

      {/* Modal eliminar */}
      {isDeleteModalOpen && selectedGpu && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-sm shadow-xl border border-[#7F00FF] text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">¿Eliminar GPU?</h3>

            <p className="mb-6 text-blancoHueso">
              ¿Estás seguro de que deseas eliminar <strong>{selectedGpu.name}</strong>? Esta acción no se puede deshacer.
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
