import { defineConfig, devices } from '@playwright/test';

// 本番ビルドを vite preview で配信して試す。
// - chain:   ローカル devnet にデプロイしたコントラクトにつないだビルド（:4173）
// - offline: チェーンの設定がないビルド（:4174）
const CHAIN = 'http://127.0.0.1:4173/';
const OFFLINE = 'http://127.0.0.1:4174/';

export default defineConfig({
  testDir: './e2e',
  globalTeardown: './e2e/teardown.ts',
  timeout: 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    trace: 'retain-on-failure',
  },
  projects: [
    // チェーンに書き込むシナリオは同じ devnet アカウントを使うので、1つの構成で順番に走らせる
    { name: 'chain-mobile', testMatch: /chain\.spec\.ts/, use: { ...devices['Pixel 7'], baseURL: CHAIN } },
    { name: 'mobile', testMatch: /flows\.spec\.ts/, use: { ...devices['Pixel 7'], baseURL: OFFLINE } },
    { name: 'desktop', testMatch: /flows\.spec\.ts/, use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 }, baseURL: OFFLINE } },
  ],
  webServer: [
    {
      command: 'node scripts/devnet.mjs --port 5052 --env .env.e2e.local',
      url: 'http://127.0.0.1:5052/is_alive',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command:
        'node scripts/wait-file.mjs .env.e2e.local && npx vite build --mode e2e --outDir dist-e2e && npx vite preview --outDir dist-e2e --host 127.0.0.1 --port 4173 --strictPort',
      url: CHAIN,
      reuseExistingServer: false,
      timeout: 180_000,
    },
    {
      command: 'npx vite build --outDir dist-offline && npx vite preview --outDir dist-offline --host 127.0.0.1 --port 4174 --strictPort',
      url: OFFLINE,
      reuseExistingServer: false,
      timeout: 180_000,
    },
  ],
});
