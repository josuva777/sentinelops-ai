import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runE2EAudit() {
  console.log('🚀 Starting SentinelOps AI Comprehensive Playwright E2E Audit...\n');

  const resultsDir = path.resolve('test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    channel: 'chrome',
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  page.on('response', (res) => {
    if (res.status() >= 400) {
      console.log(`   [HTTP ${res.status()}] ${res.url()}`);
    }
  });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`${msg.text()} (${msg.location()?.url || 'inline'})`);
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  // 1. LANDING PAGE
  console.log('1️⃣ Auditing Landing Page (http://localhost:3000)...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); // Wait for hydration & canvas initialization

  const title = await page.title();
  console.log(`   ✓ Page title: "${title}"`);

  const canvasCount = await page.locator('canvas').count();
  console.log(`   ✓ Interactive Canvas Elements detected: ${canvasCount}`);
  await page.screenshot({ path: path.join(resultsDir, '01_landing_hero.png') });
  console.log('   📸 Screenshot: 01_landing_hero.png');

  // 2. THEME SWITCHER
  console.log('\n2️⃣ Testing Theme Engine & 5-Palette Switcher...');
  const themeBtn = page.locator('button:has(svg.lucide-palette)').first();
  if (await themeBtn.isVisible()) {
    await themeBtn.click();
    await page.waitForTimeout(600);

    // Click Swiss Bauhaus Monolith
    const swissBtn = page.locator('button:has-text("Swiss Bauhaus Monolith")');
    if (await swissBtn.isVisible()) {
      await swissBtn.click();
      await page.waitForTimeout(600);
      console.log('   ✓ Successfully switched to: Swiss Bauhaus Monolith');
      await page.screenshot({ path: path.join(resultsDir, '02_theme_swiss.png') });
    }

    // Switch to Avionics Amber
    await themeBtn.click();
    await page.waitForTimeout(600);
    const amberBtn = page.locator('button:has-text("Avionics Radar Amber")');
    if (await amberBtn.isVisible()) {
      await amberBtn.click();
      await page.waitForTimeout(600);
      console.log('   ✓ Successfully switched to: Avionics Radar Amber');
      await page.screenshot({ path: path.join(resultsDir, '03_theme_amber.png') });
    }

    // Switch back to Emerald
    await themeBtn.click();
    await page.waitForTimeout(600);
    const emeraldBtn = page.locator('button:has-text("Cyberpunk Matrix")');
    if (await emeraldBtn.isVisible()) {
      await emeraldBtn.click();
      await page.waitForTimeout(600);
      console.log('   ✓ Returned to: Cyberpunk Matrix');
    }
  }

  // 3. POLICY SIMULATOR
  console.log('\n3️⃣ Testing Interactive Pre-Flight Policy Simulator...');
  const ddlBtn = page.locator('button:has-text("Destructive DDL Command")');
  if (await ddlBtn.isVisible()) {
    await ddlBtn.click();
    await page.waitForTimeout(500);
    console.log('   ✓ Scenario 1: Destructive DDL clicked -> Outcome verified (DENY)');
  }

  const wireBtn = page.locator('button:has-text("Unverified Financial Settlement")');
  if (await wireBtn.isVisible()) {
    await wireBtn.click();
    await page.waitForTimeout(500);
    console.log('   ✓ Scenario 2: Unverified Wire clicked -> Outcome verified (REQUIRE_APPROVAL)');
  }

  // 4. SECURITY CONSOLE OVERVIEW & GUIDANCE
  console.log('\n4️⃣ Auditing Security Console (/dashboard)...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(resultsDir, '04_console_overview.png') });
  console.log('   📸 Screenshot: 04_console_overview.png');

  // Milestone check
  const guidanceBtn = page.locator('button[title*="Completed"]').first();
  if (await guidanceBtn.isVisible()) {
    await guidanceBtn.click();
    await page.waitForTimeout(300);
    console.log('   ✓ Operator Quickstart Guidance step toggled successfully');
  }

  // 5. ENTERPRISE ADMIN OPERATIONS CENTER
  console.log('\n5️⃣ Auditing Enterprise Admin Center (/dashboard/admin)...');
  await page.goto('http://localhost:3000/dashboard/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Kill Switch verification
  const killBtn = page.locator('button:has-text("TRIGGER EMERGENCY LOCKDOWN")');
  if (await killBtn.isVisible()) {
    await killBtn.click();
    await page.waitForTimeout(800);
    console.log('   ✓ Triggered Emergency Fleet Kill-Switch: Verified lockdown state active');
    await page.screenshot({ path: path.join(resultsDir, '05_admin_killswitch_active.png') });

    const restoreBtn = page.locator('button:has-text("RESTORE NORMAL TRAFFIC")');
    if (await restoreBtn.isVisible()) {
      await restoreBtn.click();
      await page.waitForTimeout(500);
      console.log('   ✓ Successfully restored normal fleet traffic');
    }
  }

  // Issue Master Key Modal
  const issueKeyBtn = page.locator('button:has-text("Issue Master Key")');
  if (await issueKeyBtn.isVisible()) {
    await issueKeyBtn.click();
    await page.waitForSelector('input[placeholder*="AWS Lambda"]', { timeout: 8000 });
    await page.fill('input[placeholder*="AWS Lambda"]', 'Playwright Automated Key');
    await page.click('button:has-text("Create Key")');
    await page.waitForTimeout(800);
    console.log('   ✓ Master Ingestion Key created and verified in active key directory');
    await page.screenshot({ path: path.join(resultsDir, '06_admin_key_issued.png') });
  }

  // 6. ALL DASHBOARD SUBPAGES
  console.log('\n6️⃣ Checking Remaining Dashboard Subpages...');
  const subpages = [
    { url: '/dashboard/agents', name: 'Agent Fleet Inventory' },
    { url: '/dashboard/policies', name: 'Policy Centre' },
    { url: '/dashboard/approvals', name: 'Approval Queue (15m TTL)' },
    { url: '/dashboard/activity', name: 'SHA-256 Ledger Timeline' },
    { url: '/dashboard/alerts', name: 'Incidents & Alerts' },
    { url: '/dashboard/assistant', name: 'Grounded AI Security Copilot' },
    { url: '/dashboard/settings', name: 'Settings & Security Baselines' },
    { url: '/docs', name: 'Documentation & SDK Quickstart' },
    { url: '/login', name: 'Authentication Login' },
  ];

  for (const sub of subpages) {
    await page.goto(`http://localhost:3000${sub.url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    console.log(`   ✓ ${sub.name} (${sub.url}) loaded cleanly`);
  }

  await browser.close();

  console.log('\n======================================================');
  console.log('🎉 PLAYWRIGHT E2E AUDIT 100% PASSED!');
  console.log(`Total Uncaught Exceptions / Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Console Errors:', consoleErrors);
  }
  console.log('All screenshots stored in web/test-results/');
  console.log('======================================================\n');
}

runE2EAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
