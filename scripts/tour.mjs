// 主要画面を順にたどって撮る（devnet に接続した開発サーバーを想定: npm run devnet と npm run dev:chain）。
// Usage: node scripts/tour.mjs <baseUrl> <outDir>
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const [base = 'http://127.0.0.1:5174/', outDir = 'docs/redesign/screenshots/after'] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });

const SHRINES = {
  'kasuga-taisha': [34.6812, 135.8484],
  'izumo-taisha': [35.402, 132.6855],
  'ise-naiku': [34.4551, 136.7258],
  'fushimi-inari': [34.9671, 135.7727],
  'itsukushima-jinja': [34.2959, 132.3199],
};
const near = (id) => ({ latitude: SHRINES[id][0] - 0.0005, longitude: SHRINES[id][1] });

const browser = await chromium.launch();
const errors = [];
const noon = new Date('2026-10-24T12:00:00+09:00');
const phone = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

async function open(opts = {}) {
  const ctx = await browser.newContext({ locale: 'ja-JP', ...phone, ...opts });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  await page.clock.setFixedTime(noon);
  return { ctx, page };
}
const shotOf = (page) => async (name, full = false) => {
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: full });
};
const goOf = (page) => async (hash) => {
  await page.goto(`${base}${hash}`);
  await page.waitForLoadState('networkidle');
};

// ── 1台目：初回 → 5社に参拝 → 神社を育てる ──
const { ctx, page } = await open({ geolocation: near('kasuga-taisha'), permissions: ['geolocation'] });
const shot = shotOf(page);
const go = goOf(page);

await go('#/');
await shot('after-01-first-run');

await go('#/places');
await page.getByRole('button', { name: '位置情報で近い順にする' }).click();
await page.waitForSelector('text=現在地から近い順に並べています');
await shot('after-02-places-near');
await page.locator('.list-item').first().click();
await shot('after-03-place-detail', true);
await page.getByRole('button', { name: 'ここで参拝する' }).click();
await page.getByRole('button', { name: '位置を確かめる' }).click();
await page.waitForSelector('text=境内付近です');
await shot('after-04-arrive');
await page.getByRole('button', { name: '参拝する' }).click();
await shot('after-05-worship');
await page.getByRole('button', { name: '参拝した' }).click();
await page.waitForSelector('text=参拝をチェーンに記録しますか？');
await shot('after-06-result-consent', true);
await page.getByRole('button', { name: '記録する', exact: true }).click();
await page.waitForSelector('text=トランザクション', { timeout: 30000 });
await page.getByRole('radio', { name: '工事・修復中' }).check();
await page.getByLabel('ひとこと（任意）').fill('本殿の屋根を修復中。参道は通れます。');
await page.getByRole('button', { name: '様子を報告する' }).click();
await page
  .locator('#report-title')
  .locator('..')
  .getByText('チェーンに記録済み')
  .waitFor({ timeout: 30000 })
  .catch(async (e) => {
    await shot('ERR-report', true);
    console.log(await page.locator('#report-title').locator('..').innerText());
    throw e;
  });
await shot('after-07-result-recorded', true);
await page.getByRole('button', { name: '自分の神社に置く' }).click();
await shot('after-08-home-first-parts');

async function placeAt(part, x, y) {
  const item = page.locator('.tray__item', { hasText: part }).first();
  if (!(await item.count())) return false;
  if ((await item.getAttribute('aria-pressed')) !== 'true') await item.click();
  await page.getByRole('button', { name: new RegExp(`（${x}, ${y}）$`) }).click();
  return true;
}
await placeAt('玉砂利の参道', 0, 1);
await page.locator('.tray__item', { hasText: '鹿' }).click();
await shot('after-09-home-placing');
await page.getByRole('button', { name: /（-1, 1）$/ }).click();

