const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const outDir = '/Users/jakub/.gemini/antigravity/brain/9ac79773-4449-4d52-b5bc-83ec0b8bd7c5/screenshots';
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

  const baseUrl = 'http://localhost:3000';
  console.log(`Navigating to ${baseUrl}...`);
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Feed screen
  console.log('Capturing Next.js Feed screen...');
  await page.screenshot({ path: path.join(outDir, '01_feed_screen.png') });

  // 2. Discover tab
  console.log('Capturing Next.js Discover screen...');
  const navButtons = await page.$$('nav button');
  if (navButtons.length >= 4) {
    await navButtons[1].click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outDir, '02_discover_screen.png') });

    // 3. Tickets tab
    console.log('Capturing Next.js Tickets screen...');
    await navButtons[2].click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outDir, '03_tickets_screen.png') });

    // 4. Profile tab
    console.log('Capturing Next.js Profile screen...');
    await navButtons[3].click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outDir, '04_profile_screen.png') });

    // 5. Return to Feed & click on event title for Detail Modal
    console.log('Capturing Next.js Event Detail screen...');
    await navButtons[0].click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // Click Lístek button to open modal
  const actionButtons = await page.$$('button');
  for (const btn of actionButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Lístek')) {
      await btn.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(outDir, '05_event_detail_modal.png') });

  console.log('All screenshots captured successfully!');
  await browser.close();
  process.exit(0);
})();
