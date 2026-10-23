// 公開URLが実際に描画されるかを確かめる。Usage: node scripts/smoke.mjs <url> [<url> ...]
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
let failed = 0;
for (const url of process.argv.slice(2)) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, locale: 'ja-JP' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    const hero = await page.getByRole('heading', { name: /境内は、見分けられると/ }).isVisible();
    await page.goto(`${url.replace(/\/$/, '')}/#/guide/torii-myojin`, { waitUntil: 'networkidle' });
    const entry = await page.getByRole('heading', { name: '明神鳥居', level: 2 }).isVisible();
    const ok = hero && entry && errors.length === 0;
    if (!ok) failed++;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${url} hero=${hero} deepLink=${entry} title="${await page.title()}" errors=${errors.length}`);
  } catch (e) {
    failed++;
    console.log(`FAIL ${url} ${e.message.split('\n')[0]}`);
  }
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
