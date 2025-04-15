import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const gpuSchema = new mongoose.Schema({
  name: String,
  price: String,
  specs: String,
  link: String,
});
const GPU = mongoose.model('GPU', gpuSchema);

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
}

async function scrapeSoloTodo(pageNumber = 3) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  await page.setViewport({ width: 1280, height: 800 });

  const url = `https://www.solotodo.cl/tarjetas_de_video?ordering=leads&page=${pageNumber}`;
  await page.goto(url, { waitUntil: 'networkidle2' });

  await autoScroll(page);
  await page.waitForSelector('div.MuiCardContent-root', { timeout: 10000 });

  const html = await page.content();
  fs.writeFileSync(`debug-page-${pageNumber}.html`, html);

  const gpus = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.MuiCardContent-root'));
    return cards.map(card => {
      const name = card.querySelector('div.MuiTypography-h5')?.textContent?.trim();
      const price = card.querySelector('div.MuiTypography-h2')?.textContent?.trim();
      const specs = card.querySelector('.ProductPage_product_specs__pYVnc')?.innerText?.trim();
      const link = window.location.href;
      return { name, price, specs, link };
    }).filter(gpu => gpu.name && gpu.price);
  });

  await browser.close();
  return gpus;
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const data = await scrapeSoloTodo(3); // Página 3
    let nuevos = 0;

    for (const gpu of data) {
      const exists = await GPU.findOne({ name: gpu.name, price: gpu.price });
      if (!exists) {
        await GPU.create(gpu);
        nuevos++;
      }
    }

    console.log(`✅ Se guardaron ${nuevos} GPUs nuevas de la página 2`);
  } catch (err) {
    console.error('❌ Error al ejecutar el scraping:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
