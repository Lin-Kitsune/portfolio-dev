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
import { coolerService } from '@/services/coolerService';
import { toast } from 'react-toastify'; 

export default function CoolersAdmin() {
  const [coolers, setCoolers] = useState<any[]>([]);

  useEffect(() => {
    coolerService.getCoolers()
      .then(setCoolers)
      .catch(console.error);
  }, []);  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Filtros>
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');
  const [filterNoiseMin, setFilterNoiseMin] = useState('');
  const [filterNoiseMax, setFilterNoiseMax] = useState('');

  // Variables Argegar
  const [nombre, setNombre] = useState('');
  const [link, setLink] = useState('');
  const [precio, setPrecio] = useState('');
  const [peso, setPeso] = useState('');
  const [rpm, setRpm] = useState('');
  const [ruido, setRuido] = useState('');
  const [flujoAire, setFlujoAire] = useState('');
  const [altura, setAltura] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Variables editar
  const [editNombre, setEditNombre] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editPeso, setEditPeso] = useState('');
  const [editRpm, setEditRpm] = useState('');
  const [editRuido, setEditRuido] = useState('');
  const [editFlujoAire, setEditFlujoAire] = useState('');
  const [editAltura, setEditAltura] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCooler, setSelectedCooler] = useState<any>(null);

  // Paginacion
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

  // Agregar
  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', nombre);
      formData.append('price', precio.toString());
      formData.append('link', link);
  
      formData.append('specs', JSON.stringify({
        peso,
        rpm: rpm ? parseInt(rpm) : null,
        ruido,
        flujoAire,
        altura,
      }));
  
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      await coolerService.createCooler(formData);
      toast.success('Cooler agregado correctamente');
  
      const updatedCoolers = await coolerService.getCoolers();
      setCoolers(updatedCoolers);
  
      // Reset
      setIsModalOpen(false);
      setNombre('');
      setPrecio('');
      setLink('');
      setPeso('');
      setRpm('');
      setRuido('');
      setFlujoAire('');
      setAltura('');
      setImageFile(null);
      setPreview(null);
  
    } catch (error) {
      console.error('Error al crear cooler:', error);
      toast.error('Hubo un error al guardar el cooler');
    }
  };

  // Editar
  const handleEditClick = (item: any) => {
    setSelectedCooler(item);
    setEditNombre(item.name);
    setEditLink(item.link);
    setEditPrecio(item.price);
    setEditPeso(item.specs?.peso || '');
    setEditRpm(item.specs?.rpm?.toString() || '');
    setEditRuido(item.specs?.ruido || '');
    setEditFlujoAire(item.specs?.flujoAire || '');
    setEditAltura(item.specs?.altura || '');
    setPreview(item.imagePath ? `http://localhost:5000/${item.imagePath}` : null); // ajustar si usas otra ruta
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editNombre);
      formData.append('price', editPrecio.toString());
      formData.append('link', editLink);
  
      formData.append('specs', JSON.stringify({
        peso: editPeso,
        rpm: editRpm ? parseInt(editRpm) : null,
        ruido: editRuido,
        flujoAire: editFlujoAire,
        altura: editAltura,
      }));
  
      if (editImage) {
        formData.append('image', editImage);
      }
  
      await coolerService.updateCooler(selectedCooler._id, formData);
      toast.success('Cooler actualizado correctamente');
  
      const updatedCoolers = await coolerService.getCoolers();
      setCoolers(updatedCoolers);
      setIsEditModalOpen(false);
  
    } catch (error) {
      console.error('Error al actualizar cooler:', error);
      toast.error('Hubo un error al actualizar el cooler');
    }
  };  

  // Eliminar
  const handleDeleteClick = (item: any) => {
    setSelectedCooler(item);
    setIsDeleteModalOpen(true);
  };
  
  const handleDelete = async () => {
    if (!selectedCooler?._id) return;
  
    try {
      await coolerService.deleteCooler(selectedCooler._id);
      toast.success('Cooler eliminado correctamente');
  
      const updatedCoolers = await coolerService.getCoolers();
      setCoolers(updatedCoolers);
  
      setIsDeleteModalOpen(false);
      setSelectedCooler(null);
    } catch (error) {
      console.error('Error al eliminar cooler:', error);
      toast.error('Error al eliminar el cooler');
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

  const filteredData = coolers
  .filter((item) => {
    const specs = item.specs || {};
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? (specs.tipo?.toLowerCase() === filterType.toLowerCase()) : true;
    const matchesPrice =
      (!filterPriceMin || item.price >= parseInt(filterPriceMin)) &&
      (!filterPriceMax || item.price <= parseInt(filterPriceMax));
    const noiseValue = specs.ruido ? parseFloat(specs.ruido.replace(' dB', '')) : null;
    const matchesNoise =
      noiseValue !== null
        ? (!filterNoiseMin || noiseValue >= parseFloat(filterNoiseMin)) &&
          (!filterNoiseMax || noiseValue <= parseFloat(filterNoiseMax))
        : true;

    return matchesSearch && matchesType && matchesPrice && matchesNoise;
  })
  .sort((a, b) => {
    let fieldA, fieldB;
  
    if (sortField && sortField in a) {
      fieldA = a[sortField];
      fieldB = b[sortField];
    } else if (sortField && a.specs && sortField in a.specs) {
      fieldA = a.specs[sortField];
      fieldB = b.specs[sortField];
    }
  
    if (fieldA == null || fieldB == null) return 0; // Agregado: Evita fallar si falta el campo
  
    if (typeof fieldA === 'string') {
      return sortDirection === 'asc'
        ? (fieldA as string).localeCompare(fieldB as string)
        : (fieldB as string).localeCompare(fieldA as string);
    } else if (typeof fieldA === 'number') {
      return sortDirection === 'asc'
        ? (fieldA as number) - (fieldB as number)
        : (fieldB as number) - (fieldA as number);
    } else if (typeof fieldA === 'boolean') {
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
        Admin <span className="mx-2">{'>'}</span> <span className="font-semibold">Coolers</span>
      </div>

      <div className="flex gap-6">
        {/* Filtros */}
        <div className="w-64 bg-[#1A1A1A] p-5 rounded-xl shadow-lg border border-[#7F00FF] text-white">
          <h3 className="text-lg font-bold text-acento mb-5">Filtros</h3>

          <div className="flex flex-col gap-5 text-sm font-medium text-blancoHueso">
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

            {/* Nivel de ruido */}
            <div className="flex flex-col">
              <label className="mb-1 text-textoSecundario">Nivel de ruido (dB):</label>
              <div className="flex gap-2">
                <TextField
                  size="small"
                  placeholder="Min"
                  type="number"
                  value={filterNoiseMin}
                  onChange={(e) => setFilterNoiseMin(e.target.value)}
                  InputProps={{ style: { color: '#F4F4F5', backgroundColor: '#0D0D0D' } }}
                  sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
                />
                <TextField
                  size="small"
                  placeholder="Max"
                  type="number"
                  value={filterNoiseMax}
                  onChange={(e) => setFilterNoiseMax(e.target.value)}
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
                  {['name', 'price', 'peso', 'rpm', 'ruido', 'flujoAire', 'altura'].map((field) => (
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
                      {field === 'price' && 'Precio'}
                      {field === 'peso' && 'Peso'}
                      {field === 'rpm' && 'RPM'}
                      {field === 'ruido' && 'Ruido'}
                      {field === 'flujoAire' && 'Flujo de Aire'}
                      {field === 'altura' && 'Altura'}

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
                    key={item.id}
                    className="transition duration-200"
                    sx={{ '&:hover': { backgroundColor: '#1A1A1A' } }}
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-medium">
                      ${item.price.toLocaleString('es-CL')}
                    </TableCell>
                    <TableCell className="font-medium">{item.specs?.peso || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.rpm || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.ruido || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.flujoAire || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.altura || '—'}</TableCell>
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

      {/* Modal de Agregar */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-md shadow-xl border border-[#7F00FF] relative text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">Agregar nuevo cooler</h3>

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

              {/* Peso */}
              <TextField
                label="Peso"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* RPM */}
              <TextField
                label="RPM máximo"
                type="number"
                value={rpm}
                onChange={(e) => setRpm(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Ruido */}
              <TextField
                label="Ruido (dB)"
                value={ruido}
                onChange={(e) => setRuido(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Flujo de aire */}
              <TextField
                label="Flujo de aire (CFM)"
                value={flujoAire}
                onChange={(e) => setFlujoAire(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Altura */}
              <TextField
                label="Altura (mm)"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
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
                  variant="contained"
                  onClick={handleCreate}
                  sx={{
                    backgroundColor: '#7F00FF',
                    '&:hover': { backgroundColor: '#5A32A3' },
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Editar */}
      {isEditModalOpen && selectedCooler && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-md shadow-xl border border-[#7F00FF] relative text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">Editar cooler</h3>

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

              {/* Peso */}
              <TextField
                label="Peso"
                value={editPeso}
                onChange={(e) => setEditPeso(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* RPM */}
              <TextField
                label="RPM máximo"
                value={editRpm}
                onChange={(e) => setEditRpm(e.target.value)}
                type="number"
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Ruido */}
              <TextField
                label="Ruido (dB)"
                value={editRuido}
                onChange={(e) => setEditRuido(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Flujo de aire */}
              <TextField
                label="Flujo de aire (CFM)"
                value={editFlujoAire}
                onChange={(e) => setEditFlujoAire(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Altura */}
              <TextField
                label="Altura (mm)"
                value={editAltura}
                onChange={(e) => setEditAltura(e.target.value)}
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
                  sx={{ backgroundColor: '#7F00FF', '&:hover': { backgroundColor: '#5A32A3' }, color: '#fff' }}
                >
                  Guardar cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Eliminar */}
      {isDeleteModalOpen && selectedCooler && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-sm shadow-xl border border-[#7F00FF] text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">¿Eliminar cooler?</h3>
            <p className="mb-6 text-blancoHueso">
              ¿Estás seguro de que deseas eliminar <strong>{selectedCooler.name}</strong>? Esta acción no se puede deshacer.
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
