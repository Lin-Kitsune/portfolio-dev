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
import { useState } from 'react';

export default function ProcessorsAdmin() {
  const mockData = [
    { id: '1', name: 'Ryzen 5 5600X', brand: 'AMD', price: 160000, socket: 'AM4', cores: 6, threads: 12 },
    { id: '2', name: 'Intel Core i5-12600K', brand: 'Intel', price: 210000, socket: 'LGA1700', cores: 10, threads: 16 },
  ];  

  const [filterType, setFilterType] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

  const filteredData = mockData
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterBrand ? item.brand === filterBrand : true)
    )
    .sort((a, b) => {
      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];
      if (typeof fieldA === 'string') {
        return sortDirection === 'asc'
          ? fieldA.localeCompare(fieldB as string)
          : (fieldB as string).localeCompare(fieldA);
      } else if (typeof fieldA === 'number') {
        return sortDirection === 'asc'
          ? (fieldA as number) - (fieldB as number)
          : (fieldB as number) - (fieldA as number);
      }
      return 0;
    });

  return (
    <div className="min-h-screen mt-32 px-6 bg-fondo text-blancoHueso">
      {/* Breadcrumb */}
      <div className="text-textoSecundario text-sm mb-4">
        Admin <span className="mx-2">{'>'}</span> <span className="font-semibold">Procesadores</span>
      </div>

      <div className="flex gap-6">
        {/* Filtros */}
        <div className="w-64 bg-[#1A1A1A] p-5 rounded-xl shadow-lg border border-[#7F00FF] text-white">
          <h3 className="text-lg font-bold text-acento mb-5">Filtros</h3>

          <div className="flex flex-col gap-5 text-sm font-medium text-blancoHueso">
            {/* Marca */}
            <div>
              <label className="block mb-1 text-textoSecundario">Marca:</label>
              <Select size="small" fullWidth className="bg-[#0D0D0D] text-white rounded">
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="AMD">AMD</MenuItem>
                <MenuItem value="Intel">Intel</MenuItem>
              </Select>
            </div>

            {/* Socket */}
            <div>
              <label className="block mb-1 text-textoSecundario">Socket:</label>
              <Select size="small" fullWidth className="bg-[#0D0D0D] text-white rounded">
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="AM4">AM4</MenuItem>
                <MenuItem value="AM5">AM5</MenuItem>
                <MenuItem value="LGA1200">LGA1200</MenuItem>
                <MenuItem value="LGA1700">LGA1700</MenuItem>
              </Select>
            </div>

            {/* Núcleos */}
            <div>
              <label className="block mb-1 text-textoSecundario">Núcleos:</label>
              <Select size="small" fullWidth className="bg-[#0D0D0D] text-white rounded">
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="8">8</MenuItem>
                <MenuItem value="12">12</MenuItem>
                <MenuItem value="16">16</MenuItem>
              </Select>
            </div>

            {/* Hilos */}
            <div>
              <label className="block mb-1 text-textoSecundario">Hilos:</label>
              <Select size="small" fullWidth className="bg-[#0D0D0D] text-white rounded">
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="8">8</MenuItem>
                <MenuItem value="12">12</MenuItem>
                <MenuItem value="16">16</MenuItem>
                <MenuItem value="24">24</MenuItem>
              </Select>
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
                  {['name', 'brand', 'socket', 'cores', 'threads', 'price'].map((field) => (
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
                      {field === 'brand' && 'Marca'}
                      {field === 'socket' && 'Socket'}
                      {field === 'cores' && 'Núcleos'}
                      {field === 'threads' && 'Hilos'}
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
                {filteredData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="transition duration-200"
                    sx={{ '&:hover': { backgroundColor: '#1A1A1A' } }}
                  >
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-medium">{item.brand}</TableCell>
                    <TableCell className="font-medium">{item.socket}</TableCell>
                    <TableCell className="font-medium">{item.cores}</TableCell>
                    <TableCell className="font-medium">{item.threads}</TableCell>

                    <TableCell className="font-medium">
                      ${item.price.toLocaleString('es-CL')}
                    </TableCell>
                    <TableCell className="py-4">
                    <Button
                      size="small"
                      onClick={() => handleEdit(item.id)}
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
                      onClick={() => handleDelete(item.id)}
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
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`w-10 h-10 flex items-center justify-center rounded-md font-bold transition-all duration-200
                    ${
                      n === 1
                        ? 'bg-[#00FFFF] text-[#0D0D0D]'
                        : 'bg-[#7F00FF] text-white hover:bg-[#5A32A3]'
                    }
                    outline-none border-none shadow-none focus:outline-none`}
                >
                  {n}
                </button>              
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Modal de agregar */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center modal-fondo z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 w-full max-w-md shadow-xl border border-[#7F00FF] relative text-white">
          <h3 className="text-xl font-bold mb-4 text-acento">Agregar nuevo procesador</h3>

            <form className="flex flex-col gap-4">
              {/* Nombre */}
              <TextField
                label="Nombre"
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />
              {/* Imagen */}
              <div className="flex flex-col gap-2 mb-4">
                <label
                  htmlFor="image_input"
                  className="block text-sm font-semibold text-blancoHueso"
                >
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
              {/* Precio */}
              <TextField
                label="Precio"
                type="number"
                variant="outlined"
                size="small"
                InputLabelProps={{ style: { color: '#C2B9FF' } }}
                InputProps={{ style: { color: '#F4F4F5' } }}
                sx={{ '& fieldset': { borderColor: '#7F00FF' } }}
              />

              {/* Socket */}
              <Select size="small" displayEmpty defaultValue="" sx={selectEstilos}>
                <MenuItem value="">Socket</MenuItem>
                <MenuItem value="AM4">AM4</MenuItem>
                <MenuItem value="AM5">AM5</MenuItem>
                <MenuItem value="LGA1200">LGA1200</MenuItem>
                <MenuItem value="LGA1700">LGA1700</MenuItem>
              </Select>

              {/* Núcleos */}
              <Select size="small" displayEmpty defaultValue="" sx={selectEstilos}>
                <MenuItem value="">Núcleos</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="8">8</MenuItem>
                <MenuItem value="12">12</MenuItem>
                <MenuItem value="16">16</MenuItem>
              </Select>

              {/* Hilos */}
              <Select size="small" displayEmpty defaultValue="" sx={selectEstilos}>
                <MenuItem value="">Hilos</MenuItem>
                <MenuItem value="8">8</MenuItem>
                <MenuItem value="12">12</MenuItem>
                <MenuItem value="16">16</MenuItem>
                <MenuItem value="24">24</MenuItem>
              </Select>

              {/* Botones */}
              <div className="flex justify-end gap-2 mt-2">
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

    </div>
  );
}
