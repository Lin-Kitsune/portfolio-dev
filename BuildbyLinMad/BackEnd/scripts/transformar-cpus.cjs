const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/linmadDB';

function parseSpecs(raw) {
  const specs = {};
  if (!raw || typeof raw !== 'string') return specs;

  try {
    const base = raw.match(/Frecuencia\s*:?[\s-]*([\d.,]+)\s*GHz/i);
    const boost = raw.match(/(?:Turbo|Boost).*?([\d.,]+)\s*GHz/i);
    const coresThreads = raw.match(/(\d+)\s*núcleos?\s*\/\s*(\d+)\s*hilos?/i);
    const l2 = raw.match(/(?:Cache\s*)?([^\s\/]+)\s*L2/i);
    const l3 = raw.match(/L3\s*[:\-]?\s*([^\s]+)/i);
    const arch = raw.match(/Arquitectura\s*:?(.+)/i);

    specs.frecuenciaBase = base?.[1]?.replace(',', '.') ?? null;
    specs.frecuenciaBoost = boost?.[1]?.replace(',', '.') ?? null;
    specs.nucleos = parseInt(coresThreads?.[1]) || null;
    specs.hilos = parseInt(coresThreads?.[2]) || null;
    specs.cacheL2 = l2?.[1]?.trim() || null;
    specs.cacheL3 = l3?.[1]?.trim() || null;
    specs.arquitectura = arch?.[1]?.trim() || null;

  } catch (e) {
    console.warn('⚠️ Error al parsear specsRaw:', e.message);
  }

  return specs;
}

async function main() {
  await mongoose.connect(MONGO_URI);
  const Procesador = mongoose.connection.collection('processors');

  const cpus = await Procesador.find().toArray();

  for (const cpu of cpus) {
    const { _id, name, specs = {}, specsRaw } = cpu;

    let socket = specs.socket?.toUpperCase()?.trim() || '';
    let newSocket = socket;

    // 🔍 Corregir socket según nombre
    if (/intel/i.test(name)) {
      const matchGen = name.match(/i[3579]-(\d{4,5})/i);
      const gen = parseInt(matchGen?.[1]?.slice(0, 2));
      if (gen >= 14) newSocket = 'LGA 1700';
      else if (gen >= 12) newSocket = 'LGA 1700';
      else if (gen === 10 || gen === 11) newSocket = 'LGA 1200';
      else if (gen === 9) newSocket = 'LGA 1151';
    }

    if (/amd/i.test(name)) {
      const matchModel = name.match(/(\d{4})/);
      const modelNumber = parseInt(matchModel?.[1]);
      if (modelNumber >= 7000) newSocket = 'AM5';
      else if (modelNumber >= 1000) newSocket = 'AM4';
    }

    // 🧠 Parsear specs desde specsRaw
    const parsed = parseSpecs(specsRaw);

    // 🔁 Combinar todo (sin borrar campos no relacionados)
    const finalSpecs = {
      ...specs,
      ...parsed,
      socket: newSocket,
    };

    await Procesador.updateOne({ _id }, { $set: { specs: finalSpecs } });

    console.log(`✅ ${name}: actualizado con specs completas.`);
  }

  await mongoose.disconnect();
  console.log('🎯 Specs y sockets reparados con éxito.');
}

main();
