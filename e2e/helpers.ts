import { expect, type Page } from '@playwright/test';

export const KEY = 'yaoyorozu.notebook.v1';

/** 時刻を昼に固定する（夜間の注意表示でテストが揺れないように） */
export async function atNoon(page: Page) {
  await page.clock.setFixedTime(new Date('2026-10-24T12:00:00+09:00'));
}

export async function readNotebook(page: Page) {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? 'null'), KEY);
}

/** 稽古を最後まで答える。正解を選べたかどうかは問わない */
export async function answerAll(page: Page) {
  for (let i = 0; i < 10; i++) {
    const options = page.locator('.quiz-option');
    if ((await options.count()) === 0) break;
    await options.first().click();
    await expect(page.getByRole('status').filter({ hasText: '正解' })).toBeVisible();
    const next = page.getByRole('button', { name: /^(次へ|結果を見る)$/ });
    const last = (await next.textContent()) === '結果を見る';
    await next.click();
    if (last) break;
  }
  await expect(page.getByText('稽古おわり')).toBeVisible();
}

/** 横スクロールが出ていないこと */
export async function expectNoHorizontalScroll(page: Page) {
  const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  expect(sw).toBeLessThanOrEqual(iw);
}
