const puppeteer = require('puppeteer');
const path = require('path');

const artifactsDir = '/Users/jakub/.gemini/antigravity/brain/d5547cb9-7085-4237-8a0d-db53e475a01c';

async function run() {
  console.log('🏁 Launching Puppeteer to test credit validation, topup, and purchase...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--ignore-certificate-errors',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();
  
  // Forward browser console logs
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
    // 1. Load login page
    console.log('1. Loading login page...');
    await page.goto('https://localhost:8443', { waitUntil: 'networkidle2' });
    
    // 2. Perform Login
    console.log('2. Entering identity and submitting...');
    await page.waitForSelector('#auth-identity');
    await page.type('#auth-identity', 'jakub@gmail.com');
    await page.click('#auth-identity-form button[type="submit"]');
    
    console.log('Waiting for OTP view...');
    await page.waitForSelector('#auth-step-otp:not(.hidden)');
    const digits = await page.$$('.otp-digit');
    await digits[0].type('1');
    await digits[1].type('2');
    await digits[2].type('3');
    await digits[3].type('4');
    
    console.log('Waiting for feed screen...');
    await page.waitForSelector('#feed-screen.active');
    console.log('✅ Logged in successfully.');

    // 3. Switch to Grid / Discovery screen
    console.log('3. Switching to grid...');
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => document.getElementById('btn-capsule-grid').click());
    await page.waitForSelector('#grid-screen.active');
    console.log('✅ Grid screen active.');

    // 4. Click Spotlight Hero event card to open details (Prague Derby - 650 CZK)
    console.log('4. Clicking Spotlight Hero event...');
    await page.evaluate(() => document.getElementById('grid-hero-spotlight').click());
    await page.waitForSelector('#detail-screen.active');
    console.log('✅ Event detail screen active.');

    // Adjust budget slider to select Sektor B (650 CZK) so credit of 450 is insufficient
    console.log('Adjusting budget slider to select Sektor B...');
    await page.evaluate(() => {
      const slider = document.getElementById('seating-budget-slider');
      slider.value = 800;
      slider.dispatchEvent(new Event('input'));
    });

    // 5. Click "Get Ticket" CTA to go to Checkout
    console.log('5. Clicking Get Ticket...');
    await page.evaluate(() => document.getElementById('detail-buy-btn').click());
    await page.waitForSelector('#checkout-screen.active');
    console.log('✅ Checkout screen active.');

    // 6. Click Pay with Apple Pay
    console.log('6. Clicking Apple Pay button...');
    await page.evaluate(() => document.getElementById('checkout-pay-btn').click());
    await page.waitForSelector('#apple-pay-sheet:not(.hidden)');
    console.log('✅ Apple Pay sheet visible.');

    // 7. Click Face ID trigger to authorize (should fail due to insufficient credit)
    console.log('7. Tapping Face ID trigger (expecting block)...');
    await page.evaluate(() => document.getElementById('face-id-trigger').click());
    
    // Wait for scanning class, then wait for error toast
    await page.waitForSelector('#face-id-trigger.scanning');
    console.log('⏱️ Scanning animation active.');
    
    // Wait for the Face ID trigger to return to normal (reset on error)
    await page.waitForSelector('#face-id-trigger:not(.scanning):not(.success)', { timeout: 10000 });
    console.log('✅ Purchase blocked correctly due to insufficient credit.');
    
    // Take screenshot of blocked state with error toast
    await page.screenshot({ path: path.join(artifactsDir, 'test_buy_block_toast.png') });
    console.log('📸 Blocked toast screenshot saved.');

    // Dismiss Apple Pay sheet
    console.log('Dismissing Apple Pay sheet...');
    await page.evaluate(() => document.getElementById('apple-pay-close').click());
    await page.waitForSelector('#apple-pay-sheet.hidden');

    // Go back from Checkout and Detail to Grid
    console.log('Returning to profile tab to top up...');
    await page.evaluate(() => document.getElementById('btn-capsule-profile').click());
    await page.waitForSelector('#profile-screen.active');
    console.log('✅ Profile screen active.');

    // 8. Click Top Up Cashless button 4 times (+800 CZK)
    console.log('8. Clicking Top Up Cashless button 4 times...');
    await page.evaluate(() => document.getElementById('btn-wallet-topup').click());
    await new Promise(r => setTimeout(r, 300));
    await page.evaluate(() => document.getElementById('btn-wallet-topup').click());
    await new Promise(r => setTimeout(r, 300));
    await page.evaluate(() => document.getElementById('btn-wallet-topup').click());
    await new Promise(r => setTimeout(r, 300));
    await page.evaluate(() => document.getElementById('btn-wallet-topup').click());
    await new Promise(r => setTimeout(r, 500));

    const balanceBefore = await page.evaluate(() => {
      return document.getElementById('profile-wallet-credit-stat').textContent;
    });
    console.log(`✅ Topped up cashless balance. Current balance is: ${balanceBefore} CZK.`);
    await page.screenshot({ path: path.join(artifactsDir, 'test_buy_profile_topped_up.png') });

    // 9. Go back to Grid and repeat checkout
    console.log('9. Returning to grid...');
    await page.evaluate(() => document.getElementById('btn-capsule-grid').click());
    await page.waitForSelector('#grid-screen.active');

    console.log('Re-clicking Spotlight Hero...');
    await page.evaluate(() => document.getElementById('grid-hero-spotlight').click());
    await page.waitForSelector('#detail-screen.active');

    console.log('Re-clicking Get Ticket...');
    await page.evaluate(() => document.getElementById('detail-buy-btn').click());
    await page.waitForSelector('#checkout-screen.active');

    console.log('Re-clicking Apple Pay...');
    await page.evaluate(() => document.getElementById('checkout-pay-btn').click());
    await page.waitForSelector('#apple-pay-sheet:not(.hidden)');

    console.log('Re-authorizing Face ID (should succeed now)...');
    await page.evaluate(() => document.getElementById('face-id-trigger').click());

    // Wait for ticket screen active
    await page.waitForSelector('#ticket-screen.active', { timeout: 10000 });
    console.log('✅ Purchase succeeded after top up! Redirected to ticket screen.');

    // Save ticket screen list screenshot (should show the bought ticket)
    await page.screenshot({ path: path.join(artifactsDir, 'test_buy_succeeded_tickets.png') });
    console.log('📸 Tickets list screenshot saved.');

    // 10. Switch to Profile to check remaining balance
    console.log('10. Switching to profile to check remaining cashless balance...');
    await page.evaluate(() => document.getElementById('btn-capsule-profile').click());
    await page.waitForSelector('#profile-screen.active');

    const balanceAfter = await page.evaluate(() => {
      return document.getElementById('profile-wallet-credit-stat').textContent;
    });
    console.log(`✅ Final balance on Profile: ${balanceAfter} CZK.`);
    await page.screenshot({ path: path.join(artifactsDir, 'test_buy_final_profile_balance.png') });

  } catch (err) {
    console.error('❌ Integration test failed:', err);
  } finally {
    await browser.close();
    console.log('🏁 Puppeteer closed.');
  }
}

run();
