// チェーンの設定がないビルドで、遊びの流れ・保存・戻る・失敗時の復帰を確かめる。
import { expect, test } from '@playwright/test';
import { at, atNoon, expectNoHorizontalScroll, KEY, placePart, readGame, worship } from './helpers';

test.beforeEach(async ({ page }) => {
  await atNoon(page);
});

test('初回：デモで参拝 → 部品を受け取る → 本殿の隣から置く → 再読み込みしても残る', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: '神社に参拝すると、あなたの神社が育つ。' })).toBeVisible();
  await page.getByRole('button', { name: '神社に行かずにデモで試す' }).click();
  await expect(page.getByText('デモモード').first()).toBeVisible();
  await page.getByRole('button', { name: /模擬位置（デモ）で確かめる/ }).click();
  await page.getByRole('button', { name: '参拝する' }).click();
  await page.getByRole('button', { name: '参拝した' }).click();

  await expect(page.getByText('部品を 6 つ受け取りました')).toBeVisible();
  await expect(page.getByText('春日造の社殿')).toBeVisible();
  await expect(page.getByText('デモの参拝はチェーンに記録しません。')).toBeVisible();
  await page.getByRole('button', { name: '自分の神社に置く' }).click();

  // 本殿から離れた場所には置けない
  await page.locator('.tray__item', { hasText: '鹿' }).click();
  await page.getByRole('button', { name: /（2, 2）$/ }).click();
  await expect(page.getByText('本殿か、置いた部品の隣にしか置けません。')).toBeVisible();
  await page.getByRole('button', { name: /（0, 1）$/ }).click();
  await placePart(page, '玉砂利の参道', 1, 0);
  await placePart(page, '石灯籠', 2, 0);

  // 本殿を春日造に
  await page.getByRole('button', { name: /^本殿：小さな祠/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: '春日造の社殿' }).click();
  await page.getByRole('dialog').getByRole('button', { name: '閉じる' }).click();

  await page.reload();
  await expect(page.getByRole('button', { name: /^鹿（0, 1）$/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /^石灯籠（2, 0）$/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /^本殿：春日造の社殿/ })).toBeVisible();

  // 本殿とのつながりを切る外し方はできない
  await page.getByRole('button', { name: /^玉砂利の参道（1, 0）$/ }).click();
  await expect(page.getByText('これを外すと、本殿とつながらない部品が出てしまいます。')).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('button', { name: '手元に戻す' })).toBeDisabled();
  await page.keyboard.press('Escape');

  // デモを消すと、デモの部品とその配置も消える
  await page.goto('./#/settings');
  await page.getByRole('button', { name: /デモの参拝と部品をすべて消す（1件）/ }).click();
  const g = await readGame(page);
  expect(g.visits).toHaveLength(0);
  expect(g.placements).toHaveLength(0);
  expect(g.honden).toBe('hokora');
});

test('位置を確かめて2つの神社に参拝すると、境内が広がる', async ({ page, context }) => {
  await at(context, 'meiji');
  await worship(page, 'meiji-jingu');
  await expect(page.getByText(/位置確認済み（約\d+m）/)).toBeVisible();
  await expect(page.getByText('このアプリはいまチェーンに接続していないため、参拝はこの端末にだけ保存されます。')).toBeVisible();

  await at(context, 'hie');
  await worship(page, 'hie-jinja');
  await expect(page.getByText('境内が 7×7（村の社）に広がりました')).toBeVisible();
  await page.getByRole('button', { name: '自分の神社に置く' }).click();
  await expect(page.getByText('村の社・7×7')).toBeVisible();

  // 同じ神社は1日1回
  await page.goto('./#/arrive/hie-jinja');
  await expect(page.getByText('日枝神社には、今日もう参拝を記録しました。')).toBeVisible();

  // 座標そのものは保存しない
  expect(JSON.stringify(await readGame(page))).not.toContain('35.674');
});

