# Cultural Shrine Village - フロントエンド

日本の文化活動を記録し、神社村を発展させるWeb3アプリケーション。

## 🏛️ 概要

Cultural Shrine Villageは、神社・寺院への参拝や文化活動を記録し、自分だけの神社村を発展させることができるゲーミフィケーションアプリです。

### 主な機能

- 📸 **写真/GPS参拝証明**: 実際に訪問したことを証明
- ⛩️ **神社村開発**: 文化活動を通じて建物を建設・アップグレード
- 🎮 **探索ゲーム**: スプライトベースの文化探索ゲーム
- 🥋 **文化帯システム**: 空手帯にインスパイアされた10段階のランキング
- 🎴 **NFTコレクション**: 参拝記録をNFTとして保存
- 📚 **200+の神社・寺院データベース**: 実在の神社・寺院情報

## 🚀 セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start

# プロダクションビルド
npm run build

# テストの実行
npm test
```

## 📁 プロジェクト構造

```
src/
├── components/          # UIコンポーネント
│   ├── ActivityButtons.js     # 文化活動ボタン
│   ├── ActivityModal.js       # 活動記録モーダル
│   ├── GameCanvas.js          # ゲームキャンバス
│   ├── NFTCollection.js       # NFTコレクション表示
│   ├── ShrineSelector.js      # 神社・寺院選択
│   ├── ShrineSetup.js         # 神社設定
│   ├── ShrineView.js          # 神社ビュー
│   ├── VisitVerification.js   # 参拝証明
│   └── ...
├── constants/          # 定数定義
│   └── culturalActivities.js  # 文化活動定数
├── data/              # データ
│   └── shrineDatabase.js      # 神社・寺院データベース
├── game/              # ゲームエンジン
│   ├── SpriteEngine.js        # スプライトエンジン
│   ├── CharacterSprites.js    # キャラクタースプライト
│   └── ShrineVillageMap.js    # ゲームマップ
├── hooks/             # カスタムフック
│   ├── useShrine.js           # 神社状態管理
│   └── useNotification.js     # 通知管理
├── services/          # サービス層
│   └── verificationService.js # 位置情報検証
├── utils/             # ユーティリティ
│   └── soundEffects.js        # サウンドエフェクト
└── ShrineVillageApp.js        # メインアプリケーション
```

## 🔧 技術スタック

- **フロントエンド**: React.js, Canvas API
- **状態管理**: React Hooks
- **スタイリング**: CSS Modules
- **位置情報**: Geolocation API
- **アニメーション**: カスタムスプライトエンジン

## 📱 参拝証明システム

### 写真証明
- 神社・寺院の写真をアップロード
- EXIF情報から位置情報を抽出（将来実装）

### GPS証明
- 現在地と神社の距離を計算
- 500m以内の場合のみ参拝記録可能

## 🎮 ゲームシステム

### スプライトエンジン
- レイヤーベースレンダリング
- パーティクルエフェクト
- カメラコントロール
- 物理シミュレーション

### 建物システム
- 6種類の建物タイプ
- 各建物は文化活動で成長
- 特殊効果とボーナス

## 🥋 文化帯ランキング

1. 白帯 (0-99 文化資本)
2. 黄帯 (100-299)
3. 橙帯 (300-499)
4. 緑帯 (500-999)
5. 青帯 (1000-1999)
6. 紫帯 (2000-3999)
7. 茶帯 (4000-5999)
8. 黒帯 (6000-7999)
9. 赤帯 (8000-9999)
10. 金帯 (10000+)

## 🚢 デプロイ

### Vercel
```bash
npx vercel --prod
```

### 環境変数
```
REACT_APP_API_URL=<APIエンドポイント>
REACT_APP_STARKNET_NETWORK=<ネットワーク>
```

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを作成して変更内容を議論してください。