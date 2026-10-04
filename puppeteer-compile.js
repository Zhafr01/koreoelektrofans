/**
 * puppeteer-compile.js
 * Menggunakan Puppeteer + Chrome headless untuk menjalankan compile.html
 * dan menyimpan targets.mind langsung ke folder project.
 */

const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const fs = require('fs');

const PROJECT_DIR = path.resolve(__dirname);
const OUTPUT_PATH = path.join(PROJECT_DIR, 'targets.mind');
const COMPILE_URL = 'http://localhost:3131/compile.html';

(async () => {
  console.log('🚀 Memulai Puppeteer compiler...');
  console.log('📁 Project dir:', PROJECT_DIR);

  // Cek server
  await new Promise((resolve, reject) => {
    http.get('http://localhost:3131/', (res) => {
      console.log('✅ Server berjalan di port 3131 (HTTP ' + res.statusCode + ')');
      resolve();
    }).on('error', () => {
      console.log('❌ Server tidak berjalan. Jalankan dulu: python3 -m http.server 3131 --directory "' + PROJECT_DIR + '"');
      process.exit(1);
    });
  });

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: false,
    env: { ...process.env, DISPLAY: process.env.DISPLAY || ':0' },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--allow-running-insecure-content',
      '--start-maximized',
    ],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Intercept download: override anchor.click() to capture blob as base64
  await page.exposeFunction('_saveTargetFile', async (base64Data) => {
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(OUTPUT_PATH, buffer);
    console.log('\n💾 File disimpan ke:', OUTPUT_PATH, '(' + buffer.length + ' bytes)');
  });

  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error' || text.toLowerCase().includes('error')) {
      console.error('🔴 [browser]', text.slice(0, 200));
    }
  });

  page.on('pageerror', err => {
    console.error('🔴 [pageerror]', err.message.slice(0, 200));
  });

  console.log('📂 Membuka compile.html...');
  await page.goto(COMPILE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  console.log('✅ Halaman dimuat');

  // Override anchor download sebelum klik compile
  await page.evaluate(() => {
    const origAppendChild = document.body.appendChild.bind(document.body);
    document.body.appendChild = function(el) {
      if (el.tagName === 'A' && el.download && el.href && el.href.startsWith('blob:')) {
        // Intercept blob download
        fetch(el.href)
          .then(r => r.arrayBuffer())
          .then(buf => {
            const arr = new Uint8Array(buf);
            let str = '';
            for (let i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i]);
            window._saveTargetFile(btoa(str));
          })
          .catch(e => console.error('Intercept error:', e));
        return el; // don't actually append
      }
      return origAppendChild(el);
    };
  });

  // Tunggu tombol enabled (MindAR module loaded)
  console.log('⏳ Menunggu MindAR dimuat...');
  await page.waitForFunction(() => {
    const btn = document.getElementById('btn-compile');
    return btn && !btn.disabled;
  }, { timeout: 30000 });
  console.log('✅ MindAR siap!');

  // Klik compile
  console.log('⚡ Memulai kompilasi...');
  await page.click('#btn-compile');

  // Poll status
  console.log('⏳ Menunggu kompilasi selesai...');
  const startTime = Date.now();
  const maxWait   = 240000; // 4 menit

  while (Date.now() - startTime < maxWait) {
    await new Promise(r => setTimeout(r, 2000));

    const { text, cls } = await page.evaluate(() => {
      const el = document.getElementById('status-msg');
      return { text: el ? el.textContent : '', cls: el ? el.className : '' };
    });

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    process.stdout.write('\r⏱️  ' + elapsed + 's | ' + text.slice(0, 70).padEnd(72));

    if (cls === 'success' || text.includes('✅')) {
      console.log('\n✅ Kompilasi berhasil!');
      // Tunggu file disimpan
      await new Promise(r => setTimeout(r, 3000));
      break;
    }
    if (cls === 'error' || text.includes('❌')) {
      console.log('\n❌ Kompilasi gagal: ' + text);
      await browser.close();
      process.exit(1);
    }
  }

  await browser.close();

  if (fs.existsSync(OUTPUT_PATH)) {
    const size = fs.statSync(OUTPUT_PATH).size;
    console.log('\n🎉 SUKSES! targets.mind tersimpan: ' + OUTPUT_PATH);
    console.log('   Ukuran: ' + size + ' bytes (' + (size/1024).toFixed(1) + ' KB)');
    console.log('\n📱 Sekarang buka index.html di server untuk mencoba AR!');
  } else {
    console.log('\n⚠️  targets.mind tidak tersimpan. Mungkin perlu dicoba manual di browser.');
  }
})().catch(err => {
  console.error('\n❌ Fatal:', err.message);
  process.exit(1);
});
