const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/linmadDB';

async function main() {
  await mongoose.connect(MONGO_URI);

  const Discos = mongoose.connection.collection('disks');

  function parseSpecs(specsRaw) {
    const specs = {};
    try {
      specs.tipo = specsRaw.match(/Tipo(.*?)Capacidad/)?.[1]?.trim() || null;

      specs.capacidad = specsRaw.match(/Capacidad(.*?)RPM/)?.[1]?.trim() || null;

      const rpm = specsRaw.match(/RPM(\d+)/);
      specs.rpm = rpm ? parseInt(rpm[1]) : null;

      specs.tamaño = specsRaw.match(/Tamaño(.*?)Bus/)?.[1]?.trim() || null;

      specs.bus = specsRaw.match(/Bus(.*)/)?.[1]?.trim() || null;

    } catch (err) {
      console.error('❌ Error al parsear specs DISK:', err);
    }

    return specs;
  }

  const discos = await Discos.find().toArray();

  for (const disco of discos) {
    const { specs, price, name } = disco;

    const parsedSpecs = parseSpecs(specs);
    const precioLimpio = parseInt(price.replace(/\D/g, ''));

    const modelo = name.match(/\[(.*?)\]/)?.[1] || '';
    const nombreLimpio = name.replace(/\[.*?\]/, '').trim();

    console.log(`💽 Actualizando disco: ${nombreLimpio}`);

    await Discos.updateOne(
      { _id: disco._id },
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

  console.log('✅ Discos transformados con éxito.');
  await mongoose.disconnect();
}

main();
