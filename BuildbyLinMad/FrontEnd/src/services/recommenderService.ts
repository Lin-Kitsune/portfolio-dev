import { componentService } from '../components/componentService';

type Recomendacion = {
  type: 'CPU' | 'GPU' | 'RAM';
  actual: any;
  sugerido: any;
  motivo: string;
};

const MAX_PRECIO_FACTOR_CPU = 1.6;
const MAX_PRECIO_FACTOR = 1.4;
const normalizar = (val: string | undefined) => val?.trim().toLowerCase() || '';

// GPU score usando cantidad de memoria y frecuencias
function calcularScoreGPU(gpu: any): number {
  const vram = gpu?.specs?.memoria?.cantidad || 0;
  const base = gpu?.specs?.frecuenciaCore?.base || 0;
  const boost = gpu?.specs?.frecuenciaCore?.boost || base;
  return vram * 100 + base + boost;
}

export async function recomendarMejoras(build: any): Promise<Recomendacion[]> {
  const recomendaciones: Recomendacion[] = [];

  const [cpus, gpus, rams] = await Promise.all([
    componentService.getByType('cpu'),
    componentService.getByType('gpu'),
    componentService.getByType('ram'),
  ]);

  const cpu = build?.components?.cpu;
  const gpu = build?.components?.gpu;
  const ram = build?.components?.ram;

  // ✅ CPU: mismo socket y un precio mayor
  if (cpu?.specs?.socket && cpu?.price) {
    const cpuSocket = normalizar(cpu.specs.socket);
    const mejoresCPUs = cpus.filter((c: any) => {
      const socketOk = normalizar(c?.specs?.socket) === cpuSocket;
      const precioOk = c.price > cpu.price && c.price <= cpu.price * MAX_PRECIO_FACTOR_CPU;
      return socketOk && precioOk;
    }).sort((a, b) => b.price - a.price); // preferir CPUs más caras

    if (mejoresCPUs.length > 0) {
      recomendaciones.push({
        type: 'CPU',
        actual: cpu,
        sugerido: mejoresCPUs[0],
        motivo: ' Mejor CPU compatible por socket y rango de precio',
      });
    }
  }

  // ✅ GPU: score y precio mayor
  if (gpu && gpu.price) {
    const gpuScore = calcularScoreGPU(gpu);
    const mejoresGPUs = gpus.filter((g: any) => {
      const score = calcularScoreGPU(g);
      const precioOk = g.price > gpu.price && g.price <= gpu.price * MAX_PRECIO_FACTOR;
      const scoreOk = score > gpuScore;

      return scoreOk && precioOk;
    }).sort((a, b) => calcularScoreGPU(b) - calcularScoreGPU(a));

    if (mejoresGPUs.length > 0) {
      recomendaciones.push({
        type: 'GPU',
        actual: gpu,
        sugerido: mejoresGPUs[0],
        motivo: ' Mejor GPU por rendimiento y precio',
      });
    }
  }

  // ✅ RAM: tipo igual, mayor frecuencia o capacidad
  if (ram?.specs?.tipo && ram?.specs?.velocidad && ram?.specs?.total && ram.price) {
    const ramTipo = normalizar(ram.specs.tipo);
    const velocidadActual = parseInt(ram.specs?.velocidad?.replace(/\D/g, '')) || 0;
    const gbActual = parseInt(ram.specs?.total?.replace(/\D/g, '')) || 0;

    const mejoresRAM = rams.filter((r: any) => {
      const tipoOk = normalizar(r?.specs?.tipo) === ramTipo;
      const velocidad = parseInt(r?.specs?.velocidad?.replace(/\D/g, '')) || 0;
      const gb = parseInt(r?.specs?.total?.replace(/\D/g, '')) || 0;
      const precioOk = r.price > ram.price && r.price <= ram.price * MAX_PRECIO_FACTOR;
      const mejoraReal = velocidad > velocidadActual || gb > gbActual;

      return tipoOk && mejoraReal && precioOk;
    }).sort((a, b) => {
      const bFreq = parseInt(b?.specs?.velocidad?.replace(/\D/g, '')) || 0;
      const aFreq = parseInt(a?.specs?.velocidad?.replace(/\D/g, '')) || 0;
      const bGB = parseInt(b?.specs?.total?.replace(/\D/g, '')) || 0;
      const aGB = parseInt(a?.specs?.total?.replace(/\D/g, '')) || 0;
      return (bGB - aGB) || (bFreq - aFreq);
    });

    if (mejoresRAM.length > 0) {
      recomendaciones.push({
        type: 'RAM',
        actual: ram,
        sugerido: mejoresRAM[0],
        motivo: ' Mayor velocidad o capacidad compatible',
      });
    }
  }

  return recomendaciones;
}
