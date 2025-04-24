const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/linmadDB';

async function main() {
  await mongoose.connect(MONGO_URI);

  const PSUs = mongoose.connection.collection('psus');

  function parseSpecs(specsRaw) {
    const specs = {};
    try {
      specs.potencia = parseInt(specsRaw.match(/Potencia(\d+)/)?.[1]) || null;

      specs.certificacion = specsRaw.match(/Certificación(80PLUS\s*\w+)/)?.[1]?.trim() || null;

      const corriente = specsRaw.match(/Corriente\s*12V\s*(\d+(\.\d+)?)/);
      specs.corriente12V = corriente ? parseFloat(corriente[1]) : null;

      const modular = specsRaw.match(/Modular\s*(Sí|No)/i)?.[1]?.toLowerCase();
      specs.modular = modular === 'sí';

      const pfc = specsRaw.match(/PFC activo\s*(Sí|No)/i)?.[1]?.toLowerCase();
      specs.pfcActivo = pfc === 'sí';

    } catch (err) {
      console.error('❌ Error al parsear specs PSU:', err);
    }

    return specs;
  }

  const fuentes = await PSUs.find().toArray();

  for (const psu of fuentes) {
    const { specs, price, name } = psu;

    const parsedSpecs = parseSpecs(specs);
    const precioLimpio = parseInt(price.replace(/\D/g, ''));

    const modelo = name.match(/\[(.*?)\]/)?.[1] || '';
    const nombreLimpio = name.replace(/\[.*?\]/, '').trim();

    console.log(`⚡ Actualizando PSU: ${nombreLimpio}`);

    await PSUs.updateOne(
      { _id: psu._id },
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

  console.log('✅ PSUs transformadas con éxito.');
  await mongoose.disconnect();
}

main();
