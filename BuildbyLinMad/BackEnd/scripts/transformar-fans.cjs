const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/linmadDB';

async function main() {
  await mongoose.connect(MONGO_URI);

  const Fans = mongoose.connection.collection('fans');

  function parseSpecs(specsRaw) {
    const specs = {};
    try {
      specs.tamaño = specsRaw.match(/Tamaño\s*(.*?)\./)?.[1]?.trim();

      specs.iluminacion = specsRaw.match(/Iluminación\s*(.*?)Bearing/)?.[1]?.trim();

      specs.bearing = specsRaw.match(/Bearing\s*(.*?)Flujo de aire/)?.[1]?.trim();

      const flujo = specsRaw.match(/Flujo de aire\s*([\d.]+\s*CFM)/i);
      specs.flujoAire = flujo?.[1] || null;

      const rpm = specsRaw.match(/RPM\s*(\d+)/i);
      specs.rpm = rpm ? parseInt(rpm[1]) : null;

      const ruido = specsRaw.match(/Nivel de ruido\s*([\d.]+\s*dB)/i);
      specs.ruido = ruido?.[1] || null;

    } catch (err) {
      console.error('❌ Error al parsear specs FAN:', err);
    }

    return specs;
  }

  const fans = await Fans.find().toArray();

  for (const fan of fans) {
    const { specs, price, name } = fan;

    const parsedSpecs = parseSpecs(specs);
    const precioLimpio = parseInt(price.replace(/\D/g, ''));

    const modelo = name.match(/\[(.*?)\]/)?.[1] || '';
    const nombreLimpio = name.replace(/\[.*?\]/, '').trim();

    console.log(`🌀 Actualizando fan: ${nombreLimpio}`);

    await Fans.updateOne(
      { _id: fan._id },
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

  console.log('✅ Fans transformados con éxito.');
  await mongoose.disconnect();
}

main();
