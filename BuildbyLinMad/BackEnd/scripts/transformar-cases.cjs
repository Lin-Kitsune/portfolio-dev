const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/linmadDB';

async function main() {
  await mongoose.connect(MONGO_URI);

  const Cases = mongoose.connection.collection('cases');

  function parseSpecs(specsRaw) {
    const specs = {};
    try {
      specs.formato = specsRaw.match(/Formato(.*?)Iluminación/)?.[1]?.trim();

      specs.iluminacion = specsRaw.match(/Iluminación(.*?)Fuente de poder/)?.[1]?.trim();

      const fuenteMatch = specsRaw.match(/Fuente de poder(.*?)Ubicación/)?.[1]?.toLowerCase();
      specs.fuenteDePoderIncluida = !fuenteMatch?.includes('no posee');

      specs.ubicacionFuente = specsRaw.match(/Ubicación fuente de poder(.*?)Panel/)?.[1]?.trim();

      specs.panelLateral = specsRaw.match(/Panel lateral(.*?)Ventiladores/)?.[1]?.trim();

      const ventiladores = specsRaw.match(/Ventiladores incluidos (.*?)$/)?.[1]?.toLowerCase();
      specs.ventiladoresIncluidos = !ventiladores?.includes('no posee');

    } catch (err) {
      console.error('❌ Error al parsear specs Case:', err);
    }

    return specs;
  }

  const gabinetes = await Cases.find().toArray();

  for (const gabinete of gabinetes) {
    const { specs, price, name } = gabinete;

    const parsedSpecs = parseSpecs(specs);
    const precioLimpio = parseInt(price.replace(/\D/g, ''));

    const modelo = name.match(/\[(.*?)\]/)?.[1] || '';
    const nombreLimpio = name.replace(/\[.*?\]/, '').trim();

    console.log(`🖥️ Actualizando gabinete: ${nombreLimpio}`);

    await Cases.updateOne(
      { _id: gabinete._id },
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

  console.log('✅ Gabinetes transformados con éxito.');
  await mongoose.disconnect();
}

main();
