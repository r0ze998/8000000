import { expect, test } from '@playwright/test';
import { answerAll, atNoon, expectNoHorizontalScroll, KEY, readNotebook } from './helpers';

test.beforeEach(async ({ page }) => {
  await atNoon(page);
});

test('初回：鳥居の見分け稽古から始め、探し物を選んでホームに反映される', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: /境内は、見分けられると/ })).toBeVisible();
  await page.getByRole('link', { name: /鳥居を見分けてみる/ }).click();

  await expect(page.getByRole('heading', { name: 'この鳥居の形は？' })).toBeVisible();
  await expect(page.locator('.quiz-option')).toHaveCount(3);
  await answerAll(page);

  // 結果画面で、正解したものがあれば探し物に選べる
  const pick = page.getByRole('button', { name: '選ぶ' }).first();
  const hadCorrect = (await pick.count()) > 0;
  if (hadCorrect) await pick.click();
  await page.getByRole('link', { name: 'はじめる' }).click();

  await expect(page.getByRole('heading', { name: '次に探すもの' })).toBeVisible();
  const nb = await readNotebook(page);
  expect(nb.onboarded).toBe(true);
  expect(nb.drill.rounds).toBe(1);
  expect(nb.drill.answered).toBe(3);
  if (hadCorrect) expect(nb.pinned.length).toBe(1);
});

test('デモ：模擬位置で記録 → 再読み込みで復元 → 綴じると図鑑に印が付く', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'デモで境内の記録を試す' }).click();

  await expect(page.getByText('デモモード').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: '春日大社' })).toBeVisible();
  await page.getByRole('button', { name: /模擬位置（デモ）で確かめる/ }).click();
  await expect(page.getByText(/境内付近です/)).toBeVisible();
  await page.getByRole('button', { name: '記録を始める' }).click();

  await expect(page).toHaveURL(/#\/visit$/);
  await expect(page.getByText('デモ・模擬位置')).toBeVisible();

  // 出典のある見どころ（春日造）が上に来ている
  const firstRow = page.locator('.find').first();
  await expect(firstRow).toContainText('出典あり');

  const kasuga = page.locator('.find', { hasText: '春日造' });
  await kasuga.getByRole('button', { name: '見つけた' }).click();
  await kasuga.getByPlaceholder('どんな様子だった？（任意）').fill('朱の柱と白い壁');
  const toro = page.locator('.find', { hasText: '石灯籠' });
  await toro.getByRole('button', { name: '見つけた' }).click();
  await page.getByPlaceholder(/木漏れ日/).fill('鹿が参道を歩いていた');

  // 途中で再読み込みしても記録が残る
  await page.reload();
  await expect(page.locator('.find', { hasText: '春日造' }).getByRole('button', { name: '✓ 見つけた' })).toBeVisible();
  await expect(page.locator('.find', { hasText: '春日造' }).getByRole('textbox')).toHaveValue('朱の柱と白い壁');
  await expect(page.getByPlaceholder(/木漏れ日/)).toHaveValue('鹿が参道を歩いていた');

  await page.getByRole('button', { name: /帳面に綴じる（2件）/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: '綴じる' }).click();

  await expect(page).toHaveURL(/#\/notebook\/visit_.*new=1/);
  await expect(page.getByText('初めて見たものが 2 つあります')).toBeVisible();
  await expect(page.getByText('デモの記録')).toBeVisible();
  await expect(page.getByText('「朱の柱と白い壁」')).toBeVisible();

  // 図鑑の項目に「初めて見た」が出る
  await page.getByRole('link', { name: /春日造/ }).first().click();
  await expect(page.getByText(/春日大社で初めて見た（デモ）/)).toBeVisible();

  // 帳面の一覧にデモの印付きで並ぶ
  await page.goto('./#/notebook');
  await expect(page.locator('.list-item', { hasText: '春日大社' })).toContainText('デモ');

  // デモの記録を消すと、図鑑の「見た」も戻る
  await page.goto('./#/settings');
  await page.getByRole('button', { name: /デモの記録をすべて消す（1件）/ }).click();
  await page.goto('./#/guide/style-kasuga');
  await expect(page.getByText(/初めて見た/)).toHaveCount(0);
});

test('位置情報が拒否されたら理由を示し、位置を使わずに記録できる', async ({ page, context }) => {
  await context.clearPermissions();
  await page.goto('./#/arrive/meiji-jingu');
  await page.getByRole('button', { name: '位置を確かめる' }).click();
  await expect(page.getByText('位置情報の利用が許可されませんでした')).toBeVisible();
  await expect(page.getByRole('button', { name: 'もう一度試す' })).toBeVisible();
  await page.getByRole('button', { name: '位置を使わずに始める' }).click();
  await expect(page.getByText('位置未確認')).toBeVisible();
  await expect(page.getByRole('heading', { name: '明治神宮' })).toBeVisible();
});

