const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/linmadDB';

async function main() {
  await mongoose.connect(MONGO_URI);

  const RAMs = mongoose.connection.collection('rams');

  function parseSpecs(specsRaw) {
    const specs = {};
    try {
      const capMatch = specsRaw.match(/Capacidad\s*([0-9]+)\s*x\s*([0-9]+)\s*GB/i);
      if (capMatch) {
        specs.cantidad = parseInt(capMatch[1]);
        specs.capacidadPorModulo = `${capMatch[2]} GB`;
        specs.total = `${parseInt(capMatch[1]) * parseInt(capMatch[2])} GB`;
      }

      specs.tipo = specsRaw.match(/Tipo([A-Z0-9]+)/)?.[1] || null;

      specs.velocidad = specsRaw.match(/Velocidad([0-9]+\s*MT\/s)/)?.[1]?.trim() || null;

      specs.formato = specsRaw.match(/Formato([A-Z\-]+)/)?.[1] || null;

      const voltaje = specsRaw.match(/Voltaje([\d.]+)\s*V/);
      specs.voltaje = voltaje ? parseFloat(voltaje[1]) : null;

    } catch (err) {
      console.error('❌ Error al parsear specs RAM:', err);
    }

    return specs;
  }

  const rams = await RAMs.find().toArray();

  for (const ram of rams) {
    const { specs, price, name } = ram;

    const parsedSpecs = parseSpecs(specs);
    const precioLimpio = parseInt(price.replace(/\D/g, ''));

    const modelo = name.match(/\[(.*?)\]/)?.[1] || '';
    const nombreLimpio = name.replace(/\[.*?\]/, '').trim();

    console.log(`🧠 Actualizando RAM: ${nombreLimpio}`);

    await RAMs.updateOne(
      { _id: ram._id },
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

  console.log('✅ RAMs transformadas con éxito.');
  await mongoose.disconnect();
}

main();
