// ローカル devnet にデプロイしたコントラクトにつないだビルドで、DePIN の書き込みと読み出しを確かめる。
// 同じ devnet のテスト用アカウントを使うので、順番に実行する。
import { expect, test } from '@playwright/test';
import { at, atNoon, worship } from './helpers';

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  await atNoon(page);
});

test('参拝 → 同意 → 自動でチェーンに記録 → 様子を報告 → みんなの地図に出る', async ({ page, context }) => {
  await at(context, 'kasuga');
  await worship(page, 'kasuga-taisha');

  // 公開される内容を示して同意を求める
  await expect(page.getByText('参拝をチェーンに記録しますか？')).toBeVisible();
  await expect(page.getByText(/ウォレットのアドレス・神社・日付/)).toBeVisible();
  await page.getByRole('button', { name: '記録する', exact: true }).click();
  await expect(page.getByText('チェーンに記録済み').first()).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/トランザクション 0x/)).toBeVisible();

  await page.getByRole('radio', { name: '工事・修復中' }).check();
  await page.getByLabel('ひとこと（任意）').fill('本殿の屋根を修復中。参道は通れます。');
  await page.getByRole('button', { name: '様子を報告する' }).click();
  await expect(page.locator('#report-title').locator('..').getByText('チェーンに記録済み')).toBeVisible({ timeout: 30_000 });

  // 再読み込みしても記録の状態が残る
  await page.reload();
  await expect(page.getByText('チェーンに記録済み').first()).toBeVisible();

  // みんなの地図と神社のページに、チェーンから読んだ記録が出る
  await page.goto('./#/map');
  await expect(page.getByRole('heading', { name: '最近の神社の様子' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('「本殿の屋根を修復中。参道は通れます。」').first()).toBeVisible();
  await page.goto('./#/places/kasuga-taisha');
  await expect(page.getByText(/参拝 1 回・1 人/)).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/最新の様子：工事・修復中/)).toBeVisible();

  await page.goto('./#/visits');
  await expect(page.getByText(/チェーン上のあなたのアドレスの記録：参拝 1 回・1 社/)).toBeVisible({ timeout: 15_000 });
});

test('端末を変えて同じ日にもう一度参拝しても、チェーンの記録は二重にならない', async ({ page, context }) => {
  await at(context, 'kasuga');
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(() =>
    localStorage.setItem('8000000.shrine.v1', JSON.stringify({ version: 1, visits: [], settings: { chainConsent: true } })),
  );
  await page.reload();
  await worship(page, 'kasuga-taisha');
  await expect(page.getByText('今日のこの神社への参拝は、すでにこのアドレスで記録されていました。')).toBeVisible({ timeout: 20_000 });
  await page.goto('./#/places/kasuga-taisha');
  await expect(page.getByText(/参拝 1 回・1 人/)).toBeVisible({ timeout: 15_000 });
});

test('記録しない選択もでき、あとから設定で変えて送れる', async ({ page, context }) => {
  await at(context, 'meiji');
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await worship(page, 'meiji-jingu');
  await page.getByRole('button', { name: '端末だけに残す' }).click();
  await expect(page.getByText('チェーンには記録しない設定です。')).toBeVisible();
  await expect(page.getByText('端末内のみ').first()).toBeVisible();

  // 報告は、参拝がチェーンにないと公開できない
  await page.getByRole('button', { name: '様子を報告する' }).click();

  await page.goto('./#/settings');
  await page.getByRole('checkbox', { name: /参拝をチェーンに記録する/ }).check();
  await page.goto('./#/visits');
  await page.getByRole('link', { name: /明治神宮/ }).click();
  await expect(page.getByRole('button', { name: '報告をチェーンに記録する' })).toBeDisabled();
  await page.getByRole('button', { name: '参拝をチェーンに記録する' }).click();
  await expect(page.getByText(/トランザクション 0x/).first()).toBeVisible({ timeout: 30_000 });
  await expect(page.getByRole('button', { name: '報告をチェーンに記録する' })).toBeEnabled();
  await page.getByRole('button', { name: '報告をチェーンに記録する' }).click();
  await expect(page.locator('#report-title').locator('..').getByText('チェーンに記録済み')).toBeVisible({ timeout: 30_000 });
});

test('いる場所の神社を登録すると、ほかの人の地図にも出る', async ({ page, context, browser }) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 35.7101, longitude: 139.8107 });
  await page.goto('./#/places');
  await page.getByRole('button', { name: '位置情報で近い順にする' }).click();
  await expect(page.getByText('近くに登録済みの神社はありません。')).toBeVisible();
  await page.getByRole('button', { name: '神社を加える' }).click();
  await page.getByRole('dialog').getByRole('textbox').fill('押上の小さな稲荷');
  // まだ記録の同意をしていないので、まず端末に保存し、神社のページで同意して登録する
  await expect(page.getByText(/加えたあと、神社のページからチェーンに登録/)).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: '加える' }).click();
  const reg = page.locator('#reg-title').locator('..');
  await reg.getByRole('button', { name: '記録する', exact: true }).click();
  await reg.getByRole('button', { name: 'この神社をチェーンに記録する' }).click();
  await expect(reg.getByText('チェーンに記録済み')).toBeVisible({ timeout: 30_000 });

  // 別の人（まっさらなブラウザ）から見える
  const other = await browser.newContext({ locale: 'ja-JP' });
  const p2 = await other.newPage();
  await p2.goto(`${test.info().project.use.baseURL}#/places`);
  await expect(p2.getByRole('link', { name: /押上の小さな稲荷.*みんなが登録した神社/ })).toBeVisible({ timeout: 20_000 });
  await p2.getByRole('link', { name: /押上の小さな稲荷/ }).click();
  await expect(p2.getByText('ほかの参拝者が登録した神社です')).toBeVisible();
  await other.close();
});
