# 8000000 — 参拝で育てる、自分の神社

実在の神社に行って参拝すると、その神社にゆかりのある部品がもらえ、自分の神社が育っていきます。
参拝の記録と神社の様子の報告は Starknet に残り、みんなの神社の地図になります（DePIN）。

- **神社に行く**：着いたことを位置情報で確かめて参拝する（同じ神社は1日1回）
- **部品をもらう**：春日大社なら春日造の社殿・鹿・石灯籠のように、出典で確かめられる見どころにちなんだ部品
- **自分の神社を育てる**：本殿の隣から部品を置いていく。行った神社が増えるほど境内が 5×5 → 15×15 に広がる
- **みんなの地図**：参拝の記録・神社の様子の報告・新しい神社の登録がチェーンに集まる

トークンの発行・販売や、お金のやりとりはありません。チェーンへの記録は本人の同意が必要で、公開されるのは「アドレス・神社・日付」だけです。

> 経緯と設計の判断は [docs/redesign/REDESIGN.md](docs/redesign/REDESIGN.md) にあります。

## すぐ遊ぶ（チェーンなし）

必要なもの：Node.js 20 以上

```bash
npm install
npm run dev
```

http://localhost:5173 を開きます。最初の画面の「神社に行かずにデモで試す」で、模擬位置（春日大社）を使って参拝から部品を置くまでを試せます。
デモの参拝はチェーンに記録されず、「デモ」と表示され、設定から消せます。

## チェーンにつないで遊ぶ（ローカルの devnet）

必要なもの：[Scarb](https://docs.swmansion.com/scarb/) 2.11（コントラクトのビルド）。devnet 本体は初回に自動でダウンロードされます。

```bash
npm run contracts:build   # contracts/ をビルド
npm run devnet            # devnet を起動してデプロイし .env.devnet.local を書く（このターミナルは開いたまま）
npm run dev:chain         # 別のターミナルで。devnet につながったアプリ
```

devnet ではテスト用のアカウントに自動でつながるので、ウォレットは要りません。位置はブラウザの位置情報を使うので、
実際に神社にいないときはデモモードか、ブラウザの開発者ツールの「位置情報の上書き」を使ってください。

## Starknet Sepolia（テストネット）にデプロイする

テスト用の STRK がある starkli のアカウントで、次を実行します。パスワードは画面に出ない入力欄で聞かれます。
接続先が Sepolia 以外（メインネットなど）なら、何も送らずに止まります。

```bash
npm run contracts:build
npm run deploy:sepolia -- --account ~/.starkli-wallets/<名前>/account.json --keystore ~/.starkli-wallets/<名前>/keystore.json
npm run build:sepolia     # .env.sepolia.local の設定で dist/ を作る
```

Sepolia 版では、参拝者は Argent X か Braavos（Sepolia に切り替えたもの）で記録します。

## コマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | チェーンなしの開発サーバー |
| `npm run dev:chain` | devnet につないだ開発サーバー（先に `npm run devnet`） |
| `npm run build` / `npm run build:sepolia` | 本番ビルド（チェーンなし / Sepolia） |
| `npm test` | 単体テスト（ゲームの規則・保存・出典の整合・チェーン用の変換・devnet との結合） |
| `npm run contracts:test` | コントラクトのテスト（snforge） |
| `npm run test:e2e` | E2E（devnet につないだビルドとチェーンなしのビルド、スマホ・PC） |

E2E を初めて動かす環境では `npx playwright install chromium` が必要です。

## 事実と創作について

- 部品と「自分の神社」はゲーム上の創作です。
- 「事実」の印が付いた文は、Wikipedia 日本語版・神社本庁・各神社の公式サイトの記述を要約したもので、出典へのリンクがあります。
- 神社ごとの「ゆかりの部品」は、出典で確かめられる見どころにだけ結び付けています。
- 「みんなの地図」の様子の報告は参拝者が書いたもので、神社の公式な情報ではありません。
- 非公式の個人制作アプリで、掲載している神社を含め、いずれの神社・団体とも提携・公認の関係にありません。