test('位置情報：近くなら「境内付近」、遠ければ離れていると伝える', async ({ page, context }) => {
  await context.grantPermissions(['geolocation']);
  await context.setGeolocation({ latitude: 35.6758, longitude: 139.699 });
  await page.goto('./#/places');
  await page.getByRole('button', { name: '位置情報で近い順にする' }).click();
  await expect(page.getByText('現在地から近い順に並べています')).toBeVisible();
  const first = page.locator('.list-item').first();
  await expect(first).toContainText('明治神宮');
  await expect(first).toContainText('境内付近');

  await first.click();
  await page.getByRole('button', { name: 'ここで記録を始める' }).click();
  await page.getByRole('button', { name: '位置を確かめる' }).click();
  await page.getByRole('button', { name: '記録を始める' }).click();
  await expect(page.getByText(/位置確認済み（約\d+m）/)).toBeVisible();
  // 座標そのものは保存しない
  const nb = await readNotebook(page);
  expect(JSON.stringify(nb)).not.toContain('35.675');

  // 記録中は別の神社で始められない
  await page.goto('./#/arrive/ise-naiku');
  await expect(page.getByText('明治神宮の記録が途中です')).toBeVisible();
  await page.goto('./#/visit');
  await page.getByRole('button', { name: 'この記録を破棄する' }).click();
  await page.getByRole('dialog').getByRole('button', { name: '破棄する' }).click();

  // 大阪にいるとき、明治神宮は遠い
  await context.setGeolocation({ latitude: 34.6937, longitude: 135.5023 });
  await page.goto('./#/arrive/meiji-jingu');
  await page.getByRole('button', { name: '位置を確かめる' }).click();
  await expect(page.getByText(/明治神宮から約\d+km離れているようです/)).toBeVisible();
  await expect(page.getByRole('button', { name: '記録を始める' })).toHaveCount(0);
});

test('近所の神社を自分で加えて記録できる', async ({ page }) => {
  await page.goto('./#/places');
  await page.getByPlaceholder('神社名・地名で絞り込む').fill('坂の上八幡');
  await expect(page.getByText('「坂の上八幡」に当てはまる神社は収録されていません。')).toBeVisible();
  await page.getByRole('button', { name: '「坂の上八幡」を帳面に加える' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: '加える' }).click();
  await expect(page.getByRole('heading', { name: '坂の上八幡', level: 2 })).toBeVisible();
  await expect(page.getByText('あなたが加えた神社です')).toBeVisible();
  await page.getByRole('button', { name: 'ここで記録を始める' }).click();
  await page.getByRole('button', { name: '記録を始める' }).click();
  await expect(page.getByText('位置未確認')).toBeVisible();
  await page.locator('.find', { hasText: '阿吽の狛犬' }).getByRole('button', { name: '見つけた' }).click();
  await page.getByRole('button', { name: /帳面に綴じる/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: '綴じる' }).click();
  await expect(page.getByText('初めて見たものが 1 つあります')).toBeVisible();
});

test('戻る操作：アプリ内の戻る・ブラウザの戻る・直リンク', async ({ page }) => {
  // 直リンクで開いたときの戻るボタンは一覧へ
  await page.goto('./#/guide/torii-myojin');
  await expect(page.getByRole('heading', { name: '明神鳥居', level: 2 })).toBeVisible();
  await page.getByRole('button', { name: '戻る' }).click();
  await expect(page).toHaveURL(/#\/guide$/);

  // 履歴があるときはブラウザの戻ると同じ
  await page.getByRole('link', { name: /両部鳥居/ }).click();
  await expect(page.getByRole('heading', { name: '両部鳥居', level: 2 })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/#\/guide$/);
  await page.goForward();
  await expect(page.getByRole('heading', { name: '両部鳥居', level: 2 })).toBeVisible();
  await page.getByRole('button', { name: '戻る' }).click();
  await expect(page).toHaveURL(/#\/guide$/);

  // 存在しないページ・項目
  await page.goto('./#/nowhere');
  await expect(page.getByText('このページは見つかりませんでした')).toBeVisible();
  await page.getByRole('link', { name: 'きょうへ戻る' }).click();
  await expect(page).toHaveURL(/#\/$/);
  await page.goto('./#/guide/not-a-feature');
  await expect(page.getByText('この図鑑の項目は見つかりませんでした')).toBeVisible();
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
      .filter((k) => k.startsWith('yaoyorozu.notebook.corrupt.'))
      .map((k) => localStorage.getItem(k)),
  );
  expect(backups).toEqual(['{broken json']);
  await page.getByRole('button', { name: 'わかった' }).click();
  await expect(page.getByText('保存データを読み込めませんでした')).toHaveCount(0);
});

test('保存できない環境では警告を出し、操作は続けられる', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('QuotaExceededError');
    };
  });
  await page.goto('./');
  await expect(page.getByText('この端末に保存できません')).toBeVisible();
  await page.getByRole('link', { name: /鳥居を見分けてみる/ }).click();
  await expect(page.locator('.quiz-option')).toHaveCount(3);
});

