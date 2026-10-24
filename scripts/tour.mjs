// 主要画面を順にたどって撮る（devnet 接続のビルドを想定）。
// Usage: node scripts/tour.mjs <baseUrl> <outDir> [--dark] [--desktop]
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const [base = 'http://127.0.0.1:5174/', outDir = 'docs/redesign/screenshots/after'] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const dark = process.argv.includes('--dark');
const desktop = process.argv.includes('--desktop');
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  ...(desktop
    ? { viewport: { width: 1280, height: 860 } }
    : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }),
  locale: 'ja-JP',
  colorScheme: dark ? 'dark' : 'light',
  geolocation: { latitude: 34.6806, longitude: 135.8484 }, // 春日大社の近く
  permissions: ['geolocation'],
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.clock.setFixedTime(new Date('2026-10-24T12:00:00+09:00'));
const prefix = `${desktop ? 'pc' : 'sp'}${dark ? '-dark' : ''}`;
const shot = async (name, full = false) => {
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/${prefix}-${name}.png`, fullPage: full });
};
const go = async (hash) => {
  await page.goto(`${base}${hash}`);
  await page.waitForLoadState('networkidle');
};

await go('#/');
await shot('01-home-first');

// 春日大社で参拝（本物の位置情報＝ブラウザの位置）
await go('#/places');
await page.getByRole('button', { name: '位置情報で近い順にする' }).click();
await page.waitForSelector('text=現在地から近い順に並べています');
await shot('02-places-near');
await page.locator('.list-item').first().click();
await shot('03-place-detail', true);
await page.getByRole('button', { name: 'ここで参拝する' }).click();
await page.getByRole('button', { name: '位置を確かめる' }).click();
await page.waitForSelector('text=境内付近です');
await shot('04-arrive');
await page.getByRole('button', { name: '参拝する' }).click();
await shot('05-worship');
await page.getByRole('button', { name: '参拝した' }).click();
await page.waitForSelector('text=参拝をチェーンに記録しますか？');
await shot('06-result-consent', true);
await page.getByRole('button', { name: '記録する', exact: true }).click();
// 同意すると、参拝直後の記録は自動でチェーンに送られる
await page.waitForSelector('text=トランザクション', { timeout: 30000 }).catch(async (e) => {
  await shot('ERR-chain', true);
  console.log(await page.locator('#chain-title').locator('..').innerText());
  throw e;
});
await page.getByRole('radio', { name: '工事・修復中' }).check();
await page.getByLabel('ひとこと（任意）').fill('本殿の屋根を修復中。参道は通れます。');
await page.getByRole('button', { name: '様子を報告する' }).click();
await page.waitForTimeout(3000);
await shot('07-result-recorded', true);

// 自分の神社に置く
await page.getByRole('button', { name: '自分の神社に置く' }).click();
await page.waitForTimeout(300);
await shot('08-home-tray');
const placeAt = async (part, x, y) => {
  await page.locator('.tray__item', { hasText: part }).click();
  await page.getByRole('button', { name: new RegExp(`（${x}, ${y}）$`) }).click();
};
await placeAt('玉砂利の参道', 0, 1);
await placeAt('玉砂利の参道', 0, 2);
await placeAt('鹿', 1, 1);
await page.locator('.tray__item', { hasText: '石灯籠' }).click();
await shot('09-home-placing');
await page.getByRole('button', { name: /（-1, 1）$/ }).click();
await page.getByRole('button', { name: /本殿/ }).click();
await page.getByRole('dialog').getByRole('button', { name: '春日造の社殿' }).click();
await page.getByRole('dialog').getByRole('button', { name: '閉じる' }).click();
await shot('10-home-built', true);

await go('#/map');
await page.waitForTimeout(2500);
await shot('11-map', true);
await go('#/visits');
await shot('12-visits');
await go('#/settings');
await shot('13-settings', true);

console.log(errors.length ? `errors:\n${errors.join('\n')}` : 'no page errors');
await browser.close();
