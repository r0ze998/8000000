// 改修後の主要画面を撮る。Usage: node scripts/capture-after.mjs <baseUrl> <outDir>
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const [base = 'http://127.0.0.1:5173/', outDir = 'docs/redesign/screenshots/after'] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const noon = new Date('2026-10-24T12:00:00+09:00');

async function phone(scheme = 'light', extra = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    locale: 'ja-JP',
    colorScheme: scheme,
    ...extra,
  });
  const page = await ctx.newPage();
  await page.clock.setFixedTime(noon);
  return page;
}
const shot = async (page, name, full = false) => {
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: full });
};
const go = async (page, hash) => {
  await page.goto(`${base}${hash}`);
  await page.waitForLoadState('networkidle');
};

// ── 初回〜稽古 ──
let p = await phone();
await go(p, '#/');
await shot(p, 'after-01-first-run');
await p.getByRole('link', { name: /鳥居を見分けてみる/ }).click();
await shot(p, 'after-02-drill-question');
await p.locator('.quiz-option').first().click();
await shot(p, 'after-03-drill-feedback');
for (let i = 0; i < 5; i++) {
  const next = p.getByRole('button', { name: /^(次へ|結果を見る)$/ });
  if (!(await next.count())) {
    const opt = p.locator('.quiz-option').first();
    if (await opt.count()) await opt.click();
    continue;
  }
  await next.click();
  const opt = p.locator('.quiz-option').first();
  if (await opt.count()) await opt.click();
}
await p.waitForSelector('text=稽古おわり');
for (const b of await p.getByRole('button', { name: '選ぶ' }).all()) await b.click().catch(() => {});
await shot(p, 'after-04-drill-result');
await p.getByRole('link', { name: 'はじめる' }).click();
for (const id of ['shinshi-shika', 'komainu-aun']) {
  await go(p, `#/guide/${id}`);
  const pin = p.getByRole('button', { name: '探し物に加える' });
  if (await pin.count()) await pin.click();
}
await go(p, '#/');
await shot(p, 'after-05-home-returning');

// ── デモで境内の記録 ──
await go(p, '#/settings');
await p.getByRole('checkbox').check();
await go(p, '#/places');
await p.getByRole('button', { name: '位置情報で近い順にする' }).click();
await p.waitForSelector('text=模擬位置（デモ）で並べています');
await shot(p, 'after-06-places-near');
await go(p, '#/places/kasuga-taisha');
await shot(p, 'after-07-place-detail', true);
await p.getByRole('button', { name: 'ここで記録を始める' }).click();
await p.getByRole('button', { name: /模擬位置（デモ）で確かめる/ }).click();
await p.waitForSelector('text=境内付近です');
await shot(p, 'after-08-arrive');
await p.getByRole('button', { name: '記録を始める' }).click();
const kasuga = p.locator('.find', { hasText: '春日造' });
await kasuga.getByRole('button', { name: '見つけた' }).click();
await kasuga.getByRole('textbox').fill('朱の柱と白い壁');
await p.locator('.find', { hasText: '石灯籠' }).getByRole('button', { name: '見つけた' }).click();
await p.evaluate(() => window.scrollTo(0, 0));
await shot(p, 'after-09-visit');
await p.getByRole('button', { name: '参拝の作法' }).click();
await shot(p, 'after-10-etiquette-sheet');
await p.getByRole('dialog').getByRole('button', { name: '閉じる' }).click();
await p.getByRole('button', { name: /帳面に綴じる/ }).click();
await shot(p, 'after-11-close-sheet');
await p.getByRole('dialog').getByRole('button', { name: '綴じる' }).click();
await p.waitForTimeout(700);
await shot(p, 'after-12-page-stamped', true);
await go(p, '#/guide');
await shot(p, 'after-13-guide');
await go(p, '#/guide/style-kasuga');
await shot(p, 'after-14-guide-entry-seen');
await go(p, '#/guide/chigi-katsuogi');
await shot(p, 'after-15-guide-entry-folk', true);
await go(p, '#/notebook');
await shot(p, 'after-16-notebook');
await go(p, '#/settings');
await shot(p, 'after-17-settings');
await p.context().close();

// ── 失敗・空の状態 ──
p = await phone('light', { permissions: [] });
await go(p, '#/arrive/meiji-jingu');
await p.getByRole('button', { name: '位置を確かめる' }).click();
await p.waitForSelector('text=位置情報の利用が許可されませんでした');
await shot(p, 'after-18-location-denied');
await go(p, '#/notebook');
await shot(p, 'after-19-notebook-empty');
await p.context().close();

p = await phone('light', { geolocation: { latitude: 34.6937, longitude: 135.5023 }, permissions: ['geolocation'] });
await go(p, '#/arrive/meiji-jingu');
await p.getByRole('button', { name: '位置を確かめる' }).click();
await p.waitForSelector('text=離れているようです');
await shot(p, 'after-20-location-far');
await p.context().close();

p = await phone();
await p.addInitScript(() => {
  if (!sessionStorage.getItem('x')) {
    localStorage.setItem('yaoyorozu.notebook.v1', '{bad');
    sessionStorage.setItem('x', '1');
  }
});
await go(p, '#/');
await shot(p, 'after-21-corrupt-recovered');
await p.context().close();

// ── ダーク ──
p = await phone('dark');
await go(p, '#/');
await shot(p, 'after-22-dark-first-run');
await go(p, '#/guide/torii-myojin');
await shot(p, 'after-23-dark-guide-entry');
await go(p, '#/drill?group=style');
await shot(p, 'after-24-dark-drill');
await p.context().close();

// ── PC ──
const desk = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'ja-JP' });
p = await desk.newPage();
await p.clock.setFixedTime(noon);
await go(p, '#/');
await shot(p, 'after-25-desktop-home');
await go(p, '#/guide');
await shot(p, 'after-26-desktop-guide');
await go(p, '#/places/izumo-taisha');
await shot(p, 'after-27-desktop-place');
await desk.close();

await browser.close();
console.log('saved to', outDir);
