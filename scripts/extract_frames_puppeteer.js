const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const videos = [
  { video: 'metronome_festival.mp4', image: 'metronome_festival.jpg' },
  { video: 'xindl_live.mp4', image: 'xindl_live.jpg' },
  { video: 'prague_derby.mp4', image: 'prague_derby.jpg' },
  { video: 'beats_for_love.mp4', image: 'beats_for_love.jpg' },
  { video: 'labuti_jezero.mp4', image: 'labuti_jezero.jpg' },
  { video: 'allstar_game.mp4', image: 'allstar_game.jpg' }
];

const videoDir = path.join(__dirname, '..', 'next-app', 'public', 'videos');
const outDirs = [
  path.join(__dirname, '..', 'images'),
  path.join(__dirname, '..', 'next-app', 'public', 'images')
];

outDirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

(async () => {
  console.log('Extracting authentic poster frames from downloaded MP4 videos using Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  for (const item of videos) {
    const videoPath = path.join(videoDir, item.video);
    if (!fs.existsSync(videoPath)) {
      console.log(`File missing: ${videoPath}`);
      continue;
    }

    const videoUrl = `file://${videoPath}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="margin:0; background:black; display:flex; justify-content:center; align-items:center;">
        <video id="vid" src="${videoUrl}" autoplay muted playsinline style="max-width:100%; max-height:100%;"></video>
      </body>
      </html>
    `;

    await page.setContent(htmlContent);
    await page.evaluate(() => {
      return new Promise(resolve => {
        const v = document.getElementById('vid');
        v.currentTime = 3;
        v.onseeked = resolve;
        v.onloadedmetadata = () => {
          v.currentTime = Math.min(3, v.duration / 2);
        };
        setTimeout(resolve, 2000);
      });
    });

    const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality: 90 });

    outDirs.forEach(d => {
      const targetPath = path.join(d, item.image);
      fs.writeFileSync(targetPath, screenshotBuffer);
      console.log(`Saved authentic frame to ${targetPath}`);
    });
  }

  await browser.close();
  console.log('Finished extracting authentic video frames!');
})();
