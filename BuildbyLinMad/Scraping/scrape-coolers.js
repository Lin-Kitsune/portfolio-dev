import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const coolerSchema = new mongoose.Schema({
  name: String,
  price: String,
  specs: String,
  link: String,
});
const Cooler = mongoose.model('Cooler', coolerSchema);

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

async function scrapeCoolersFromPage(page, url) {
  await page.goto(url, { waitUntil: 'networkidle2' });
  await autoScroll(page);
  await page.waitForSelector('div.MuiCardContent-root', { timeout: 10000 });

  return await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.MuiCardContent-root'));
    return cards.map(card => {
      const name = card.querySelector('div.MuiTypography-h5')?.textContent?.trim();
      const price = card.querySelector('div.MuiTypography-h2')?.textContent?.trim();
      const specs = card.querySelector('.ProductPage_product_specs__pYVnc')?.innerText?.trim();
      const link = window.location.href;
      return { name, price, specs, link };
    }).filter(cooler => cooler.name && cooler.price);
  });
}

async function scrapeCoolers(totalPages = 3) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  await page.setViewport({ width: 1280, height: 800 });

  let allCoolers = [];

  for (let i = 1; i <= totalPages; i++) {
    console.log(`🌀 Scrapeando CPU Coolers página ${i}...`);
    const url = `https://www.solotodo.cl/cpu_coolers?ordering=leads&page=${i}`;
    const data = await scrapeCoolersFromPage(page, url);
    allCoolers = allCoolers.concat(data);
  }

  await browser.close();
  return allCoolers;
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const coolers = await scrapeCoolers(3); // 3 páginas ≈ 60 coolers
    let nuevas = 0;

    for (const cooler of coolers) {
      const exists = await Cooler.findOne({ name: cooler.name, price: cooler.price });
      if (!exists) {
        await Cooler.create(cooler);
        nuevas++;
      }
    }

    console.log(`✅ Se guardaron ${nuevas} CPU Coolers populares en total.`);
  } catch (err) {
    console.error('❌ Error al ejecutar el scraping:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
