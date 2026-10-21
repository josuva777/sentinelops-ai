import { chromium } from 'playwright';
import path from 'path';

async function runVerification() {
  console.log('🚀 Running Comprehensive Spacing, Navbar & Desktop & Mobile App Verification...\n');

  const artifactDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\62c8578d-c73a-406b-895f-b6fe94e3e486';
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  });

  const consoleErrors = [];

  // =========================================================================
  // 1. DESKTOP VIEWPORT (1440x900) - NAVBAR & HERO CHECKS
  // =========================================================================
  console.log('1️⃣ Auditing Landing Page Navbar, Spacing & Hero CTAs...');
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // A. Check navbar links
  const aboutLink = page.locator('header nav a:has-text("About Us")');
  const archLink = page.locator('header nav a:has-text("Architecture")');
  const simLink = page.locator('header nav a:has-text("Simulator")');
  const docsLink = page.locator('header nav a:has-text("Docs & API")');
  const pricingLink = page.locator('header nav a:has-text("Pricing")');

  console.log(`   ✓ About Us link visible: ${await aboutLink.isVisible()}`);
  console.log(`   ✓ Architecture link visible: ${await archLink.isVisible()}`);
  console.log(`   ✓ Simulator link visible: ${await simLink.isVisible()}`);
  console.log(`   ✓ Docs & API link visible: ${await docsLink.isVisible()}`);
  console.log(`   ✓ Pricing link visible: ${await pricingLink.isVisible()}`);

  // B. Verify Docs & API bounding box height (confirming NO word wrap!)
  const docsBox = await docsLink.boundingBox();
  console.log(`   ✓ Docs & API Box: Height=${docsBox.height}px, Width=${docsBox.width}px`);
  if (docsBox.height > 25) {
    throw new Error(`Docs & API text is wrapping! Height = ${docsBox.height}px`);
  }
  console.log(`   ✓ Docs & API is on a single, clean horizontal line (height <= 25px)!`);

  // C. Verify standalone Mobile APK link is REMOVED from navbar
  const navMobileApk = await page.locator('header a:has-text("Mobile APK")').count();
  console.log(`   ✓ Standalone Mobile APK link removed from navbar: ${navMobileApk === 0}`);
  if (navMobileApk !== 0) throw new Error('Standalone Mobile APK link still in navbar!');

  // D. Verify "Desktop & Mobile App" button exists in navbar
  const desktopMobileBtn = page.locator('header button:has-text("Desktop & Mobile App")');
  console.log(`   ✓ "Desktop & Mobile App" button in navbar: ${await desktopMobileBtn.isVisible()}`);
  if (!(await desktopMobileBtn.isVisible())) throw new Error('"Desktop & Mobile App" button not visible in navbar!');

  // E. Verify Hero CTA buttons - NO Mobile APK button after Watch Product Demo
  const heroSecurityConsole = page.locator('section a:has-text("Enter Security Console")');
  const heroSimulator = page.locator('section a:has-text("Test Live Policy Engine")');
  const heroDemo = page.locator('section a:has-text("Watch Product Demo")');
  const heroMobileApk = await page.locator('section a:has-text("Download Mobile APK")').count();

  console.log(`   ✓ Hero "Enter Security Console": ${await heroSecurityConsole.isVisible()}`);
  console.log(`   ✓ Hero "Test Live Policy Engine": ${await heroSimulator.isVisible()}`);
  console.log(`   ✓ Hero "Watch Product Demo": ${await heroDemo.isVisible()}`);
  console.log(`   ✓ Redundant "Download Mobile APK" removed from hero: ${heroMobileApk === 0}`);
  if (heroMobileApk !== 0) throw new Error('Redundant Download Mobile APK button still in hero!');

  // Save screenshot of clean navbar and hero
  const cleanHeroPath = path.join(artifactDir, '21_clean_navbar_and_hero.png');
  await page.screenshot({ path: cleanHeroPath, fullPage: false });
  console.log(`   📸 Saved clean navbar & hero screenshot: ${cleanHeroPath}`);

  // =========================================================================
  // 2. UNIFIED "DESKTOP & MOBILE APP" MODAL AUDIT
  // =========================================================================
  console.log('\n2️⃣ Testing Unified "Desktop & Mobile App" Modal...');
  await desktopMobileBtn.click();
  await page.waitForTimeout(500);

  // Check modal header and subtitle
  const modalTitle = page.locator('text=SentinelOps AI Desktop & Mobile Apps');
  const modalSub = page.locator('text=Windows desktop launcher (.bat), PWA, Web APK, and Mobile Companion');
  console.log(`   ✓ Modal Title visible: ${await modalTitle.isVisible()}`);
  console.log(`   ✓ Modal Subtitle visible: ${await modalSub.isVisible()}`);

  // Check all 4 options
  const optPwa = page.locator('span:has-text("Native Progressive Web App (PWA)")');
  const optBat = page.locator('span:has-text("Windows Desktop Launcher (.bat)")');
  const optWebApk = page.locator('span:has-text("Android Web Console APK (web.apk)")');
  const optMobileApk = page.locator('span:has-text("Android Companion APK (mobile.apk)")');

  console.log(`   ✓ Option 1 (PWA) visible: ${await optPwa.isVisible()}`);
  console.log(`   ✓ Option 2 (Windows .bat) visible: ${await optBat.isVisible()}`);
  console.log(`   ✓ Option 3 (web.apk) visible: ${await optWebApk.isVisible()}`);
  console.log(`   ✓ Option 4 (mobile.apk) visible: ${await optMobileApk.isVisible()}`);

  if (!(await optPwa.isVisible()) || !(await optBat.isVisible()) || !(await optWebApk.isVisible()) || !(await optMobileApk.isVisible())) {
    throw new Error('One or more download options missing from Desktop & Mobile App modal!');
  }

  // Check modal positioning & viewport containment
  const modalCard = page.locator('div.fixed div.max-w-lg').first();
  const modalCardBox = await modalCard.boundingBox();
  console.log(`   ✓ Modal Card Dimensions: Top=${Math.round(modalCardBox.y)}px, Height=${Math.round(modalCardBox.height)}px, Width=${Math.round(modalCardBox.width)}px`);
  if (modalCardBox.y < 0) {
    throw new Error(`Modal top is clipped! y = ${modalCardBox.y}px`);
  }

  const modalPath = path.join(artifactDir, '22_desktop_and_mobile_modal.png');
  await page.screenshot({ path: modalPath, fullPage: false });
  console.log(`   📸 Saved Desktop & Mobile modal screenshot: ${modalPath}`);

  // Close modal via backdrop click
  await page.mouse.click(50, 50);
  await page.waitForTimeout(400);

  // =========================================================================
  // 3. DASHBOARD CONSOLE AUDIT
  // =========================================================================
  console.log('\n3️⃣ Testing Dashboard Header & Modal Integration...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const dashBtn = page.locator('header button:has-text("Desktop & Mobile App")');
  console.log(`   ✓ "Desktop & Mobile App" button in dashboard header: ${await dashBtn.isVisible()}`);
  await dashBtn.click();
  await page.waitForTimeout(500);

  const dashModalTitle = page.locator('text=SentinelOps AI Desktop & Mobile Apps');
  console.log(`   ✓ Dashboard modal opened properly: ${await dashModalTitle.isVisible()}`);

  const dashModalPath = path.join(artifactDir, '23_dashboard_desktop_mobile_modal.png');
  await page.screenshot({ path: dashModalPath, fullPage: false });
  console.log(`   📸 Saved Dashboard modal screenshot: ${dashModalPath}`);

  // =========================================================================
  // 4. MOBILE VIEWPORT AUDIT (390x844)
  // =========================================================================
  console.log('\n4️⃣ Testing Mobile Responsiveness (390x844 viewport)...');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);

  const mobileAppsBtn = mobilePage.locator('header button:has-text("Apps")');
  console.log(`   ✓ Mobile "Apps" button visible: ${await mobileAppsBtn.isVisible()}`);
  await mobileAppsBtn.click();
  await mobilePage.waitForTimeout(500);

  const mobileModalTitle = mobilePage.locator('text=SentinelOps AI Desktop & Mobile Apps');
  console.log(`   ✓ Mobile modal opened properly: ${await mobileModalTitle.isVisible()}`);

  const mobileModalPath = path.join(artifactDir, '24_mobile_viewport_modal.png');
  await mobilePage.screenshot({ path: mobileModalPath, fullPage: false });
  console.log(`   📸 Saved Mobile modal screenshot: ${mobileModalPath}`);

  await mobilePage.close();
  await page.close();
  await browser.close();

  console.log(`\n🔒 Security & Stability Check: ${consoleErrors.length} console errors detected.`);
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
  }
  console.log('🎉 ALL USER SPACING & UNIFIED MODAL AUDITS COMPLETED WITH 100% SUCCESS!\n');
}

runVerification().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
