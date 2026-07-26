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
  await page.goto(url, { waitUntil: 'networkidle0' });

  // 1. Feed screen
  console.log('Capturing Next.js Feed screen...');
  await page.screenshot({ path: path.join(outDir, 'next_feed.png') });

  // 2. Click Discover tab
  console.log('Capturing Next.js Discover screen...');
  const tabs = await page.$$('nav button');
  if (tabs[1]) await tabs[1].click();
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'next_discover.png') });

  // 3. Click Profile tab
  console.log('Capturing Next.js Profile screen...');
  if (tabs[3]) await tabs[3].click();
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'next_profile.png') });

  // 4. Click Feed back and click Title to open Event Detail Modal
  if (tabs[0]) await tabs[0].click();
  await new Promise(r => setTimeout(r, 500));
  const eventTitle = await page.$('h1');
  if (eventTitle) await eventTitle.click();
  await new Promise(r => setTimeout(r, 500));
  console.log('Capturing Next.js Event Detail screen...');
  await page.screenshot({ path: path.join(outDir, 'next_detail.png') });

  console.log('All Next.js screenshots captured successfully!');
  await browser.close();
})();