test('位置情報が拒否されたら理由を示し、位置なしでも参拝できる（チェーンには送らない）', async ({ page, context }) => {
  await context.clearPermissions();
  await page.goto('./#/arrive/izumo-taisha');
  await page.getByRole('button', { name: '位置を確かめる' }).click();
  await expect(page.getByText('位置情報の利用が許可されませんでした')).toBeVisible();
  await page.getByRole('button', { name: '位置を使わずに参拝する' }).click();
  // 出雲大社の作法（四拍手）が出る
  await expect(page.getByText(/二拝四拍手一拝/)).toBeVisible();
  await page.getByRole('button', { name: '参拝した' }).click();
  await expect(page.getByText('位置未確認')).toBeVisible();
  await expect(page.getByText(/位置を確かめていない参拝は、みんなの地図の信頼性を守るため/)).toBeVisible();
});

test('神社から遠いと参拝できない', async ({ page, context }) => {
  await at(context, 'osaka');
  await page.goto('./#/arrive/meiji-jingu');
  await page.getByRole('button', { name: '位置を確かめる' }).click();
  await expect(page.getByText(/明治神宮から約\d+km離れているようです/)).toBeVisible();
  await expect(page.getByRole('button', { name: '参拝する' })).toHaveCount(0);
});

test('リストにない神社を加えて参拝できる', async ({ page }) => {
  await page.goto('./#/places');
  await page.getByPlaceholder('神社名・地名で絞り込む').fill('坂の上八幡');
  await page.getByRole('button', { name: '「坂の上八幡」を加える' }).click();
  await page.getByRole('dialog').getByRole('button', { name: '加える' }).click();
  await expect(page.getByRole('heading', { name: '坂の上八幡', level: 2 })).toBeVisible();
  await expect(page.getByText('位置を保存していないので、みんなの地図には登録できません。')).toBeVisible();
  await page.getByRole('button', { name: 'ここで参拝する' }).click();
  await page.getByRole('button', { name: '参拝する' }).click();
  await page.getByRole('button', { name: '参拝した' }).click();
  // 参道2 + その日の部品1 + 初めての神社の部品1
  await expect(page.getByText('部品を 4 つ受け取りました')).toBeVisible();
});

test('戻る操作・直リンク・存在しないページ', async ({ page }) => {
  await page.goto('./#/guide/torii-myojin');
  await expect(page.getByRole('heading', { name: '明神鳥居', level: 2 })).toBeVisible();
  await page.getByRole('button', { name: '戻る' }).click();
  await expect(page).toHaveURL(/#\/$/);

  await page.goto('./#/places');
  await page.getByRole('link', { name: /春日大社/ }).click();
  await expect(page.getByRole('heading', { name: '春日大社', level: 2 })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/#\/places$/);
  await page.goForward();
  await page.getByRole('button', { name: '戻る' }).click();
  await expect(page).toHaveURL(/#\/places$/);

  await page.goto('./#/nowhere');
  await expect(page.getByText('このページは見つかりませんでした')).toBeVisible();
  await page.goto('./#/visits/not-a-visit');
  await expect(page.getByText('この参拝の記録は見つかりませんでした')).toBeVisible();
  await page.goto('./#/places/not-a-shrine');
  await expect(page.getByText('この神社は見つかりませんでした')).toBeVisible();
});

test('保存データが壊れていたら退避して新しく始める', async ({ page }) => {
  await page.addInitScript((k) => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem(k, '{broken json');
      sessionStorage.setItem('seeded', '1');
    }
  }, KEY);
  await page.goto('./');
  await expect(page.getByText('保存データを読み込めませんでした')).toBeVisible();
  const backups = await page.evaluate(() =>
    Object.keys(localStorage)
      .filter((k) => k.startsWith('8000000.shrine.corrupt.'))
      .map((k) => localStorage.getItem(k)),
  );
  expect(backups).toEqual(['{broken json']);
});

test('保存できない環境でも警告を出して遊べる', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('QuotaExceededError');
    };
  });
  await page.goto('./');
  await expect(page.getByText('この端末に保存できません')).toBeVisible();
  await page.getByRole('button', { name: '神社に行かずにデモで試す' }).click();
  await expect(page.getByRole('button', { name: /模擬位置（デモ）で確かめる/ })).toBeVisible();
});

