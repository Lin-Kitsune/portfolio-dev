const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/linmadDB';

async function main() {
  await mongoose.connect(MONGO_URI);

  const Placas = mongoose.connection.collection('motherboards');

  function parseSpecs(specsRaw) {
    const specs = {};
    try {
      specs.socket = specsRaw.match(/Socket(.*?)Chipset/)?.[1]?.trim();

      specs.chipset = specsRaw.match(/Chipset(.*?)Memorias/)?.[1]?.trim();

      const memoriasMatch = specsRaw.match(/Memorias(.*?)Formato/);
      if (memoriasMatch) {
        const memStr = memoriasMatch[1];
        const cantidad = parseInt(memStr.match(/\d+/)?.[0]) || null;
        const tipo = memStr.match(/DDR\d/)?.[0] || null;

        specs.memorias = {
          cantidad,
          tipo
        };
      }

      specs.formato = specsRaw.match(/Formato(.*)/)?.[1]?.trim() || null;

    } catch (err) {
      console.error('❌ Error al parsear specs placa madre:', err);
    }

    return specs;
  }

  const placas = await Placas.find().toArray();

  for (const placa of placas) {
    const { specs, price, name } = placa;

    const parsedSpecs = parseSpecs(specs);
    const precioLimpio = parseInt(price.replace(/\D/g, ''));

    const modelo = name.match(/\[(.*?)\]/)?.[1] || '';
    const nombreLimpio = name.replace(/\[.*?\]/, '').trim();

    console.log(`🔧 Actualizando motherboard: ${nombreLimpio}`);

    await Placas.updateOne(
      { _id: placa._id },
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

  console.log('✅ Motherboards transformadas con éxito.');
  await mongoose.disconnect();
}

main();
