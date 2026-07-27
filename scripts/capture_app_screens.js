const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const outDir = '/Users/jakub/.gemini/antigravity/brain/aeb6a1c9-d2cd-4ecf-a437-55424474b909/app_screens';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  console.log('Launching browser for app screenshot capture...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 390,
    height: 844,
    deviceScaleFactor: 2
  });

  const indexPath = 'https://localhost:8443';
  console.log(`Navigating to ${indexPath}...`);
  await page.goto(indexPath, { waitUntil: 'networkidle0' });

  // Helper to show a specific screen and hide others
  const showScreen = async (screenId) => {
    await page.evaluate((id) => {
      document.querySelectorAll('.app-screen').forEach(s => {
        s.classList.remove('active');
        s.style.setProperty('display', 'none', 'important');
      });
      const target = document.querySelector(id);
      if (target) {
        target.classList.add('active');
        target.style.setProperty('display', 'block', 'important');
        target.style.opacity = '1';
        target.style.pointerEvents = 'auto';
        target.style.transform = 'none';
      }
    }, screenId);
    await new Promise(r => setTimeout(r, 600));
  };

  // 1. TikTok Feed
  console.log('Capturing Feed screen...');
  await showScreen('#feed-screen');
  await page.screenshot({ path: path.join(outDir, 'app_feed.png') });

  // 2. Grid Discovery
  console.log('Capturing Grid screen...');
  await showScreen('#grid-screen');
  await page.screenshot({ path: path.join(outDir, 'app_grid.png') });

  // 3. Event Detail
  console.log('Capturing Detail screen...');
  await showScreen('#detail-screen');
  await page.screenshot({ path: path.join(outDir, 'app_detail.png') });

  // 4. Profile / Wallet
  console.log('Capturing Profile screen...');
  await showScreen('#profile-screen');
  await page.screenshot({ path: path.join(outDir, 'app_profile.png') });

  console.log('All app screenshots captured successfully!');
  await browser.close();
})();
