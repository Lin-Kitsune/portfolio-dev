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
import { fanService } from '@/services/fanService';
import { toast } from 'react-toastify';

export default function FansAdmin() {
  const [fans, setFans] = useState<any[]>([]);  

  // Variables para agregar
  const [nombre, setNombre] = useState('');
  const [modelo, setModelo] = useState('');
  const [precio, setPrecio] = useState('');
  const [link, setLink] = useState('');
  const [tamano, setTamano] = useState('');
  const [iluminacion, setIluminacion] = useState('');
  const [bearing, setBearing] = useState('');
  const [flujoAire, setFlujoAire] = useState('');
  const [rpm, setRpm] = useState('');
  const [ruido, setRuido] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);


  // Variables para editar
  const [editNombre, setEditNombre] = useState('');
  const [editModelo, setEditModelo] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editTamano, setEditTamano] = useState('');
  const [editIluminacion, setEditIluminacion] = useState('');
  const [editBearing, setEditBearing] = useState('');
  const [editFlujoAire, setEditFlujoAire] = useState('');
  const [editRpm, setEditRpm] = useState('');
  const [editRuido, setEditRuido] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [selectedFan, setSelectedFan] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filtros
  const [filterSize, setFilterSize] = useState('');
  const [filterRpm, setFilterRpm] = useState('');
  const [filterRgb, setFilterRgb] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');  
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  // Modales
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

  useEffect(() => {
    loadFans();
  }, []);

  const loadFans = async () => {
    try {
      const res = await fanService.getFans();
      setFans(res);
    } catch (error) {
      console.error('Error al cargar fans:', error);
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
  
  // Crear Fan
  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', nombre);
      formData.append('price', precio.toString());
      formData.append('link', link);
      formData.append('model', modelo);
  
      formData.append('specs', JSON.stringify({
        tamaño: tamano,
        iluminacion: iluminacion,
        bearing: bearing,
        flujoAire: flujoAire,
        rpm: rpm,
        ruido: ruido,
      }));
  
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      await fanService.createFan(formData);
      toast.success('Ventilador agregado correctamente');
  
      await loadFans();
      // Reset
      setIsModalOpen(false);
      setNombre('');
      setPrecio('');
      setLink('');
      setModelo('');
      setTamano('');
      setIluminacion('');
      setBearing('');
      setFlujoAire('');
      setRpm('');
      setRuido('');
      setImageFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Error al crear fan:', error);
      toast.error('Error al crear ventilador');
    }
  };
  
  
  // Editar Fan
  const handleEditClick = (item: any) => {
    setSelectedFan(item);
    setEditNombre(item.name);
    setEditPrecio(item.price);
    setEditLink(item.link);
    setEditModelo(item.model);
    setEditTamano(item.specs?.tamaño || '');
    setEditIluminacion(item.specs?.iluminacion || '');
    setEditBearing(item.specs?.bearing || '');
    setEditFlujoAire(item.specs?.flujoAire || '');
    setEditRpm(item.specs?.rpm?.toString() || '');
    setEditRuido(item.specs?.ruido || '');
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
        tamaño: editTamano,
        iluminacion: editIluminacion,
        bearing: editBearing,
        flujoAire: editFlujoAire,
        rpm: editRpm,
        ruido: editRuido,
      }));
  
      if (editImage) {
        formData.append('image', editImage);
      }
  
      await fanService.updateFan(selectedFan._id, formData);
      toast.success('Ventilador actualizado correctamente');
  
      await loadFans();
      setIsEditModalOpen(false);
      setSelectedFan(null);
    } catch (error) {
      console.error('Error al actualizar fan:', error);
      toast.error('Error al actualizar ventilador');
    }
  };  
  
  // Eliminar Fan
  const handleDeleteClick = (item: any) => {
      setSelectedFan(item);
      setIsDeleteModalOpen(true);
  };
  
  const handleDelete = async () => {
    if (!selectedFan?._id) return;
  
    try {
      await fanService.deleteFan(selectedFan._id);
      toast.success('Ventilador eliminado correctamente');
  
      await loadFans();
      setIsDeleteModalOpen(false);
      setSelectedFan(null);
    } catch (error) {
      console.error('Error al eliminar fan:', error);
      toast.error('Error al eliminar ventilador');
    }
  };    

  const filteredData = fans
  .filter((item) => {
    const specs = item.specs || {};

    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSize = filterSize
      ? specs.tamaño?.replace(/\s/g, '').toLowerCase() === filterSize.toLowerCase()
      : true;

    const matchesRpm = filterRpm
      ? filterRpm === 'mas2000'
        ? specs.rpm && specs.rpm > 2000
        : specs.rpm && specs.rpm <= parseInt(filterRpm)
      : true;

    const matchesRgb = filterRgb
      ? filterRgb === 'sí'
        ? specs.iluminacion?.toLowerCase().includes('rgb')
        : !specs.iluminacion?.toLowerCase().includes('rgb')
      : true;
    const matchesPriceMin = filterPriceMin ? item.price >= parseInt(filterPriceMin) : true;
    const matchesPriceMax = filterPriceMax ? item.price <= parseInt(filterPriceMax) : true;

    return matchesSearch && matchesSize && matchesRpm && matchesRgb && matchesPriceMin &&
    matchesPriceMax;
  })
  .sort((a, b) => {
    const fieldA = a[sortField as keyof typeof a] || a.specs?.[sortField];
    const fieldB = b[sortField as keyof typeof b] || b.specs?.[sortField];

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
        Admin <span className="mx-2">{'>'}</span> <span className="font-semibold">Fans</span>
      </div>

      <div className="flex gap-6">
        {/* Filtros */}
        <div className="w-64 bg-[#1A1A1A] p-5 rounded-xl shadow-lg border border-[#7F00FF] text-white">
          <h3 className="text-lg font-bold text-acento mb-5">Filtros</h3>

          <div className="flex flex-col gap-5 text-sm font-medium text-blancoHueso">
            {/* Tamaño */}
            <div>
              <label className="block mb-1 text-textoSecundario">Tamaño:</label>
              <Select
                size="small"
                value={filterSize}
                onChange={(e) => setFilterSize(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="80mm">80mm</MenuItem>
                <MenuItem value="120mm">120mm</MenuItem>
                <MenuItem value="140mm">140mm</MenuItem>
              </Select>
            </div>

            {/* RPM */}
            <div>
              <label className="block mb-1 text-textoSecundario">RPM:</label>
              <Select
                size="small"
                value={filterRpm}
                onChange={(e) => setFilterRpm(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="1000">Hasta 1000 RPM</MenuItem>
                <MenuItem value="1500">Hasta 1500 RPM</MenuItem>
                <MenuItem value="2000">Hasta 2000 RPM</MenuItem>
                <MenuItem value="mas2000">Más de 2000 RPM</MenuItem>
              </Select>
            </div>

            {/* RGB */}
            <div>
              <label className="block mb-1 text-textoSecundario">¿Incluye RGB?</label>
              <Select
                size="small"
                value={filterRgb}
                onChange={(e) => setFilterRgb(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="sí">Sí</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </div>

            {/* Rango de precios */}
            <div className="flex flex-col">
              <label className="mb-1 text-textoSecundario">Rango de precios:</label>
              <div className="flex gap-2">
                <TextField
                  size="small"
                  placeholder="$ Mín"
                  type="number"
                  value={filterPriceMin}
                  onChange={(e) => setFilterPriceMin(e.target.value)}
                  InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                  sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
                />
                <TextField
                  size="small"
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
                  color: '#FFFFFF'
                  ,
                },
                '& .MuiTableRow-root:last-child .MuiTableCell-root': {
                  borderBottom: 'none',
                },
              }}
            >
              <TableHead>
                <TableRow className="bg-[#7F00FF]">
                  {['name', 'model',  'tamaño', 'iluminacion', 'bearing',  'flujoAire', 'rpm',  'ruido',  'price' ].map((field) => (
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
                      {field === 'tamaño' && 'Tamaño'}
                      {field === 'iluminacion' && 'Iluminación'}
                      {field === 'bearing' && 'Bearing'}
                      {field === 'flujoAire' && 'Flujo Aire'}
                      {field === 'rpm' && 'RPM'}
                      {field === 'ruido' && 'Ruido'}
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
                    <TableCell className="font-medium">{item.model || '-'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.tamaño || '-'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.iluminacion || '-'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.bearing || '-'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.flujoAire || '-'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.rpm ? `${item.specs.rpm} RPM` : '-'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.ruido || '-'}</TableCell>
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
            <h3 className="text-xl font-bold mb-4 text-acento">Agregar nuevo ventilador</h3>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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

              {/* Tamaño */}
              <TextField
                label="Tamaño (ej: 120 mm)"
                value={tamano}
                onChange={(e) => setTamano(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Iluminación */}
              <TextField
                label="Iluminación"
                value={iluminacion}
                onChange={(e) => setIluminacion(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Bearing */}
              <TextField
                label="Tipo de Bearing"
                value={bearing}
                onChange={(e) => setBearing(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Flujo de aire */}
              <TextField
                label="Flujo de Aire (ej: 72.8 CFM)"
                value={flujoAire}
                onChange={(e) => setFlujoAire(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* RPM */}
              <TextField
                label="RPM"
                value={rpm}
                onChange={(e) => setRpm(e.target.value)}
                type="number"
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Ruido */}
              <TextField
                label="Ruido (ej: 36 dB)"
                value={ruido}
                onChange={(e) => setRuido(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Imagen (ocupa toda la fila) */}
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
      {isEditModalOpen && selectedFan && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-2xl shadow-xl border border-[#7F00FF] relative text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">Editar ventilador</h3>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <TextField
                label="Nombre"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />
              <TextField
                label="Modelo"
                value={editModelo}
                onChange={(e) => setEditModelo(e.target.value)}
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />
              <TextField
                label="Link del producto"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />
              <TextField
                label="Precio"
                type="number"
                value={editPrecio}
                onChange={(e) => setEditPrecio(e.target.value)}
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />
              <TextField
                label="Tamaño"
                value={editTamano}
                onChange={(e) => setEditTamano(e.target.value)}
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />
              <TextField
                label="Iluminación"
                value={editIluminacion}
                onChange={(e) => setEditIluminacion(e.target.value)}
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />
              <TextField
                label="Bearing"
                value={editBearing}
                onChange={(e) => setEditBearing(e.target.value)}
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />
              <TextField
                label="Flujo de Aire (ej: 72.8 CFM)"
                value={editFlujoAire}
                onChange={(e) => setEditFlujoAire(e.target.value)}
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />
              <TextField
                label="RPM"
                type="number"
                value={editRpm}
                onChange={(e) => setEditRpm(e.target.value)}
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />
              <TextField
                label="Ruido (ej: 36 dB)"
                value={editRuido}
                onChange={(e) => setEditRuido(e.target.value)}
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
                {preview && <img src={preview} alt="Preview" className="mt-2 max-h-40 rounded border border-[#333]" />}
              </div>

              {/* Botones */}
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <Button onClick={() => setIsEditModalOpen(false)} variant="outlined" sx={{ borderColor: '#FF4D4F', color: '#FF4D4F' }}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdate} variant="contained" sx={{ backgroundColor: '#7F00FF', '&:hover': { backgroundColor: '#5A32A3' }, color: '#fff' }}>
                  Guardar cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de eliminar */}
      {isDeleteModalOpen && selectedFan && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-sm shadow-xl border border-[#7F00FF] text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">¿Eliminar ventilador?</h3>
            <p className="mb-6 text-blancoHueso">
              ¿Estás seguro de que deseas eliminar <strong>{selectedFan.name}</strong>? Esta acción no se puede deshacer.
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
