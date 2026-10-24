import { expect, type BrowserContext, type Page } from '@playwright/test';

export const KEY = '8000000.shrine.v1';

export const COORDS = {
  kasuga: { latitude: 34.6806, longitude: 135.8484 },
  meiji: { latitude: 35.6758, longitude: 139.699 },
  hie: { latitude: 35.6741, longitude: 139.7397 },
  izumo: { latitude: 35.4016, longitude: 132.6851 },
  osaka: { latitude: 34.6937, longitude: 135.5023 },
};

/** 時刻を日本時間の昼に固定する（夜間の注意表示で揺れないように） */
export async function atNoon(page: Page) {
  await page.clock.setFixedTime(new Date('2026-10-24T12:00:00+09:00'));
}

export async function at(context: BrowserContext, where: keyof typeof COORDS) {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation(COORDS[where]);
}

export async function readGame(page: Page) {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null'), KEY);
}

/** 神社のページから、位置を確かめて参拝し、結果画面まで進む */
export async function worship(page: Page, placeId: string, opts: { demo?: boolean } = {}) {
  await page.goto(`./#/arrive/${placeId}`);
  await page.getByRole('button', { name: opts.demo ? /模擬位置（デモ）で確かめる/ : '位置を確かめる' }).click();
  await expect(page.getByText(/境内付近です/)).toBeVisible();
  await page.getByRole('button', { name: '参拝する' }).click();
  await page.getByRole('button', { name: '参拝した' }).click();
  await expect(page.getByRole('heading', { name: '受け取った部品' })).toBeVisible();
}

/** 手元の部品を選んで、指定のマスに置く */
export async function placePart(page: Page, part: string, x: number, y: number) {
  const item = page.locator('.tray__item', { hasText: part });
  if ((await item.getAttribute('aria-pressed')) !== 'true') await item.click();
  await page.getByRole('button', { name: new RegExp(`（${x}, ${y}）$`) }).click();
}

export async function expectNoHorizontalScroll(page: Page) {
  const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  expect(sw).toBeLessThanOrEqual(iw);
}
