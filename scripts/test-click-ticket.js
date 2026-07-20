const puppeteer = require('puppeteer');
const path = require('path');

const artifactsDir = '/Users/jakub/.gemini/antigravity/brain/716a7d55-3c47-4d2c-a526-fd0f293e9355';

async function run() {
  console.log('🏁 Launching Puppeteer to test ticket details click...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--ignore-certificate-errors',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });

  // Bypass service worker reloads
  await page.evaluateOnNewDocument(() => {
    delete navigator.__proto__.serviceWorker;
  });
  await page.setBypassServiceWorker(true);

  try {
    console.log('1. Loading login page...');
    await page.goto('https://localhost:8443', { waitUntil: 'networkidle2' });
    
    console.log('2. Logging in...');
    await page.waitForSelector('#auth-identity');
    await page.type('#auth-identity', 'jakub@gmail.com');
    await page.click('#auth-identity-form button[type="submit"]');
    
    await page.waitForSelector('#auth-step-otp:not(.hidden)');
    const digits = await page.$$('.otp-digit');
    await digits[0].type('1');
    await digits[1].type('2');
    await digits[2].type('3');
    await digits[3].type('4');
    
    await page.waitForSelector('#feed-screen.active');
    console.log('✅ Logged in successfully.');

    // Switch to tickets screen
    console.log('3. Switching to tickets tab...');
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => document.getElementById('btn-capsule-tickets').click());
    await page.waitForSelector('#ticket-screen.active');
    console.log('✅ Ticket screen active.');

    // Check if passes-folder-grid exists
    await page.waitForSelector('.pass-folder-card');
    console.log('✅ Found at least one ticket card.');
    
    // Click the first card
    console.log('4. Clicking the first ticket card...');
    await page.evaluate(() => {
      const cards = document.querySelectorAll('.pass-folder-card');
      cards[0].click();
    });

    // Wait 3 seconds
    await new Promise(r => setTimeout(r, 3000));

    const html = await page.evaluate(() => {
      return document.getElementById('tickets-list-wrapper').innerHTML;
    });
    console.log('--- WRAPPER HTML ---');
    console.log(html);

    await page.screenshot({ path: path.join(artifactsDir, 'test_ticket_click_result.png') });
    console.log('📸 Screenshot of click result saved.');

  } catch (err) {
    console.error('❌ Click test failed:', err);
  } finally {
    await browser.close();
    console.log('🏁 Puppeteer closed.');
  }
}

run();
