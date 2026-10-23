# やおよろず帳 — 実装の構成（v3）

## ディレクトリ

```
src/
  main.tsx              エントリ（旧版の Service Worker を解除）
  App.tsx               ルーティング（HashRouter）とエラー境界
  styles.css            デザイントークン（紙・墨・藍・苔）と全部品のスタイル
  data/
    features.ts         境内図鑑 21 項目（事実・探し方・稽古用の手がかり）
    shrines.ts          収録 14 社（主祭神・事実・出典で確かめられる見どころ・概略座標）
    sources.ts          出典の一覧（事実の文はここの id を参照する）
    etiquette.ts        参拝の作法（事実）と、境内でのお願い・プライバシー方針（案内）
  state/
    model.ts            帳面のデータ型と、すべての変更（純粋な reducer）
    storage.ts          保存・復元・検証・壊れたデータの退避・旧版キーからの引き継ぎ
    NotebookContext.tsx Provider（保存の失敗検知、別タブでの変更の取り込み）
  lib/
    geo.ts              距離計算・位置取得（1回だけ、キャッシュなし）・エラー文言
    useLocate.ts        位置取得のフック（デモモードでは模擬位置）
    drill.ts            見分け稽古の出題
    places.ts           収録神社と自分で加えた神社をまとめて扱う
  components/           Screen（ヘッダー・タブ・バナー）、Illustration（線画）、Sheet ほか
  screens/              各画面
e2e/                    Playwright のシナリオ
scripts/                変更前後のスクリーンショットを撮るスクリプト
```

## 画面と URL

| URL | 画面 | 役割 |
|---|---|---|
| `#/` | きょう | 次にすること（初回は稽古、記録中なら続き、探し物、最近の頁） |
| `#/places` | さがす | 収録神社の一覧（位置で近い順）、自分の神社を加える |
| `#/places/:id` | 神社 | 主祭神と事実（出典付き）、出典で確かめられる見どころ、自分の頁 |
| `#/arrive/:id` | 記録を始める | 位置の確認（理由の説明・拒否・遠い・夜間）、位置なしで開始 |
| `#/visit` | 境内の記録 | 見つけた印・メモ・作法・一息つく・綴じる／破棄 |
| `#/guide` `#/guide/:id` | 図鑑 | 未知／知っている／見た の3段階、探し物に加える |
| `#/drill` | 見分け稽古 | 線画や手がかりから選ぶ。正解したものが「知っている」になる |
| `#/notebook` `#/notebook/:id` | 帳面 | 頁の一覧、頁（初めて見た印、次に探すもの） |
| `#/settings` | 設定とデータ | デモモード、書き出し／読み込み、全消去、プライバシー、出典 |
| `#/manners` | 参拝の心得 | 作法（事実）と、アプリからのお願い |

記録中は1件だけ。途中で閉じても `visits` に `closedAt` のない記録として残り、再読み込み後も続きから書けます。

## データ（localStorage `yaoyorozu.notebook.v1`）

```ts
Notebook {
  version: 1; title; onboarded;
  knowledge: { [featureId]: { learnedAt, via: 'read' | 'drill' | 'visit' } };
  pinned: featureId[];            // 3つまで
  visits: Visit[];                // check: 'gps' | 'self' | 'demo'、distanceM は概数、座標は保存しない
  sightings: Sighting[];          // visitId と featureId の組、note
  customPlaces: CustomPlace[];    // 座標は任意・約100m単位に丸める
  drill: { rounds, answered, correct };
  settings: { demo, demoPlaceId };
}
```

- 「見た」は**綴じた**記録の印からだけ数える。頁を消せば図鑑の「見た」も戻る。
- 読み込み時に形を検証し、足りない項目は既定値で補う。直せないときは元の文字列を
  `yaoyorozu.notebook.corrupt.<時刻>` に退避して新しい帳面で始め、画面で知らせる。
- 旧版（v2）のキーは読むだけで変更しない。`shrineName` があれば帳面の名前として引き継ぐ。

## 事実の扱い

- `Fact.sources` が空の事実は単体テストで落ちる。出典 id が存在しない場合も落ちる。
- 出典の内容との照合は 2026-10-24 に別エージェントが各ページを開いて行い、指摘を反映した（REDESIGN.md 参照）。
  データを足すときは同じ照合をしてください。
