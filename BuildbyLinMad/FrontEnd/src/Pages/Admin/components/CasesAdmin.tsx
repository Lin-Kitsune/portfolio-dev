import { useEffect, useState } from 'react';
import { caseService } from '@/services/caseService';
import { toast } from 'react-toastify';

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

export default function CasesAdmin() {
  const [cases, setCases] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [formato, setFormato] = useState('');
  const [iluminacion, setIluminacion] = useState('');
  const [fuenteIncluida, setFuenteIncluida] = useState('');
  const [ubicacionFuente, setUbicacionFuente] = useState('');
  const [panelLateral, setPanelLateral] = useState('');
  const [ventiladoresIncluidos, setVentiladoresIncluidos] = useState('');
  const [link, setLink] = useState('');

  const [editNombre, setEditNombre] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editFormato, setEditFormato] = useState('');
  const [editIluminacion, setEditIluminacion] = useState('');
  const [editUbicacionFuente, setEditUbicacionFuente] = useState('');
  const [editPanelLateral, setEditPanelLateral] = useState('');
  const [editFuenteIncluida, setEditFuenteIncluida] = useState('');
  const [editVentiladoresIncluidos, setEditVentiladoresIncluidos] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);


  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filterPanel, setFilterPanel] = useState('');
  const [filterRgb, setFilterRgb] = useState('');
  const [filterFans, setFilterFans] = useState('');
  const [filterPsu, setFilterPsu] = useState('');
  const [filterFormato, setFilterFormato] = useState('');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');

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
  
  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', nombre);
      formData.append('price', precio.toString());
      formData.append('link', link);
  
      formData.append('specs', JSON.stringify({
        formato,
        iluminacion,
        fuenteDePoderIncluida: fuenteIncluida === 'sí',
        ubicacionFuente,
        panelLateral,
        ventiladoresIncluidos: ventiladoresIncluidos === 'sí',
      }));
  
      if (imageFile) {
        formData.append('image', imageFile);
      }
  
      await caseService.createCase(formData);
      toast.success('Gabinete agregado correctamente');
      const updatedCases = await caseService.getCases();
      setCases(updatedCases);
  
      // Reset
      setIsModalOpen(false);
      setNombre('');
      setPrecio('');
      setImageFile(null);
      setPreview(null);
      setFormato('');
      setIluminacion('');
      setFuenteIncluida('');
      setUbicacionFuente('');
      setPanelLateral('');
      setVentiladoresIncluidos('');
      setLink('');
    } catch (error) {
      console.error('Error al crear case:', error);
      toast.error('Hubo un error al guardar el gabinete');
    }
  };

  const handleEditClick = (item: any) => {
    setSelectedCase(item);
    setEditNombre(item.name);
    setEditLink(item.link);
    setEditPrecio(item.price);
    setEditFormato(item.specs?.formato || '');
    setEditIluminacion(item.specs?.iluminacion || '');
    setEditUbicacionFuente(item.specs?.ubicacionFuente || '');
    setEditPanelLateral(item.specs?.panelLateral || '');
    setEditFuenteIncluida(item.specs?.fuenteDePoderIncluida ? 'sí' : 'no');
    setEditVentiladoresIncluidos(item.specs?.ventiladoresIncluidos ? 'sí' : 'no');
    setPreview(item.image_url || null);
    setIsEditModalOpen(true);
  };  

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editNombre);
      formData.append('price', editPrecio.toString());
      formData.append('link', editLink);
      formData.append('specs', JSON.stringify({
        formato: editFormato,
        iluminacion: editIluminacion,
        fuenteDePoderIncluida: editFuenteIncluida === 'sí',
        ubicacionFuente: editUbicacionFuente,
        panelLateral: editPanelLateral,
        ventiladoresIncluidos: editVentiladoresIncluidos === 'sí',
      }));
  
      if (editImage) {
        formData.append('image', editImage);
      }
  
      await caseService.updateCase(selectedCase._id, formData);
      toast.success('Gabinete actualizado correctamente');
      const updatedCases = await caseService.getCases();
      setCases(updatedCases);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast.error('Hubo un error al actualizar el gabinete');
    }
  }; 
  
  const handleDeleteClick = (item: any) => {
    setSelectedCase(item);
    setIsDeleteModalOpen(true);
  };  
  
  const handleDelete = async () => {
    if (!selectedCase?._id) return;
  
    try {
      await caseService.deleteCase(selectedCase._id);
      toast.success('Gabinete eliminado correctamente');
  
      const updatedCases = await caseService.getCases();
      setCases(updatedCases);
  
      setIsDeleteModalOpen(false);
      setSelectedCase(null);
    } catch (error) {
      console.error('Error al eliminar gabinete:', error);
      toast.error('Error al eliminar el gabinete');
    }
  };  
  
  useEffect(() => {
    caseService.getCases().then(setCases).catch(console.error);
  }, []);  

  const filteredData = cases
    .filter((item) => {
      const specs = item.specs || {};
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFans = filterFans ? (filterFans === 'sí' ? specs.ventiladoresIncluidos : !specs.ventiladoresIncluidos) : true;
      const matchesRgb = filterRgb ? (filterRgb === 'sí' ? specs.iluminacion?.toLowerCase() !== 'no' : specs.iluminacion?.toLowerCase() === 'no') : true;
      const matchesPanel = filterPanel ? specs.panelLateral?.toLowerCase() === filterPanel : true;
      const matchesFormato = filterFormato ? specs.formato?.toLowerCase() === filterFormato.toLowerCase() : true;
      const matchesPsu = filterPsu ? specs.ubicacionFuente?.toLowerCase() === filterPsu : true;
      const priceMatch =
      (!filterPriceMin || item.price >= parseInt(filterPriceMin)) &&
      (!filterPriceMax || item.price <= parseInt(filterPriceMax));

      return (
        matchesSearch &&
        matchesFans &&
        matchesRgb &&
        matchesPanel &&
        matchesFormato &&
        matchesPsu &&
        priceMatch
      );
    })
    .sort((a, b) => {
      let fieldA, fieldB;
    
      // Buscar el campo en el nivel raíz o en specs
      if (sortField in a) {
        fieldA = a[sortField];
        fieldB = b[sortField];
      } else if (sortField && a.specs && sortField in a.specs) {
        fieldA = a.specs[sortField];
        fieldB = b.specs[sortField];
      }
    
      if (typeof fieldA === 'string') {
        return sortDirection === 'asc'
          ? fieldA.localeCompare(fieldB as string)
          : (fieldB as string).localeCompare(fieldA);
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
        Admin <span className="mx-2">{'>'}</span> <span className="font-semibold">Gabinetes</span>
      </div>

      <div className="flex gap-6">
        {/* Filtros */}
        <div className="w-64 bg-[#1A1A1A] p-5 rounded-xl shadow-lg border border-[#7F00FF] text-white">
          <h3 className="text-lg font-bold text-acento mb-5">Filtros</h3>

          <div className="flex flex-col gap-5 text-sm font-medium text-blancoHueso">
            {/* Formato */}
            <div>
              <label className="block mb-1 text-textoSecundario">Tipo:</label>
              <Select
                size="small"
                value={filterFormato}
                onChange={(e) => setFilterFormato(e.target.value)}
                fullWidth
                className="bg-[#0D0D0D] text-white rounded"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="atx">ATX</MenuItem>
                <MenuItem value="micro atx">Micro ATX</MenuItem>
                <MenuItem value="extended atx">Extended ATX</MenuItem>
              </Select>
            </div>

            {/* Panel lateral */}
            <div>
              <label className="block mb-1 text-textoSecundario">Panel lateral:</label>
              <Select
                size="small"
                value={filterPanel}
                onChange={(e) => setFilterPanel(e.target.value)}
                fullWidth
                className="bg-[#0D0D0D] text-white rounded"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="vidrio templado">Vidrio templado</MenuItem>
                <MenuItem value="acrílico">Acrílico</MenuItem>
                <MenuItem value="metal">Metal</MenuItem>
              </Select>
            </div>

            {/* ¿Incluye ventiladores? */}
            <div>
              <label className="block mb-1 text-textoSecundario">¿Incluye ventiladores?</label>
              <Select
                size="small"
                value={filterFans}
                onChange={(e) => setFilterFans(e.target.value)}
                fullWidth
                className="bg-[#0D0D0D] text-white rounded"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="sí">Sí</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </div>

            {/* ¿RGB incluido? */}
            <div>
              <label className="block mb-1 text-textoSecundario">¿RGB incluido?</label>
              <Select
                size="small"
                value={filterRgb}
                onChange={(e) => setFilterRgb(e.target.value)}
                fullWidth
                className="bg-[#0D0D0D] text-white rounded"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="sí">Sí</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </div>

            {/* Ubicación PSU */}
            <div>
              <label className="block mb-1 text-textoSecundario">Ubicación PSU:</label>
              <Select
                size="small"
                value={filterPsu}
                onChange={(e) => setFilterPsu(e.target.value)}
                fullWidth
                className="bg-[#0D0D0D] text-white rounded"
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="inferior">Inferior</MenuItem>
                <MenuItem value="superior">Superior</MenuItem>
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
                  className="bg-[#0D0D0D] text-white"
                  InputProps={{ sx: { color: 'white', backgroundColor: '#0D0D0D' } }}
                />
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="$ Máx"
                  type="number"
                  value={filterPriceMax}
                  onChange={(e) => setFilterPriceMax(e.target.value)}
                  className="bg-[#0D0D0D] text-white"
                  InputProps={{ sx: { color: 'white', backgroundColor: '#0D0D0D' } }}
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
                  {['name', 'price', 'formato', 'panelLateral', 'iluminacion', 'ventiladoresIncluidos', 'fuenteDePoderIncluida' ].map((field) => (
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
                      {field === 'formato' && 'Formato'}
                      {field === 'panelLateral' && 'Panel lateral'}
                      {field === 'iluminacion' && 'RGB'}
                      {field === 'ventiladoresIncluidos' && 'Ventiladores'}
                      {field === 'fuenteDePoderIncluida' && 'Fuente de Poder'}

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
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price.toLocaleString('es-CL')}</TableCell>
                    <TableCell>{item.specs?.formato || '—'}</TableCell>
                    <TableCell>{item.specs?.panelLateral || '—'}</TableCell>
                    <TableCell>{item.specs?.iluminacion || '—'}</TableCell>
                    <TableCell>{item.specs?.ventiladoresIncluidos ? 'Sí' : 'No'}</TableCell>
                    <TableCell>{item.specs?.fuenteDePoderIncluida ? 'Sí' : 'No'}</TableCell>
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

      {/* Modal de agregar */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-md shadow-xl border border-[#7F00FF] relative text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">Agregar nuevo gabinete</h3>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Columna 1 */}
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

              <TextField
                label="Ubicación fuente"
                value={ubicacionFuente}
                onChange={(e) => setUbicacionFuente(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              <TextField
                label="Panel lateral"
                value={panelLateral}
                onChange={(e) => setPanelLateral(e.target.value)}
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
                {/* Fuente incluida */}
                <div>
                  <label className="block mb-1 text-textoSecundario">Fuente de poder incluida:</label>
                  <Select
                    size="small"
                    value={fuenteIncluida}
                    onChange={(e) => setFuenteIncluida(e.target.value)}
                    fullWidth
                    className="bg-[#0D0D0D] text-white rounded"
                    sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
                  >
                    <MenuItem value="">Seleccionar</MenuItem>
                    <MenuItem value="sí">Sí</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </div>

                {/* Ventiladores incluidos */}
                <div>
                  <label className="block mb-1 text-textoSecundario">¿Incluye ventiladores?</label>
                  <Select
                    size="small"
                    value={ventiladoresIncluidos}
                    onChange={(e) => setVentiladoresIncluidos(e.target.value)}
                    fullWidth
                    className="bg-[#0D0D0D] text-white rounded"
                    sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
                  >
                    <MenuItem value="">Seleccionar</MenuItem>
                    <MenuItem value="sí">Sí</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </div>
              </div>

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

              {/* Botones (col-span para alinearlos) */}
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

      {/* Modal de editar */}
      {isEditModalOpen && selectedCase && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-2xl shadow-xl border border-[#7F00FF] relative text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">Editar gabinete</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <TextField
                label="Nombre"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                size="small"
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              <TextField
                label="Link del producto"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                size="small"
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              <TextField
                label="Precio"
                type="number"
                value={editPrecio}
                onChange={(e) => setEditPrecio(e.target.value)}
                size="small"
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              <TextField
                label="Formato"
                value={editFormato}
                onChange={(e) => setEditFormato(e.target.value)}
                size="small"
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              <TextField
                label="Iluminación"
                value={editIluminacion}
                onChange={(e) => setEditIluminacion(e.target.value)}
                size="small"
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              <TextField
                label="Ubicación fuente"
                value={editUbicacionFuente}
                onChange={(e) => setEditUbicacionFuente(e.target.value)}
                size="small"
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              <TextField
                label="Panel lateral"
                value={editPanelLateral}
                onChange={(e) => setEditPanelLateral(e.target.value)}
                size="small"
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2">
                <div>
                  <label className="block mb-1 text-textoSecundario">Fuente de poder incluida:</label>
                  <Select
                    size="small"
                    value={editFuenteIncluida}
                    onChange={(e) => setEditFuenteIncluida(e.target.value)}
                    fullWidth
                    className="bg-[#0D0D0D] text-white rounded"
                    sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
                  >
                    <MenuItem value="">Seleccionar</MenuItem>
                    <MenuItem value="sí">Sí</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </div>

                <div>
                  <label className="block mb-1 text-textoSecundario">¿Incluye ventiladores?</label>
                  <Select
                    size="small"
                    value={editVentiladoresIncluidos}
                    onChange={(e) => setEditVentiladoresIncluidos(e.target.value)}
                    fullWidth
                    className="bg-[#0D0D0D] text-white rounded"
                    sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
                  >
                    <MenuItem value="">Seleccionar</MenuItem>
                    <MenuItem value="sí">Sí</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </div>
              </div>

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
      {isDeleteModalOpen && selectedCase && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-sm shadow-xl border border-[#7F00FF] text-white">
            <h3 className="text-xl font-bold mb-4 text-acento">¿Eliminar gabinete?</h3>
            <p className="mb-6 text-blancoHueso">¿Estás seguro de que deseas eliminar <strong>{selectedCase.name}</strong>? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsDeleteModalOpen(false)} variant="outlined" sx={{ borderColor: '#FF4D4F', color: '#FF4D4F' }}>Cancelar</Button>
              <Button onClick={handleDelete} variant="contained" sx={{ backgroundColor: '#FF4D4F', color: '#fff' }}>Eliminar</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
