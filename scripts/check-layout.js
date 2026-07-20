const puppeteer = require('puppeteer');

async function run() {
  console.log('🔍 Launching Puppeteer to inspect layout boxes...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--ignore-certificate-errors',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });

  try {
    await page.goto('https://localhost:8443', { waitUntil: 'networkidle2' });
    
    // Evaluate positions
    const layout = await page.evaluate(() => {
      const authScreen = document.getElementById('auth-screen');
      const container = document.querySelector('.auth-container');
      const card = document.querySelector('.auth-card');
      const brand = document.querySelector('.auth-brand');
      
      const getBox = (el) => {
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          id: el.id,
          class: el.className,
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
          display: window.getComputedStyle(el).display,
          opacity: window.getComputedStyle(el).opacity,
          visibility: window.getComputedStyle(el).visibility,
          transform: window.getComputedStyle(el).transform
        };
      };
      
      return {
        authScreen: getBox(authScreen),
        container: getBox(container),
        card: getBox(card),
        brand: getBox(brand)
      };
    });
    
    console.log('Layout boxes details:');
    console.log(JSON.stringify(layout, null, 2));

  } catch (err) {
    console.error('❌ Layout inspection failed:', err);
  } finally {
    await browser.close();
  }
}

run();
