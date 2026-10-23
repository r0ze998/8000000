// Captures screenshots of the pre-redesign app (main @ 3d79900) for the before/after record.
// Usage: node scripts/capture-before.mjs <blankBuildUrl> <mountedBuildUrl> <outDir>
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const [blankUrl, mountedUrl, outDir] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'ja-JP' });
const page = await phone.newPage();
const shot = (name) => page.screenshot({ path: `${outDir}/${name}.png` });

// 1. The build as shipped from main renders nothing.
await page.goto(blankUrl);
await page.waitForTimeout(1500);
await shot('before-00-main-build-blank');

// 2. The same code with src/index.ts set aside, so React mounts.
await page.goto(mountedUrl);
await page.waitForTimeout(1500);
await shot('before-01-onboarding');
for (let i = 0; i < 4; i++) {
  const next = page.locator('.next-button');
  if (await next.isDisabled()) await page.waitForTimeout(1500);
  await next.click();
  await page.waitForTimeout(400);
}
await page.waitForTimeout(800);
await shot('before-02-worship-home');
await page.screenshot({ path: `${outDir}/before-02b-worship-home-full.png`, fullPage: true });

const tabs = page.locator('.tab-button');
await tabs.nth(1).click(); await page.waitForTimeout(800); await shot('before-03-explore');
await tabs.nth(2).click(); await page.waitForTimeout(800); await shot('before-04-myshrine');
await tabs.nth(3).click(); await page.waitForTimeout(800); await shot('before-05-profile');

await tabs.nth(0).click(); await page.waitForTimeout(500);
await page.getByText('祈りを捧げる').first().click().catch(() => {});
await page.waitForTimeout(800);
await shot('before-06-prayer-select');

const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'ja-JP' });
const dpage = await desktop.newPage();
await dpage.goto(mountedUrl);
await dpage.evaluate(() => { localStorage.setItem('hasCompletedOnboarding', 'true'); });
await dpage.reload();
await dpage.waitForTimeout(1500);
await dpage.screenshot({ path: `${outDir}/before-07-desktop.png` });

await browser.close();
console.log('saved to', outDir);
