const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const outDir = '/Users/jakub/.gemini/antigravity/brain/aeb6a1c9-d2cd-4ecf-a437-55424474b909/next_screens';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  console.log('Launching browser for Next.js app screenshot capture...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2
  });

  const url = 'http://localhost:3010';
  console.log(`Navigating to ${url}...`);
  await page.goto('http://localhost:3010', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });

  // 1. Feed screen
  console.log('Capturing Next.js Feed screen...');
  await page.screenshot({ path: path.join(outDir, 'next_feed.png') });

  const buttonLabels = await page.$$eval('button', btns => btns.map(b => b.getAttribute('aria-label') || b.innerText));
  console.log('Found buttons:', buttonLabels);

  // 2. Click Discover tab
  console.log('Capturing Next.js Discover screen...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const discoverBtn = btns.find(b => b.getAttribute('aria-label') === 'Prozkoumat');
    if (discoverBtn) discoverBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'next_discover.png') });

  // 3. Click Tickets tab
  console.log('Capturing Next.js Tickets screen...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const ticketBtn = btns.find(b => b.getAttribute('aria-label') === 'Lístky');
    if (ticketBtn) ticketBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'next_tickets.png') });

  // 4. Click Profile tab
  console.log('Capturing Next.js Profile screen...');
  await page.click('button[aria-label="Profil"]');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'next_profile.png') });

  // 5. Click Feed back and click Title to open Event Detail Modal
  await page.click('button[aria-label="Feed"]');
  await new Promise(r => setTimeout(r, 500));
  const eventTitle = await page.$('h1');
  if (eventTitle) await eventTitle.click();
  await new Promise(r => setTimeout(r, 500));
  console.log('Capturing Next.js Event Detail screen...');
  await page.screenshot({ path: path.join(outDir, 'next_detail.png') });

  console.log('All Next.js screenshots captured successfully!');
  await browser.close();
})();
