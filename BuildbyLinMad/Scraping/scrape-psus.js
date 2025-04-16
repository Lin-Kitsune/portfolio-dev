import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const psuSchema = new mongoose.Schema({
  name: String,
  price: String,
  specs: String,
  link: String,
});
const PSU = mongoose.model('PSU', psuSchema);

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

async function scrapePSUsFromPage(page, url) {
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
    }).filter(psu => psu.name && psu.price);
  });
}

async function scrapePSUs(totalPages = 3) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  await page.setViewport({ width: 1280, height: 800 });

  let allPSUs = [];

  for (let i = 1; i <= totalPages; i++) {
    console.log(`🔌 Scrapeando fuentes de poder página ${i}...`);
    const url = `https://www.solotodo.cl/fuentes_de_poder?ordering=leads&page=${i}`;
    const data = await scrapePSUsFromPage(page, url);
    allPSUs = allPSUs.concat(data);
  }

  await browser.close();
  return allPSUs;
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const psus = await scrapePSUs(3); // 3 páginas ≈ 60 PSUs
    let nuevas = 0;

    for (const psu of psus) {
      const exists = await PSU.findOne({ name: psu.name, price: psu.price });
      if (!exists) {
        await PSU.create(psu);
        nuevas++;
      }
    }

    console.log(`✅ Se guardaron ${nuevas} fuentes de poder populares en total.`);
  } catch (err) {
    console.error('❌ Error al ejecutar el scraping:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
