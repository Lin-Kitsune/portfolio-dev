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
import { diskService } from '@/services/diskService';
import { toast } from 'react-toastify';

export default function DisksAdmin() {
  const [disks, setDisks] = useState<any[]>([]);

  useEffect(() => {
    diskService.getDisks()
      .then(setDisks)
      .catch(console.error);
  }, []);

  // Variables para agregar
  const [nombre, setNombre] = useState('');
  const [link, setLink] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipo, setTipo] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [bus, setBus] = useState('');
  const [rpm, setRpm] = useState('');
  const [tamano, setTamano] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Variables para editar
  const [editNombre, setEditNombre] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editTipo, setEditTipo] = useState('');
  const [editCapacidad, setEditCapacidad] = useState('');
  const [editBus, setEditBus] = useState('');
  const [editRpm, setEditRpm] = useState('');
  const [editTamano, setEditTamano] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDisk, setSelectedDisk] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterTamano, setFilterTamano] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('');
  const [filterBus, setFilterBus] = useState('');
  const [filterRpm, setFilterRpm] = useState('');

  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


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

  //  Aregar
  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', nombre);
      formData.append('price', precio.toString());
      formData.append('link', link);
  
      formData.append('specs', JSON.stringify({
        tipo,
        capacidad,
        bus,
        rpm: rpm ? parseInt(rpm) : null,
        tamaño: tamano,
      }));
  
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      await diskService.createDisk(formData);
      toast.success('Disco agregado correctamente');
  
      const updatedDisks = await diskService.getDisks();
      setDisks(updatedDisks);
  
      // Reset
      setIsModalOpen(false);
      setNombre('');
      setPrecio('');
      setLink('');
      setTipo('');
      setCapacidad('');
      setBus('');
      setRpm('');
      setTamano('');
      setImageFile(null);
      setPreview(null);
  
    } catch (error) {
      console.error('Error al crear disco:', error);
      toast.error('Hubo un error al guardar el disco');
    }
  };

  // Editar
  const handleEditClick = (item: any) => {
    setSelectedDisk(item);
    setEditNombre(item.name);
    setEditLink(item.link);
    setEditPrecio(item.price);
    setEditTipo(item.specs?.tipo || '');
    setEditCapacidad(item.specs?.capacidad || '');
    setEditBus(item.specs?.bus || '');
    setEditRpm(item.specs?.rpm?.toString() || '');
    setEditTamano(item.specs?.tamaño || '');
    setPreview(item.imagePath ? `http://localhost:5000/${item.imagePath}` : null);
    setIsEditModalOpen(true);
  };
  
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editNombre);
      formData.append('price', editPrecio.toString());
      formData.append('link', editLink);
  
      formData.append('specs', JSON.stringify({
        tipo: editTipo,
        capacidad: editCapacidad,
        bus: editBus,
        rpm: editRpm ? parseInt(editRpm) : null,
        tamaño: editTamano,
      }));
  
      if (editImage) {
        formData.append('image', editImage);
      }
  
      await diskService.updateDisk(selectedDisk._id, formData);
      toast.success('Disco actualizado correctamente');
  
      const updatedDisks = await diskService.getDisks();
      setDisks(updatedDisks);
      setIsEditModalOpen(false);
  
    } catch (error) {
      console.error('Error al actualizar disco:', error);
      toast.error('Hubo un error al actualizar el disco');
    }
  };  

  // Eliminar
  const handleDeleteClick = (item: any) => {
    setSelectedDisk(item);
    setIsDeleteModalOpen(true);
  };
  
  const handleDelete = async () => {
    if (!selectedDisk?._id) return;
  
    try {
      await diskService.deleteDisk(selectedDisk._id);
      toast.success('Disco eliminado correctamente');
  
      const updatedDisks = await diskService.getDisks();
      setDisks(updatedDisks);
  
      setIsDeleteModalOpen(false);
      setSelectedDisk(null);
    } catch (error) {
      console.error('Error al eliminar disco:', error);
      toast.error('Hubo un error al eliminar el disco');
    }
  };

  const filteredData = disks
  .filter((item) => {
    const specs = item.specs || {};
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? specs.tipo?.toLowerCase() === filterType.toLowerCase() : true;
    const matchesCapacity = filterCapacity
      ? specs.capacidad?.replace(/\s/g, '').toLowerCase() === filterCapacity.replace(/\s/g, '').toLowerCase()
      : true;
    const matchesBus = filterBus
      ? specs.bus?.toLowerCase() === filterBus.toLowerCase()
      : true;
    const matchesTamano = filterTamano
      ? specs.tamaño?.replace(/\s/g, '').toLowerCase() === filterTamano.replace(/\s/g, '').toLowerCase()
      : true;
    const matchesRpm = filterRpm
      ? specs.rpm?.toString() === filterRpm
      : true;
    const matchesPrice =
      (!filterPriceMin || item.price >= parseInt(filterPriceMin)) &&
      (!filterPriceMax || item.price <= parseInt(filterPriceMax));

    return (
      matchesSearch &&
      matchesType &&
      matchesCapacity &&
      matchesBus &&
      matchesTamano &&
      matchesRpm &&
      matchesPrice
    );
  })
  .sort((a, b) => {
    let fieldA, fieldB;
  
    if (sortField === 'tamano') {
      // Para 'tamano', tomamos el campo correcto y lo convertimos en número real
      fieldA = parseFloat((a.specs?.tamaño || '').replace(/[^\d.]/g, '')) || 0;
      fieldB = parseFloat((b.specs?.tamaño || '').replace(/[^\d.]/g, '')) || 0;
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    }
  
    // para los demás campos normales
    if (sortField in a) {
      fieldA = a[sortField];
      fieldB = b[sortField];
    } else if (sortField && a.specs && sortField in a.specs) {
      fieldA = a.specs[sortField];
      fieldB = b.specs[sortField];
    }
  
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc'
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
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
        Admin <span className="mx-2">{'>'}</span> <span className="font-semibold">Discos</span>
      </div>

      <div className="flex gap-6">
        {/* Filtros */}
        <div className="w-64 bg-[#1A1A1A] p-5 rounded-xl shadow-lg border border-[#7F00FF] text-white">
          <h3 className="text-lg font-bold text-acento mb-5">Filtros</h3>

          <div className="flex flex-col gap-5 text-sm font-medium text-blancoHueso">
            {/* Tipo de disco */}
            <div>
              <label className="block mb-1 text-textoSecundario">Tipo:</label>
              <Select
                size="small"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="HDD">HDD</MenuItem>
                <MenuItem value="SSD">SSD</MenuItem>
                <MenuItem value="NVMe">M.2 NVMe</MenuItem>
              </Select>
            </div>

            {/* Capacidad */}
            <div>
              <label className="block mb-1 text-textoSecundario">Capacidad:</label>
              <Select
                size="small"
                value={filterCapacity}
                onChange={(e) => setFilterCapacity(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="256GB">256 GB</MenuItem>
                <MenuItem value="512GB">512 GB</MenuItem>
                <MenuItem value="1TB">1 TB</MenuItem>
                <MenuItem value="2TB">2 TB</MenuItem>
                <MenuItem value="6TB">6 TB</MenuItem>
              </Select>
            </div>

            {/* Bus (Interfaz) */}
            <div>
              <label className="block mb-1 text-textoSecundario">Bus (Interfaz):</label>
              <Select
                size="small"
                value={filterBus}
                onChange={(e) => setFilterBus(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="SATA 3 (6.0 Gb/s)">SATA 3 (6.0 Gb/s)</MenuItem>
                <MenuItem value="PCIe Gen3">PCIe Gen3</MenuItem>
                <MenuItem value="PCIe Gen4">PCIe Gen4</MenuItem>
              </Select>
            </div>

            {/* Tamaño */}
            <div>
              <label className="block mb-1 text-textoSecundario">Tamaño:</label>
              <Select
                size="small"
                value={filterTamano}
                onChange={(e) => setFilterTamano(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="2.5&quot;">2.5"</MenuItem>
                <MenuItem value="3.5&quot;">3.5"</MenuItem>
              </Select>
            </div>

            {/* Rango de precios */}
            <div className="flex flex-col">
              <label className="mb-1 text-textoSecundario">Rango de precios:</label>
              <div className="flex gap-2">
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="$ Mín"
                  type="number"
                  value={filterPriceMin}
                  onChange={(e) => setFilterPriceMin(e.target.value)}
                  InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                  sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
                />
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="$ Máx"
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
                  {['name', 'tipo', 'capacidad', 'rpm', 'tamano', 'bus', 'price'].map((field) => (
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
                      {field === 'tipo' && 'Tipo'}
                      {field === 'capacidad' && 'Capacidad'}
                      {field === 'rpm' && 'RPM'}
                      {field === 'tamano' && 'Tamaño'}
                      {field === 'bus' && 'Bus'}
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
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-medium">{item.specs?.tipo || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.capacidad || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.rpm ? `${item.specs.rpm} RPM` : 'N/A'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.tamaño || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.bus || 'N/A'}</TableCell>
                    <TableCell className="font-medium">
                      ${item.price?.toLocaleString('es-CL')}
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
            <h3 className="text-xl font-bold mb-4 text-acento">Agregar nuevo disco</h3>

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

              {/* Link */}
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

              {/* Tipo */}
              <TextField
                label="Tipo (HDD, SSD, NVMe)"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Capacidad */}
              <TextField
                label="Capacidad (ej: 1TB)"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Bus */}
              <TextField
                label="Bus (ej: SATA, PCIe)"
                value={bus}
                onChange={(e) => setBus(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* RPM */}
              <TextField
                label="RPM (solo HDD)"
                type="number"
                value={rpm}
                onChange={(e) => setRpm(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Tamaño */}
              <TextField
                label="Tamaño (ej: 2.5'', 3.5'')"
                value={tamano}
                onChange={(e) => setTamano(e.target.value)}
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
                  <img src={preview} alt="Vista previa" className="mt-2 max-h-40 rounded border border-[#333]" />
                )}
              </div>

              {/* Botones */}
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <Button
                  variant="outlined"
                  onClick={() => setIsModalOpen(false)}
                  sx={{ borderColor: '#FF4D4F', color: '#FF4D4F', textTransform: 'none', fontWeight: 'bold' }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  sx={{ backgroundColor: '#7F00FF', '&:hover': { backgroundColor: '#5A32A3' }, color: '#fff', textTransform: 'none', fontWeight: 'bold' }}
                >
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de editar */}
      {isEditModalOpen && selectedDisk && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-md shadow-xl border border-[#7F00FF] relative text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">Editar disco</h3>

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

              {/* Tipo */}
              <TextField
                label="Tipo (HDD, SSD, NVMe)"
                value={editTipo}
                onChange={(e) => setEditTipo(e.target.value)}
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

              {/* RPM */}
              <TextField
                label="RPM (opcional)"
                value={editRpm}
                onChange={(e) => setEditRpm(e.target.value)}
                type="number"
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Tamaño */}
              <TextField
                label="Tamaño"
                value={editTamano}
                onChange={(e) => setEditTamano(e.target.value)}
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
                  <img src={preview} alt="Vista previa" className="mt-2 max-h-40 rounded border border-[#333]" />
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
                  sx={{ backgroundColor: '#7F00FF', '&:hover': { backgroundColor: '#5A32A3' }, color: '#fff' }}
                >
                  Guardar cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Moodal de eliminar */}
      {isDeleteModalOpen && selectedDisk && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-sm shadow-xl border border-[#7F00FF] text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">¿Eliminar disco?</h3>
            <p className="mb-6 text-blancoHueso">
              ¿Estás seguro de que deseas eliminar <strong>{selectedDisk.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                onClick={() => setIsDeleteModalOpen(false)} 
                variant="outlined" 
                sx={{ borderColor: '#FF4D4F', color: '#FF4D4F' }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleDelete} 
                variant="contained" 
                sx={{ backgroundColor: '#FF4D4F', color: '#fff' }}
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
