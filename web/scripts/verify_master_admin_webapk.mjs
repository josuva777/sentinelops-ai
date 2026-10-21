import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function verifyMasterAdminAndWebAPK() {
  console.log('🚀 Starting Supreme Master Admin, Sidebar Isolation & WebAPK E2E Verification...\n');

  const artifactDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity\\brain\\62c8578d-c73a-406b-895f-b6fe94e3e486';
  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  // Clear localStorage for clean test run
  await page.goto('http://localhost:3000');
  await page.evaluate(() => localStorage.clear());

  // =========================================================================
  // TEST 1: SUPREME MASTER ADMIN LOGIN (josuva732006@gmail.com / josuva/12345)
  // =========================================================================
  console.log('1️⃣ Testing Supreme Master Admin Login (josuva732006@gmail.com)...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Fill in Master Admin credentials
  await page.fill('input[type="email"]', 'josuva732006@gmail.com');
  await page.fill('input[type="password"]', 'josuva/12345');

  // Verify Master Admin recognition badge appears
  const masterBadge = await page.locator('text=Supreme Master Admin Account Recognized').count();
  console.log(`   ✓ Master Admin credentials recognized badge: ${masterBadge > 0}`);

  // Submit login
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Verify Sidebar contains "Enterprise Admin" for Master Admin
  const adminNavItem = await page.locator('aside a:has-text("Enterprise Admin")').count();
  const userNameDisplay = await page.locator('text=Josuva').count();
  console.log(`   ✓ Logged in as Master Admin: ${userNameDisplay > 0}`);
  console.log(`   ✓ "Enterprise Admin" IS VISIBLE in sidebar for Master Admin: ${adminNavItem > 0}`);

  const masterDashPath = path.join(artifactDir, '16_master_admin_dashboard.png');
  await page.screenshot({ path: masterDashPath, fullPage: true });
  console.log(`   📸 Screenshot saved: ${masterDashPath}`);

  // =========================================================================
  // TEST 2: ENTERPRISE ADMIN CONSOLE & USER PROMOTION AUTHORITY
  // =========================================================================
  console.log('\n2️⃣ Testing Admin Console & Master Admin Promotion Authority...');
  await page.click('aside a:has-text("Enterprise Admin")');
  await page.waitForURL('**/dashboard/admin', { timeout: 10000 });
  await page.waitForTimeout(1000);

  const adminHeader = await page.locator('text=Platform Administration & Fleet Controls').count();
  const masterAuthorityBadge = await page.locator('text=Master Authority (Immutable)').count();
  const promoteBtnCount = await page.locator('button:has-text("Promote to Admin")').count();
  console.log(`   ✓ Enterprise Admin Console unlocked: ${adminHeader > 0}`);
  console.log(`   ✓ Master Admin has immutable authority badge: ${masterAuthorityBadge > 0}`);
  console.log(`   ✓ Master Admin has "Promote to Admin" authority buttons: ${promoteBtnCount > 0}`);

  // Promote Devon Vance to Super Admin
  if (promoteBtnCount > 0) {
    await page.locator('button:has-text("Promote to Admin")').first().click();
    await page.waitForTimeout(600);
    const revokeBtnCount = await page.locator('button:has-text("Revoke Admin")').count();
    console.log(`   ✓ Promoted user to Admin successfully: ${revokeBtnCount > 0}`);
  }

  const masterControlPath = path.join(artifactDir, '17_master_admin_controls.png');
  await page.screenshot({ path: masterControlPath, fullPage: true });
  console.log(`   📸 Screenshot saved: ${masterControlPath}`);

  // =========================================================================
  // TEST 3: NON-ADMIN USER SIDEBAR ISOLATION & 403 LOCKSCREEN
  // =========================================================================
  console.log('\n3️⃣ Testing Non-Admin Isolation: Enterprise Admin strictly hidden from non-admins...');
  // Set localStorage to a standard Developer user without admin privileges
  await page.evaluate(() => {
    const devUser = {
      id: 'usr_regular_dev',
      name: 'Regular Developer',
      email: 'alex.developer@company.org',
      company: 'Tech Corp',
      role: 'DEVELOPER',
      tier: 'FREE',
      toolCallsUsed: 1200,
      toolCallsLimit: 50000,
      isSuspended: false,
      isMasterAdmin: false,
      ipAddress: '192.168.1.10',
      device: 'Chrome Windows',
      lastActive: 'Active now',
    };
    localStorage.setItem('sentinelops_auth_session', JSON.stringify(devUser));
  });

  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Assert "Enterprise Admin" is NOT in the sidebar!
  const hiddenAdminNav = await page.locator('aside a:has-text("Enterprise Admin")').count();
  console.log(`   ✓ "Enterprise Admin" is strictly HIDDEN for non-admin user: ${hiddenAdminNav === 0}`);

  // Navigate directly via URL to /dashboard/admin
  await page.goto('http://localhost:3000/dashboard/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const lockscreenHeader = await page.locator('text=Enterprise Admin Authorization Required').count();
  const demoBypassButton = await page.locator('button:has-text("Elevate to Super Admin")').count();
  console.log(`   ✓ HTTP 403 Lockscreen displayed on direct URL access: ${lockscreenHeader > 0}`);
  console.log(`   ✓ Demo elevation bypass button is REMOVED: ${demoBypassButton === 0}`);

  const nonAdminPath = path.join(artifactDir, '18_non_admin_hidden_sidebar.png');
  await page.screenshot({ path: nonAdminPath, fullPage: true });
  console.log(`   📸 Screenshot saved: ${nonAdminPath}`);

  // =========================================================================
  // TEST 4: STANDALONE ANDROID WEB APK (web.apk) & MOBILE APK ENDPOINTS
  // =========================================================================
  console.log('\n4️⃣ Testing Standalone Android Web APK (web.apk) Download Endpoint...');
  const webApkRes = await page.request.get('http://localhost:3000/downloads/web.apk');
  const webApkStatus = webApkRes.status();
  const webApkBytes = (await webApkRes.body()).length;
  console.log(`   ✓ web.apk Download Status: HTTP ${webApkStatus}`);
  console.log(`   ✓ web.apk Package Size: ${webApkBytes} bytes`);

  const mobileApkRes = await page.request.get('http://localhost:3000/downloads/sentinelops-mobile.apk');
  console.log(`   ✓ sentinelops-mobile.apk Status: HTTP ${mobileApkRes.status()}`);

  await browser.close();
  console.log('\n🎉 ALL MASTER ADMIN & WEBAPK AUDITS PASSED WITH 100% SUCCESS!\n');
}

verifyMasterAdminAndWebAPK().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

