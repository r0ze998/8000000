# 8000000 — 実装の構成（v3.1）

## 全体

```
ブラウザ（React + Vite）
 ├─ 端末内の保存（localStorage）……自分の神社の配置・参拝の控え・チェーン記録の状態
 └─ Starknet（ShrineNetwork コントラクト）……参拝・神社の登録・様子の報告（公開）
      └─ 読み出し：callContract（参拝数など）と getEvents（登録・報告の一覧）
```

自分の神社の配置は端末内だけにあります。チェーンに置くのは「どの神社に、いつ（日本時間の日付）、どのアドレスが参拝したか」と、
神社の登録・様子の報告だけです。部品は「神社と日付」だけで決まる規則で配るので、チェーン上の参拝記録から誰でも再計算できます。

## ディレクトリ

```
contracts/                Cairo（Scarb 2.11 / snforge 0.43）
  src/lib.cairo           ShrineNetwork
  tests/                  snforge のテスト
src/
  App.tsx                 ルーティング（HashRouter）とエラー境界
  styles.css              見た目（紙・墨・藍・苔、敷地・地図）
  data/
    shrines.ts sources.ts features.ts etiquette.ts   出典付きの事実
    parts.ts              部品と「ゆかりの部品」（shrines.ts の見どころから導く）
  state/
    model.ts              ゲームの規則（報酬・育ち方・置き方・チェーン記録の状態）
    storage.ts            保存・検証・壊れたデータの退避・旧版からの引き継ぎ
    GameContext.tsx
  chain/
    config.ts             接続先（環境変数から）
    codec.ts              felt / UTF-8 の ByteArray / 座標 / 日本時間の日付の変換
    client.ts             読み書きとイベントの読み出し（calldata は自前で組み立てる）
    ChainContext.tsx      接続（devnet はテスト用アカウント、Sepolia はウォレット拡張）
    useChainActions.ts    送信・待機・失敗理由・同日二重記録の回避
    useCommunity.ts       みんなの記録の読み出し（キャッシュ）
  components/             Screen・ShrinePlot（敷地）・ChainPanel・Illustration など
  screens/                Home・Places・PlaceDetail・Arrive・VisitResult・Visits・MapScreen・Settings…
scripts/
  devnet.mjs              devnet 起動 → デプロイ → .env を書く
  deploy-sepolia.mjs      Sepolia へデプロイ（Sepolia 以外は拒否、鍵はメモリ上でだけ復号）
  tour.mjs                画面写真を撮る
e2e/                      Playwright（chain.spec.ts は devnet、flows.spec.ts はチェーンなし）
```

## コントラクト（ShrineNetwork）

| 関数 | 内容 | 制約 |
|---|---|---|
| `record_visit(shrine_id)` | 参拝の記録 | 同じアカウント・同じ神社は日本時間の1日1回 |
| `register_shrine(shrine_id, name, lat_e3, lng_e3)` | 神社の登録 | 同じ id は1回。名前は 1〜120 バイト。座標は約100m単位 |
| `report_condition(shrine_id, status, note)` | 様子の報告 | その神社に参拝を記録したアカウントだけ。status 0〜3、note 280 バイトまで |
| `shrine_stats` / `shrine_info` / `visitor_stats` / `visits_at` / `has_visited_today` / `current_day` | 読み出し | |

イベント：`Visited`（keys: shrine_id, visitor）・`ShrineRegistered`（keys: shrine_id）・`ConditionReported`（keys: shrine_id, reporter）。
トークンも所有権も持たず、資金を受け取る関数もありません。

## 画面

| URL | 画面 |
|---|---|
| `#/` | 自分の神社（敷地・手元の部品・育ち具合・まだ持っていないゆかりの部品） |
| `#/places` `#/places/:id` | 参拝する神社の一覧（近い順）・神社のページ（事実と出典・みんなの記録・自分の参拝） |
| `#/arrive/:id` | 位置の確認 → 参拝の作法 → 「参拝した」 |
| `#/visits` `#/visits/:id` | 参拝の記録・結果（受け取った部品、チェーンへの記録、様子の報告） |
| `#/map` | みんなの地図（Leaflet + OpenStreetMap） |
| `#/guide/:id` | 部品のもとになった見どころの解説 |
| `#/settings` `#/manners` | 設定（チェーン・同意・デモ・データ）、参拝の心得 |

## チェーンに送らないもの

- デモの参拝
- 位置を確かめていない参拝（位置情報を拒否したときなど）。部品はもらえるが、みんなの地図の信頼性のため送らない
- 同意していない人の参拝（いつでも設定で変えられる）
