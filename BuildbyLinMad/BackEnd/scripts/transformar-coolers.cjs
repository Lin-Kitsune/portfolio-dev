const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/linmadDB';

async function main() {
  await mongoose.connect(MONGO_URI);

  const Coolers = mongoose.connection.collection('coolers');

  function parseSpecs(specsRaw) {
    const specs = {};
    try {
      specs.peso = specsRaw.match(/Peso (.*?)RPM/)?.[1]?.trim() || 'Desconocido';

      const rpmMatch = specsRaw.match(/RPM\s*(\d+)/i);
      specs.rpm = rpmMatch ? parseInt(rpmMatch[1]) : null;

      const ruidoMatch = specsRaw.match(/Ruido\s*([\d.]+\s*dB)/i);
      specs.ruido = ruidoMatch?.[1] || null;

      const flujoMatch = specsRaw.match(/Flujo de aire\s*([\d.]+\s*CFM)/i);
      specs.flujoAire = flujoMatch?.[1] || null;

      const alturaMatch = specsRaw.match(/Altura([\d.]+\s*mm)/i);
      specs.altura = alturaMatch?.[1] || null;

    } catch (err) {
      console.error('❌ Error al parsear specs Cooler:', err);
    }

    return specs;
  }

  const coolers = await Coolers.find().toArray();

  for (const cooler of coolers) {
    const { specs, price, name } = cooler;

    const parsedSpecs = parseSpecs(specs);
    const precioLimpio = parseInt(price.replace(/\D/g, ''));

    const modelo = name.match(/\[(.*?)\]/)?.[1] || '';
    const nombreLimpio = name.replace(/\[.*?\]/, '').trim();

    console.log(`❄️ Actualizando cooler: ${nombreLimpio}`);

    await Coolers.updateOne(
      { _id: cooler._id },
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

  console.log('✅ Coolers transformados con éxito.');
  await mongoose.disconnect();
}

main();