test('旧アプリの神社名を引き継ぎ、旧データは消さない', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('shrineName', JSON.stringify('山の上神社'));
      localStorage.setItem('shrineCanvas', '[{"x":1}]');
      sessionStorage.setItem('seeded', '1');
    }
  });
  await page.goto('./');
  await expect(page.getByRole('heading', { name: '山の上神社', level: 2 })).toBeVisible();
  expect(await page.evaluate(() => [localStorage.getItem('shrineName'), localStorage.getItem('shrineCanvas')])).toEqual(['"山の上神社"', '[{"x":1}]']);
});

test('データの書き出しと読み込み', async ({ page }) => {
  await page.goto('./#/settings');
  await page.getByRole('textbox').first().fill('秋の社');
  await page.getByRole('button', { name: '保存' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'データを書き出す（.json）' }).click();
  const download = await downloadPromise;
  const fs = await import('node:fs');
  const exported = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
  expect(exported.name).toBe('秋の社');

  await page.locator('input[type=file]').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"nope":1}') });
  await expect(page.getByText('このファイルは読み込めませんでした')).toBeVisible();

  exported.name = '読み込んだ社';
  await page.locator('input[type=file]').setInputFiles({ name: 'ok.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(exported)) });
  await page.getByRole('dialog').getByRole('button', { name: '読み込む' }).click();
  await page.goto('./');
  await expect(page.getByRole('heading', { name: '読み込んだ社', level: 2 })).toBeVisible();
});

test('チェーン未接続の地図：収録の神社は表示し、理由を伝える', async ({ page }) => {
  await page.goto('./#/map');
  await expect(page.getByText('チェーンに接続していません')).toBeVisible();
  await expect(page.locator('path.leaflet-interactive')).toHaveCount(14);
  await page.locator('path.leaflet-interactive').first().click({ force: true });
  await expect(page.getByRole('link', { name: 'この神社のページ' })).toBeVisible();
});

test('主要画面に横スクロールがなく、押せる要素に名前と十分な大きさがある', async ({ page }, info) => {
  await page.goto('./#/');
  await page.getByRole('button', { name: '神社に行かずにデモで試す' }).click();
  await page.getByRole('button', { name: /模擬位置（デモ）で確かめる/ }).click();
  await page.getByRole('button', { name: '参拝する' }).click();
  await page.getByRole('button', { name: '参拝した' }).click();
  const visitUrl = page.url().split('#')[1]!.split('?')[0]!;
  for (const path of ['/', '/places', '/places/kasuga-taisha', '/arrive/izumo-taisha', visitUrl, '/visits', '/map', '/guide/chigi-katsuogi', '/settings', '/manners']) {
    await page.goto(`./#${path}`);
    await page.waitForLoadState('networkidle');
    await expectNoHorizontalScroll(page);
    const problems = await page.evaluate((mobile) => {
      const out: string[] = [];
      document.querySelectorAll<HTMLElement>('button, a.btn, a.list-item, .tabbar__link, input, select, textarea').forEach((el) => {
        if (el.closest('.leaflet-container') || el.closest('.plot__grid')) return; // 地図と敷地のマスは別に扱う
        const target = el.matches('input, select, textarea') ? (el.closest('label') ?? el) : el;
        const r = target.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const name = (el.getAttribute('aria-label') ?? el.textContent ?? (el as HTMLInputElement).placeholder ?? '').trim();
        if (!name && !el.closest('label') && !el.id) out.push(`名前なし: ${el.outerHTML.slice(0, 80)}`);
        if (mobile && r.height < 40 && !el.classList.contains('link')) out.push(`小さい(${Math.round(r.height)}px): ${name.slice(0, 20)}`);
      });
      return out;
    }, info.project.name === 'mobile');
    expect(problems, path).toEqual([]);
  }
});
