const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/linmadDB';

async function main() {
  await mongoose.connect(MONGO_URI);

  const GPUs = mongoose.connection.collection('gpus');

  function parseSpecs(specsRaw) {
    const specs = {};
    try {
      specs.gpu = specsRaw.match(/GPU(.*?)Memoria/)?.[1]?.trim();

      const memoriaMatch = specsRaw.match(/Memoria (.*?)Frec\. core/);
      if (memoriaMatch) {
        const memoriaStr = memoriaMatch[1];
        const [cantidad, tipoRaw] = memoriaStr.split(' ');
        const tipo = tipoRaw?.match(/[A-Z]+[0-9]*/)?.[0];
        const bus = memoriaStr.match(/\((.*?)\)/)?.[1];

        specs.memoria = {
          cantidad: cantidad?.trim(),
          tipo: tipo?.trim(),
          bus: bus?.trim()
        };
      }

      const frecuencias = specsRaw.match(/Frec\. core.*?(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)/);
      if (frecuencias) {
        specs.frecuenciaCore = {
          base: parseInt(frecuencias[1]),
          boost: parseInt(frecuencias[2]),
          oc: parseInt(frecuencias[3]),
        };
      }

      const freqMem = specsRaw.match(/Frec\. memorias (\d+)/);
      specs.frecuenciaMemorias = freqMem ? parseInt(freqMem[1]) : null;

      specs.bus = specsRaw.match(/Bus (.*)/)?.[1]?.trim() || null;

    } catch (err) {
      console.error('❌ Error al parsear specs GPU:', err);
    }

    return specs;
  }

  const gpus = await GPUs.find().toArray();

  for (const gpu of gpus) {
    const { specs, price, name } = gpu;

    const parsedSpecs = parseSpecs(specs);
    const precioLimpio = parseInt(price.replace(/\D/g, ''));

    const modelo = name.match(/\[(.*?)\]/)?.[1] || '';
    const nombreLimpio = name.replace(/\[.*?\]/, '').trim();

    console.log(`🎮 Actualizando GPU: ${nombreLimpio}`);

    await GPUs.updateOne(
      { _id: gpu._id },
      {
        $set: {
          name: nombreLimpio,
          model: modelo || null,
          price: precioLimpio,
          specs: parsedSpecs,
        },
      }
    );
  }

  console.log('✅ GPUs transformadas con éxito.');
  await mongoose.disconnect();
}

main();
