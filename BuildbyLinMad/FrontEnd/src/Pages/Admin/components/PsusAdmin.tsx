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
import { psuService } from '../../../services/psuService';
import { toast } from 'react-toastify';

export default function PsusAdmin() {
  const [psus, setPsus] = useState<any[]>([]);

   // General
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [selected, setSelected] = useState<any>(null);
   const [imageFile, setImageFile] = useState<File | null>(null);
   const [editImage, setEditImage] = useState<File | null>(null);
   const [preview, setPreview] = useState<string | null>(null);
 
   // Filtros
   const [filterModel, setFilterModel] = useState('');
   const [filterPotencia, setFilterPotencia] = useState(''); 
   const [filterCertificacion, setFilterCertificacion] = useState('');
   const [filterModular, setFilterModular] = useState('');
   const [filterPriceMin, setFilterPriceMin] = useState('');
   const [filterPriceMax, setFilterPriceMax] = useState('');
   const [filterPfc, setFilterPfc] = useState(''); 
 
   // Crear
   const [nombre, setNombre] = useState('');
   const [precio, setPrecio] = useState('');
   const [link, setLink] = useState('');
   const [modelo, setModelo] = useState('');
   const [potencia, setPotencia] = useState('');
   const [certificacion, setCertificacion] = useState('');
   const [modular, setModular] = useState(false);
   const [corriente12V, setCorriente12V] = useState('');
   const [pfcActivo, setPfcActivo] = useState(false);
 
   // Editar
   const [editNombre, setEditNombre] = useState('');
   const [editModelo, setEditModelo] = useState('');
   const [editLink, setEditLink] = useState('');
   const [editPrecio, setEditPrecio] = useState('');
   const [editPotencia, setEditPotencia] = useState('');
   const [editCertificacion, setEditCertificacion] = useState('');
   const [editModular, setEditModular] = useState(false);
   const [editCorriente12V, setEditCorriente12V] = useState('');
   const [editPfcActivo, setEditPfcActivo] = useState(false);
 
   // Otros
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
    loadPsus();
  }, []);

  const loadPsus = async () => {
    try {
      const data = await psuService.getPsus();
      setPsus(data);
    } catch (error) {
      console.error('Error al cargar PSUs:', error);
      toast.error('Error al cargar PSUs');
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
      formData.append('price', precio);
      formData.append('link', link);
      formData.append('model', modelo);
      formData.append(
        'specs',
        JSON.stringify({
          potencia,
          certificacion,
          corriente12V,
          modular,
          pfcActivo,
        })
      );
  
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      await psuService.createPsu(formData);
      toast.success('PSU agregada');
      await loadPsus();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al crear PSU:', error);
      toast.error('Error al crear PSU');
    }
  };

  // Editar
  const handleEditClick = (item: any) => {
    setSelected(item);
    setEditNombre(item.name);
    setEditPrecio(item.price);
    setEditLink(item.link);
    setEditModelo(item.model || '');
    setEditPotencia(item.specs?.potencia?.toString() || '');
    setEditCertificacion(item.specs?.certificacion || '');
    setEditCorriente12V(item.specs?.corriente12V?.toString() || '');
    setEditModular(item.specs?.modular || false);
    setEditPfcActivo(item.specs?.pfcActivo || false);
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
          potencia: Number(editPotencia),
          certificacion: editCertificacion,
          corriente12V: Number(editCorriente12V),
          modular: editModular,
          pfcActivo: editPfcActivo,
        })
      );
  
      if (editImage) {
        formData.append('image', editImage);
      }
  
      await psuService.updatePsu(selected._id, formData);
      toast.success('PSU actualizada');
      await loadPsus();
      setIsEditModalOpen(false);
      setSelected(null);
    } catch (error) {
      console.error('Error al actualizar PSU:', error);
      toast.error('Error al actualizar PSU');
    }
  };

  // Eliminar
  const handleDelete = async () => {
    try {
      await psuService.deletePsu(selected._id);
      toast.success('PSU eliminada');
      await loadPsus();
      setIsDeleteModalOpen(false);
      setSelected(null);
    } catch (error) {
      console.error('Error al eliminar PSU:', error);
      toast.error('Error al eliminar PSU');
    }
  };

  const filteredData = psus
  .filter((item) => {
    const matchesName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModel = filterModel
      ? item.model?.toLowerCase().includes(filterModel.toLowerCase())
      : true;
    const matchesWattage = filterPotencia
      ? item.specs?.potencia?.toString() === filterPotencia
      : true;
    const matchesCert = filterCertificacion
      ? item.specs?.certificacion === filterCertificacion
      : true;
    const matchesModular = filterModular
      ? String(item.specs?.modular) === filterModular
      : true;
    const matchesPfc = filterPfc
      ? String(item.specs?.pfcActivo) === filterPfc
      : true;
    const matchesPriceMin = filterPriceMin
      ? item.price >= parseInt(filterPriceMin)
      : true;
    const matchesPriceMax = filterPriceMax
      ? item.price <= parseInt(filterPriceMax)
      : true;

    return (
      matchesName &&
      matchesModel &&
      matchesWattage &&
      matchesCert &&
      matchesModular &&
      matchesPfc &&
      matchesPriceMin &&
      matchesPriceMax
    );
  })
  .sort((a, b) => {
    const getValue = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc?.[part], obj);
    };
  
    let fieldA = getValue(a, sortField);
    let fieldB = getValue(b, sortField);
  
    // Si es booleano, conviértelo en string para que diga 'Sí' / 'No'
    if (typeof fieldA === 'boolean') fieldA = fieldA ? 'Sí' : 'No';
    if (typeof fieldB === 'boolean') fieldB = fieldB ? 'Sí' : 'No';
  
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
        Admin <span className="mx-2">{'>'}</span> <span className="font-semibold">PSUs</span>
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
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="Corsair">Corsair</MenuItem>
                <MenuItem value="EVGA">EVGA</MenuItem>
                <MenuItem value="CoolerMaster">CoolerMaster</MenuItem>
                <MenuItem value="Thermaltake">Thermaltake</MenuItem>
              </Select>
            </div>

            {/* Potencia (Wattage) */}
            <div>
              <label className="block mb-1 text-textoSecundario">Potencia (W):</label>
              <Select
                size="small"
                value={filterPotencia}
                onChange={(e) => setFilterPotencia(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="500">500W</MenuItem>
                <MenuItem value="600">600W</MenuItem>
                <MenuItem value="750">750W</MenuItem>
                <MenuItem value="850">850W</MenuItem>
                <MenuItem value="1000">1000W</MenuItem>
              </Select>
            </div>

            {/* Certificación */}
            <div>
              <label className="block mb-1 text-textoSecundario">Certificación:</label>
              <Select
                size="small"
                value={filterCertificacion}
                onChange={(e) => setFilterCertificacion(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="80PLUS Bronze">80PLUS Bronze</MenuItem>
                <MenuItem value="80PLUS Gold">80PLUS Gold</MenuItem>
                <MenuItem value="80PLUS Platinum">80PLUS Platinum</MenuItem>
                <MenuItem value="80PLUS GoldCorriente">80PLUS GoldCorriente</MenuItem>
              </Select>
            </div>

            {/* Modularidad */}
            <div>
              <label className="block mb-1 text-textoSecundario">¿Modular?</label>
              <Select
                size="small"
                value={filterModular}
                onChange={(e) => setFilterModular(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </div>

            {/* ¿PFC Activo? */}
            <div>
              <label className="block mb-1 text-textoSecundario">¿PFC Activo?</label>
              <Select
                size="small"
                value={filterPfc}
                onChange={(e) => setFilterPfc(e.target.value)}
                fullWidth
                displayEmpty
                sx={selectEstilos}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
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
                  {['name', 'model', 'specs.potencia', 'specs.certificacion', 'specs.corriente12V', 'specs.modular', 'specs.pfcActivo', 'price'].map((field) => (
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
                      {field === 'specs.potencia' && 'Potencia (W)'}
                      {field === 'specs.certificacion' && 'Certificación'}
                      {field === 'specs.corriente12V' && 'Corriente 12V'}
                      {field === 'specs.modular' && 'Modular'}
                      {field === 'specs.pfcActivo' && 'PFC Activo'}
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
                    <TableCell className="font-medium">{item.specs?.potencia || '—'}W</TableCell>
                    <TableCell className="font-medium">{item.specs?.certificacion || '—'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.corriente12V || '—'}V</TableCell>
                    <TableCell className="font-medium">{item.specs?.modular ? 'Sí' : 'No'}</TableCell>
                    <TableCell className="font-medium">{item.specs?.pfcActivo ? 'Sí' : 'No'}</TableCell>

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
            <h3 className="text-xl font-bold mb-4 text-acento">Agregar nueva Fuente de Poder</h3>

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

              {/* Potencia */}
              <TextField
                label="Potencia (W)"
                type="number"
                value={potencia}
                onChange={(e) => setPotencia(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Corriente 12V */}
              <TextField
                label="Corriente 12V"
                type="number"
                value={corriente12V}
                onChange={(e) => setCorriente12V(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Certificación */}
              <TextField
                label="Certificación"
                value={certificacion}
                onChange={(e) => setCertificacion(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Modular */}
              <Select
                size="small"
                value={modular.toString()}
                onChange={(e) => setModular(e.target.value === 'true')}
                displayEmpty
                sx={{
                  ...selectEstilos,
                  gridColumn: 'span 1',
                }}
              >
                <MenuItem value="">¿Modular?</MenuItem>
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>

              {/* PFC Activo */}
              <Select
                size="small"
                value={pfcActivo.toString()}
                onChange={(e) => setPfcActivo(e.target.value === 'true')}
                displayEmpty
                sx={{
                  ...selectEstilos,
                  gridColumn: 'span 1',
                }}
              >
                <MenuItem value="">¿PFC Activo?</MenuItem>
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>

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
            <h3 className="text-xl font-bold mb-4 text-acento">Editar Fuente de Poder</h3>

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

              {/* Potencia */}
              <TextField
                label="Potencia (W)"
                type="number"
                value={editPotencia}
                onChange={(e) => setEditPotencia(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Corriente 12V */}
              <TextField
                label="Corriente 12V"
                type="number"
                value={editCorriente12V}
                onChange={(e) => setEditCorriente12V(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Certificación */}
              <TextField
                label="Certificación"
                value={editCertificacion}
                onChange={(e) => setEditCertificacion(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Modular */}
              <Select
                size="small"
                value={editModular.toString()}
                onChange={(e) => setEditModular(e.target.value === 'true')}
                displayEmpty
                sx={{ ...selectEstilos }}
              >
                <MenuItem value="">¿Modular?</MenuItem>
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>

              {/* PFC Activo */}
              <Select
                size="small"
                value={editPfcActivo.toString()}
                onChange={(e) => setEditPfcActivo(e.target.value === 'true')}
                displayEmpty
                sx={{ ...selectEstilos }}
              >
                <MenuItem value="">¿PFC Activo?</MenuItem>
                <MenuItem value="true">Sí</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>

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
            <h3 className="text-xl font-bold mb-4 text-acento">¿Eliminar Fuente de Poder?</h3>

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
