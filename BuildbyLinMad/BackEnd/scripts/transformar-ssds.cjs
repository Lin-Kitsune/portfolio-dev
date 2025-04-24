const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/linmadDB';

async function main() {
  await mongoose.connect(MONGO_URI);

  const SSDs = mongoose.connection.collection('ssds');

  function parseSpecs(specsRaw) {
    const specs = {};
    try {
      specs.capacidad = specsRaw.match(/Capacidad(.*?)Formato/)?.[1]?.trim();

      specs.formato = specsRaw.match(/Formato(.*?)Bus/)?.[1]?.trim();

      specs.bus = specsRaw.match(/Bus(.*?)¿Posee DRAM\?/)?.[1]?.trim();

      const dram = specsRaw.match(/¿Posee DRAM\?(Sí|No)/i)?.[1]?.toLowerCase();
      specs.poseeDram = dram === 'sí';

      specs.tipoMemoria = specsRaw.match(/Tipo memoria (.*)/)?.[1]?.trim();

    } catch (err) {
      console.error('❌ Error al parsear specs SSD:', err);
    }

    return specs;
  }

  const ssds = await SSDs.find().toArray();

  for (const ssd of ssds) {
    const { specs, price, name } = ssd;

    const parsedSpecs = parseSpecs(specs);
    const precioLimpio = parseInt(price.replace(/\D/g, ''));

    const modelo = name.match(/\[(.*?)\]/)?.[1] || '';
    const nombreLimpio = name.replace(/\[.*?\]/, '').trim();

    console.log(`💾 Actualizando SSD: ${nombreLimpio}`);

    await SSDs.updateOne(
      { _id: ssd._id },
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

  console.log('✅ SSDs transformadas con éxito.');
  await mongoose.disconnect();
}

main();
