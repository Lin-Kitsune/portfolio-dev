import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const processorSchema = new mongoose.Schema({
  name: String,
  price: String,
  specs: String,
  link: String,
});
const Processor = mongoose.model('Processor', processorSchema);

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

async function scrapeProcessorsFromPage(pageNumber = 1) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  await page.setViewport({ width: 1280, height: 800 });

  const url = `https://www.solotodo.cl/procesadores?ordering=leads&page=${pageNumber}`;
  await page.goto(url, { waitUntil: 'networkidle2' });

  await autoScroll(page);
  await page.waitForSelector('div.MuiCardContent-root', { timeout: 10000 });

  const html = await page.content();
  fs.writeFileSync(`debug-procesadores-p${pageNumber}.html`, html);

  const processors = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.MuiCardContent-root'));
    return cards.map(card => {
      const name = card.querySelector('div.MuiTypography-h5')?.textContent?.trim();
      const price = card.querySelector('div.MuiTypography-h2')?.textContent?.trim();
      const specs = card.querySelector('.ProductPage_product_specs__pYVnc')?.innerText?.trim();
      const link = window.location.href;
      return { name, price, specs, link };
    }).filter(p => p.name && p.price);
  });

  await browser.close();
  return processors;
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    let totalNuevos = 0;

    for (let i = 1; i <= 3; i++) {
      console.log(`📄 Scrapeando página ${i}...`);
      const processors = await scrapeProcessorsFromPage(i);

      for (const proc of processors) {
        const exists = await Processor.findOne({ name: proc.name, price: proc.price });
        if (!exists) {
          await Processor.create(proc);
          totalNuevos++;
        }
      }
    }

    console.log(`✅ Se guardaron ${totalNuevos} procesadores populares en total.`);
  } catch (err) {
    console.error('❌ Error en scraping:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