test('旧アプリの神社名を帳面の名前として引き継ぎ、旧データは消さない', async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('shrineName', JSON.stringify('山の上神社'));
      localStorage.setItem('shrineNFTs', '[{"id":"x"}]');
      sessionStorage.setItem('seeded', '1');
    }
  });
  await page.goto('./');
  await expect(page.getByText('以前のアプリで付けた名前を、帳面の名前として引き継ぎました（山の上神社の帳面）')).toBeVisible();
  const legacy = await page.evaluate(() => [localStorage.getItem('shrineName'), localStorage.getItem('shrineNFTs')]);
  expect(legacy).toEqual(['"山の上神社"', '[{"id":"x"}]']);
});

test('帳面の書き出しと読み込み', async ({ page }) => {
  await page.goto('./#/notebook');
  await page.getByRole('button', { name: '名前を変える' }).click();
  await page.getByRole('dialog').getByRole('textbox').fill('秋の帳面');
  await page.getByRole('dialog').getByRole('button', { name: '保存' }).click();
  await expect(page.getByRole('heading', { name: '秋の帳面' })).toBeVisible();

  await page.goto('./#/settings');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: '帳面を書き出す（.json）' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^yaoyorozu-notebook-\d{4}-\d{2}-\d{2}\.json$/);
  const path = await download.path();
  const fs = await import('node:fs');
  const exported = JSON.parse(fs.readFileSync(path, 'utf8'));
  expect(exported.title).toBe('秋の帳面');

  // 壊れたファイルは読み込まない
  await page.locator('input[type=file]').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"nope":1}') });
  await expect(page.getByText('帳面のデータとして読み込めませんでした')).toBeVisible();

  // 正しいファイルは確認してから置き換える
  exported.title = '読み込んだ帳面';
  await page.locator('input[type=file]').setInputFiles({ name: 'ok.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(exported)) });
  await page.getByRole('dialog').getByRole('button', { name: '読み込む' }).click();
  await expect(page.getByText('帳面を読み込みました。')).toBeVisible();
  await page.goto('./#/notebook');
  await expect(page.getByRole('heading', { name: '読み込んだ帳面' })).toBeVisible();
});

test('主要画面に横スクロールがなく、押せる要素に名前と十分な大きさがある', async ({ page }, info) => {
  await page.goto('./#/');
  for (const path of ['#/', '#/places', '#/places/kasuga-taisha', '#/guide', '#/guide/chigi-katsuogi', '#/drill', '#/notebook', '#/settings', '#/manners', '#/arrive/izumo-taisha']) {
    await page.goto(`./${path}`);
    await page.waitForLoadState('networkidle');
    await expectNoHorizontalScroll(page);
    const problems = await page.evaluate((mobile) => {
      const out: string[] = [];
      document.querySelectorAll<HTMLElement>('button, a.btn, a.list-item, a.tile, .tabbar__link, input, select, textarea').forEach((el) => {
        // ラベルで包まれた入力は、ラベル全体が押せる範囲
        const target = el.matches('input, select, textarea') ? (el.closest('label') ?? el) : el;
        const r = target.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return; // 非表示
        const name = (el.getAttribute('aria-label') ?? el.textContent ?? (el as HTMLInputElement).placeholder ?? '').trim();
        const isLabelled = name || el.closest('label') || el.id;
        if (!isLabelled) out.push(`名前なし: ${el.outerHTML.slice(0, 80)}`);
        if (mobile && r.height < 40 && !el.classList.contains('link')) out.push(`小さい(${Math.round(r.height)}px): ${name.slice(0, 20)}`);
      });
      return out;
    }, info.project.name === 'mobile');
    expect(problems, path).toEqual([]);
  }
});
