const puppeteer = require('puppeteer');

async function run() {
  console.log('🔍 Launching Puppeteer to debug Sign Out button click...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--ignore-certificate-errors',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();
  
  // Relay page console errors
  page.on('console', msg => {
    console.log(`[Browser Console] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.evaluateOnNewDocument(() => {
    delete navigator.__proto__.serviceWorker;
  });
  await page.setBypassServiceWorker(true);

  try {
    await page.goto('https://localhost:8443', { waitUntil: 'networkidle2' });
    
    // 1. Log in via OTP
    console.log('1. Logging in...');
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

    // 2. Navigate to Profile
    console.log('2. Navigating to profile...');
    await page.evaluate(() => document.getElementById('btn-capsule-profile').click());
    await page.waitForSelector('#profile-screen.active');
    console.log('✅ Profile screen active.');

    // 3. Inspect Sign Out Button properties
    const buttonProps = await page.evaluate(() => {
      const btn = document.getElementById('btn-sign-out');
      if (!btn) return 'not found';
      
      const rect = btn.getBoundingClientRect();
      const style = window.getComputedStyle(btn);
      const parentStyle = window.getComputedStyle(btn.parentElement);
      
      // Let's see what is at the center coordinates of the button
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const elementAtPoint = document.elementFromPoint(x, y);
      
      return {
        text: btn.textContent,
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        display: style.display,
        zIndex: style.zIndex,
        parentZIndex: parentStyle.zIndex,
        pointerEvents: style.pointerEvents,
        parentPointerEvents: parentStyle.pointerEvents,
        elementAtPoint: elementAtPoint ? {
          tag: elementAtPoint.tagName,
          id: elementAtPoint.id,
          class: elementAtPoint.className
        } : null
      };
    });
    
    console.log('Sign Out button details:');
    console.log(JSON.stringify(buttonProps, null, 2));

    // 4. Try clicking the button
    console.log('4. Clicking the Sign Out button...');
    await page.evaluate(() => document.getElementById('btn-sign-out').click());
    
    // Check if we got redirected to auth-screen
    await new Promise(r => setTimeout(r, 1000));
    const activeScreen = await page.evaluate(() => {
      const active = document.querySelector('.app-screen.active');
      return active ? active.id : null;
    });
    
    console.log('Active screen after clicking Sign Out:', activeScreen);

  } catch (err) {
    console.error('❌ Sign Out debug failed:', err);
  } finally {
    await browser.close();
  }
}

run();
