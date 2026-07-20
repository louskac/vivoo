const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const artifactsDir = '/Users/jakub/.gemini/antigravity/brain/716a7d55-3c47-4d2c-a526-fd0f293e9355';
if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

async function run() {
  console.log('📸 Launching Puppeteer to take app screenshots (Modern Onboarding)...');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--ignore-certificate-errors',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 }); // Exact iPhone 12/13/14 viewport size

  try {
    // 1. Load the page
    console.log('1. Loading login/registration entry page...');
    await page.goto('https://localhost:8443', { waitUntil: 'networkidle2' });
    
    await page.waitForSelector('#auth-screen.active');
    
    // Take screenshot of the new clean onboarding entry view
    const loginPath = path.join(artifactsDir, 'login_page.png');
    await page.screenshot({ path: loginPath });
    console.log('✅ Entry page screenshot saved:', loginPath);

    // 2. Fill Phone/Email and click Continue
    console.log('2. Entering identity (email) and submitting...');
    await page.type('#auth-identity', 'jakub@gmail.com');
    await page.screenshot({ path: path.join(artifactsDir, 'before_submit.png') });
    
    await page.click('#auth-identity-form button[type="submit"]');
    
    // Wait for the OTP step to become active
    await page.waitForSelector('#auth-step-otp:not(.hidden)');
    console.log('✅ OTP step active.');

    // Take screenshot of OTP 4-digits input view
    const signupPath = path.join(artifactsDir, 'signup_page.png');
    await page.screenshot({ path: signupPath });
    console.log('✅ OTP code entry page screenshot saved:', signupPath);

    // 3. Type 4 digits code
    console.log('3. Typing OTP digits 1234...');
    const digits = await page.$$('.otp-digit');
    await digits[0].type('1');
    await digits[1].type('2');
    await digits[2].type('3');
    await digits[3].type('4');
    
    // Wait for feed screen to become active
    await page.waitForSelector('#feed-screen.active', { timeout: 10000 });
    console.log('✅ Code verified and redirected to feed!');

    // Take screenshot of discovery feed
    const feedPath = path.join(artifactsDir, 'feed_page.png');
    await page.screenshot({ path: feedPath });
    console.log('✅ Feed screen screenshot saved:', feedPath);

    // 3.2 Navigate to grid (Discovery Grid)
    console.log('3.2 Navigating to discovery grid...');
    await page.click('#btn-capsule-grid');
    await page.waitForSelector('#grid-screen.active');
    
    const gridPath = path.join(artifactsDir, 'grid_page.png');
    await page.screenshot({ path: gridPath });
    console.log('✅ Discovery grid screen screenshot saved:', gridPath);

    // 3.5 Navigate to tickets (Empty wallet page)
    console.log('3.5 Navigating to tickets (Empty Wallet)...');
    await page.click('#btn-capsule-tickets');
    await page.waitForSelector('#ticket-screen.active');
    
    const walletPath = path.join(artifactsDir, 'wallet_page.png');
    await page.screenshot({ path: walletPath });
    console.log('✅ Empty wallet screenshot saved:', walletPath);

    // 4. Navigate to profile tab
    console.log('4. Navigating to profile...');
    await page.click('#btn-capsule-profile');
    await page.waitForSelector('#profile-screen.active');
    
    // Take screenshot of profile details
    const profilePath = path.join(artifactsDir, 'profile_page.png');
    await page.screenshot({ path: profilePath });
    console.log('✅ Profile screen screenshot saved:', profilePath);

  } catch (err) {
    console.error('❌ Screenshot capture failed:', err);
  } finally {
    await browser.close();
    console.log('🏁 Puppeteer browser closed.');
  }
}

run();
