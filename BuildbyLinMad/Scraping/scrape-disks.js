import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const diskSchema = new mongoose.Schema({
  name: String,
  price: String,
  specs: String,
  link: String,
});
const Disk = mongoose.model('Disk', diskSchema);

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

async function scrapeDisksFromPage(page, url) {
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
    }).filter(disk => disk.name && disk.price);
  });
}

async function scrapeDisks(totalPages = 3) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  await page.setViewport({ width: 1280, height: 800 });

  let allDisks = [];

  for (let i = 1; i <= totalPages; i++) {
    console.log(`📦 Scrapeando discos página ${i}...`);
    const url = `https://www.solotodo.cl/discos_duros?ordering=leads&page=${i}`;
    const data = await scrapeDisksFromPage(page, url);
    allDisks = allDisks.concat(data);
  }

  await browser.close();
  return allDisks;
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const disks = await scrapeDisks(3); // 3 páginas ≈ 60 discos
    let nuevas = 0;

    for (const disk of disks) {
      const exists = await Disk.findOne({ name: disk.name, price: disk.price });
      if (!exists) {
        await Disk.create(disk);
        nuevas++;
      }
    }

    console.log(`✅ Se guardaron ${nuevas} discos duros populares en total.`);
  } catch (err) {
    console.error('❌ Error al ejecutar el scraping:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