// ほかの4社
for (const id of ['izumo-taisha', 'ise-naiku', 'fushimi-inari', 'itsukushima-jinja']) {
  await ctx.setGeolocation(near(id));
  await go(`#/arrive/${id}`);
  await page.getByRole('button', { name: '位置を確かめる' }).click();
  await page.waitForSelector('text=境内付近です');
  await page.getByRole('button', { name: '参拝する' }).click();
  await page.getByRole('button', { name: '参拝した' }).click();
  await page.waitForSelector('text=トランザクション', { timeout: 30000 });
  if (id === 'izumo-taisha') await shot('after-10-result-grew', true);
}
await go('#/');
const layout = [
  ['玉砂利の参道', 0, 2], ['玉砂利の参道', 0, 3], ['両部鳥居', 0, 4],
  ['狐の像', 1, 1], ['石灯籠', -1, 2], ['玉砂利の参道', 1, 0], ['玉砂利の参道', -1, 0],
  ['大社造の社殿', -2, 0], ['神明造の社殿', 2, 0], ['注連縄', 0, -1], ['神明鳥居', 0, 5],
  ['玉砂利の参道', 1, 2], ['玉砂利の参道', -1, 3],
];
for (const [part, x, y] of layout) await placeAt(part, x, y).catch(() => {});
for (const leftover of ['御神木', '手水舎', '絵馬掛け', '摂社・末社', '狛犬（阿吽）', '流造の社殿']) {
  await placeAt(leftover, 2, 1).catch(() => {}) || (await placeAt(leftover, -2, 1).catch(() => {}));
}
const stop = page.getByRole('button', { name: '選ぶのをやめる' });
if (await stop.count()) await stop.click();
console.log('tray:', (await page.locator('.tray__item').allInnerTexts()).map((t) => t.replace(/\n/g, '')).join(' / '));
await page.getByRole('button', { name: /^本殿/ }).click();
console.log('honden choices:', (await page.getByRole('dialog').locator('.btn').allInnerTexts()).join(' / '));
const kasugaStyle = page.getByRole('dialog').getByRole('button', { name: '春日造の社殿' });
if (await kasugaStyle.count()) await kasugaStyle.click();
await page.getByRole('dialog').getByRole('button', { name: '閉じる' }).click();
await page.evaluate(() => window.scrollTo(0, 0));
await shot('after-11-home-built', true);

await go('#/map');
await page.waitForTimeout(5000);
await shot('after-12-map');
await page.locator('path.leaflet-interactive').nth(0).click({ force: true }).catch(() => {});
await page.waitForTimeout(500);
await shot('after-13-map-selected', true);
await go('#/visits');
await shot('after-14-visits');
await go('#/settings');
await shot('after-15-settings', true);
await go('#/guide/style-kasuga');
await shot('after-16-part-origin', true);
await go('#/places');
await page.getByRole('button', { name: '神社を加える' }).first().click();
await shot('after-17-add-place');

const state = await ctx.storageState();
await ctx.close();

// ── 失敗のとき ──
{
  const { ctx: c, page: p } = await open({ permissions: [] });
  const s = shotOf(p);
  await goOf(p)('#/arrive/meiji-jingu');
  await p.getByRole('button', { name: '位置を確かめる' }).click();
  await p.waitForSelector('text=位置情報の利用が許可されませんでした');
  await s('after-18-location-denied');
  await c.close();
}
{
  const { ctx: c, page: p } = await open({ geolocation: { latitude: 34.6937, longitude: 135.5023 }, permissions: ['geolocation'] });
  await goOf(p)('#/arrive/meiji-jingu');
  await p.getByRole('button', { name: '位置を確かめる' }).click();
  await p.waitForSelector('text=離れているようです');
  await shotOf(p)('after-19-location-far');
  await c.close();
}
{
  const { ctx: c, page: p } = await open();
  await p.addInitScript(() => {
    if (!sessionStorage.getItem('x')) {
      localStorage.setItem('8000000.shrine.v1', '{bad');
      sessionStorage.setItem('x', '1');
    }
  });
  await goOf(p)('#/');
  await shotOf(p)('after-20-corrupt-recovered');
  await c.close();
}

// ── ダーク・PC（同じデータで） ──
{
  const { ctx: c, page: p } = await open({ colorScheme: 'dark', storageState: state });
  await goOf(p)('#/');
  await shotOf(p)('after-21-dark-home', true);
  await goOf(p)(`#/visits`);
  await p.locator('.list-item').first().click();
  await shotOf(p)('after-22-dark-result', true);
  await c.close();
}
{
  const c = await browser.newContext({ locale: 'ja-JP', viewport: { width: 1280, height: 860 }, storageState: state });
  const p = await c.newPage();
  await p.clock.setFixedTime(noon);
  await goOf(p)('#/');
  await shotOf(p)('after-23-desktop-home');
  await goOf(p)('#/map');
  await p.waitForTimeout(5000);
  await shotOf(p)('after-24-desktop-map');
  await goOf(p)('#/places/izumo-taisha');
  await shotOf(p)('after-25-desktop-place');
  await c.close();
}

await browser.close();
console.log(errors.length ? `page errors:\n${errors.join('\n')}` : 'no page errors');
