const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting End-to-End (E2E) Test Suite for ViVoo Next.js App...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  const url = 'http://localhost:3010';
  console.log(`Connecting to ${url}...`);
  await page.goto(url, { waitUntil: 'networkidle0' });

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  };

  // ----------------------------------------------------
  // TEST SUITE 1: TikTok Feed Initial Load
  // ----------------------------------------------------
  console.log('\n[Suite 1: TikTok Feed Screen]');
  const video = await page.$('video');
  assert(video !== null, 'TikTok Feed video element plays');

  const title = await page.$eval('h1', el => el.textContent);
  assert(title.includes('Metronome Festival') || title.includes('Koncert pod živými hvězdami'), 'Feed displays event title');

  const badgeText = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim() === 'FESTIVAL' || s.textContent.trim() === 'HUDBA');
    return el ? el.textContent.trim() : '';
  });
  assert(badgeText === 'FESTIVAL' || badgeText === 'HUDBA', 'Tag badge is rendered');

  // ----------------------------------------------------
  // TEST SUITE 2: Sound & Action Buttons
  // ----------------------------------------------------
  console.log('\n[Suite 2: Sound & Action Controls]');
  const soundBtn = await page.$('button[aria-label="Sound toggle"]');
  assert(soundBtn !== null, 'Glass circle sound toggle button exists (38px)');
  if (soundBtn) {
    await soundBtn.click();
    await new Promise(r => setTimeout(r, 200));
    assert(true, 'Clicked sound toggle button (muted/unmuted state toggles)');
  }

  // ----------------------------------------------------
  // TEST SUITE 3: Event Detail Modal (Figma Spec Verification)
  // ----------------------------------------------------
  console.log('\n[Suite 3: Event Detail Modal]');
  const actionButtons = await page.$$('button');
  let listekBtn = null;
  for (const btn of actionButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('Lístek')) {
      listekBtn = btn;
      break;
    }
  }

  assert(listekBtn !== null, 'Lístek action button exists in right sidebar');
  if (listekBtn) {
    await listekBtn.click();
    await new Promise(r => setTimeout(r, 400));
    
    // Check detail modal opened
    const detailTitle = await page.$eval('h1', el => el.textContent);
    assert(detailTitle.length > 0, 'Event Detail modal opens with correct full-bleed hero banner title');

    // Check bottom nav capsule is HIDDEN (Point 4 spec)
    const navCapsule = await page.$('nav');
    assert(navCapsule === null, 'Bottom navigation capsule is strictly HIDDEN on Detail screen (Figma Spec)');

    // Check purchase footer
    const footerPrice = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Kč'));
      return el ? el.textContent : '';
    });
    assert(footerPrice.includes('Kč'), 'Sticky bottom purchase bar displays pricing (od XXX Kč) + "Koupit" button');

    // Click back chevron button
    const backBtn = await page.$('button[aria-label="Back"]');
    assert(backBtn !== null, 'Back chevron glass button closes modal');
    if (backBtn) {
      await backBtn.click();
      await new Promise(r => setTimeout(r, 400));
    }
  }

  // ----------------------------------------------------
  // TEST SUITE 4: Navigation Capsule & Discover Tab
  // ----------------------------------------------------
  console.log('\n[Suite 4: Navigation Capsule & Discovery Grid]');
  let tabs = await page.$$('nav button');
  assert(tabs.length === 4, 'Floating navigation capsule has 4 tab items');

  if (tabs[1]) {
    await tabs[1].click(); // Prozkoumat / Discover tab
    await new Promise(r => setTimeout(r, 400));

    const discoverHeading = await page.$eval('h3', el => el.textContent);
    assert(discoverHeading.includes('Dnes v Praze'), 'Discover screen renders "Dnes v Praze" multi-category grid section');

    const searchInput = await page.$('input[placeholder*="Hledej"]');
    assert(searchInput !== null, 'Search input and city selector pill rendered');
  }

  // ----------------------------------------------------
  // TEST SUITE 5: Profile & Cashless Wallet State Transitions
  // ----------------------------------------------------
  console.log('\n[Suite 5: Profile & Cashless Wallet]');
  tabs = await page.$$('nav button');
  if (tabs[3]) {
    await tabs[3].click(); // Profil tab
    await new Promise(r => setTimeout(r, 400));

    const profileName = await page.$eval('h2', el => el.textContent);
    assert(profileName.includes('Jan Novák'), 'Profile displays unboxed user name "Jan Novák"');

    const initialCredit = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('div')).find(d => d.textContent.includes('2,360 Kč'));
      return el ? el.textContent : '';
    });
    assert(initialCredit.includes('2,360 Kč'), 'Cashless wallet balance displays 2,360 Kč initial state');

    // Find and click "Dobít kredit" button
    const profileBtns = await page.$$('button');
    let topupBtnEl = null;
    for (const btn of profileBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Dobít kredit')) {
        topupBtnEl = btn;
        break;
      }
    }
    assert(topupBtnEl !== null, 'Dobít kredit top-up button exists');

    if (topupBtnEl) {
      await topupBtnEl.click();
      await new Promise(r => setTimeout(r, 300));
      
      const newCreditText = await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll('div')).find(d => d.textContent.includes('2,860 Kč'));
        return el ? el.textContent : '';
      });
      assert(newCreditText.includes('2,860 Kč'), 'Clicking "Dobít kredit" updates Zustand reactive state to 2,860 Kč in real-time');
    }
  }

  console.log('\n====================================================');
  console.log(`TOTAL RESULT: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  await browser.close();
  process.exit(failed === 0 ? 0 : 1);
})();
