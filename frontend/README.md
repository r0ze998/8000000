# 8000000 - フロントエンド

日本の文化活動を記録し、神社村を発展させるWeb3アプリケーション。

## 🏛️ 概要

8000000は、神社・寺院への参拝や文化活動を記録し、自分だけの神社村を発展させることができるゲーミフィケーションアプリです。「三方良し」の精神を設計原則として、参拝者・神社・地域社会の三者にとって有益なエコシステムを構築します。

### 主な機能

- 🏠 **ホームタブ**: ダッシュボードと近くのスポット表示
- ⛩️ **参拝タブ**: おみくじシステム統合の神社参拝記録
- 🗺️ **探索タブ**: 観光統合機能付きの地域探索
- 📚 **学習タブ**: 文化資本システムによる日本文化学習
- 👤 **プロフィールタブ**: 実績とコレクション管理
- 🎯 **おみくじシステム**: 神社参拝と連動したおみくじ体験
- 🎴 **NFTコレクション**: 参拝記録をNFTとして保存
- 💰 **インセンティブエンジン**: 参拝と文化活動の報酬システム

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
│   ├── HomeTab.js             # ホームダッシュボード
│   ├── VisitTab.js            # 参拝記録タブ
│   ├── ExploreTab.js          # 探索タブ
│   ├── LearnTab.js            # 学習タブ
│   ├── ProfileTab.js          # プロフィールタブ
│   ├── BottomNavigation.js    # ボトムナビゲーション
│   ├── OmikujiSystem.js       # おみくじシステム
│   ├── IOSWrapper.js          # iOS PWA対応ラッパー
│   ├── WalletConnection.js    # ウォレット接続
│   ├── TourismIntegration.js  # 観光統合機能
│   ├── CulturalCapitalSystem.js # 文化資本システム
│   ├── IncentiveEngine.js     # インセンティブエンジン
│   ├── ActivityButtons.js     # 文化活動ボタン
│   ├── GameCanvas.js          # ゲームキャンバス
│   ├── NFTCollection.js       # NFTコレクション表示
│   ├── ShrineSelector.js      # 神社・寺院選択
│   ├── VisitVerification.js   # 参拝証明
│   └── ...
├── constants/          # 定数定義
│   └── culturalActivities.js  # 文化活動定数
├── data/              # データ
│   ├── shrineDatabase.js      # 神社・寺院データベース
│   └── omikujiDatabase.js     # おみくじデータベース
├── hooks/             # カスタムフック
│   ├── useShrine.js           # 神社状態管理
│   └── useNotification.js     # 通知管理
├── services/          # サービス層
│   ├── verificationService.js # 位置情報検証
│   └── nftMinting.js          # NFTミンティング
├── utils/             # ユーティリティ
│   └── soundEffects.js        # サウンドエフェクト
├── App.ios.js         # iOS専用エントリーポイント
└── ShrineVillageApp.js        # メインアプリケーション
```

## 🔧 技術スタック

- **フロントエンド**: React.js, Canvas API
- **状態管理**: React Hooks
- **スタイリング**: CSS Modules, レスポンシブデザイン
- **PWA**: Service Worker, Manifest.json
- **モバイル**: Capacitor (iOS/Android対応)
- **位置情報**: Geolocation API
- **Web3**: Starknet統合
- **アニメーション**: カスタムパーティクルエフェクト

## 📱 アプリ構造

### タブナビゲーション
- **ホーム**: ユーザーダッシュボード、近くのスポット、統計表示
- **参拝**: おみくじ統合の神社参拝記録システム
- **探索**: 観光地情報と文化スポット探索
- **学習**: 日本文化学習コンテンツと文化資本システム
- **プロフィール**: ユーザー実績、コレクション、設定

### 参拝証明システム
- GPS位置情報による参拝証明
- 写真アップロード機能
- おみくじ体験の統合
- NFT化による永続的記録

### 三方良しの設計思想
- **参拝者**: ゲーミフィケーションによる文化体験向上
- **神社**: デジタル参拝記録による訪問促進
- **地域社会**: 観光統合による地域活性化

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

## 📱 モバイルアプリ

### iOS/Android対応
```bash
# Capacitorの初期化
npx cap init

# iOS用ビルド
npm run build
npx cap add ios
npx cap copy ios
npx cap open ios

# Android用ビルド
npx cap add android
npx cap copy android
npx cap open android
```

### PWA対応
- オフライン機能
- ホームスクリーン追加
- プッシュ通知（将来実装）

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

## 🔄 最新の変更

### v2.0.0 (2024年5月)
- タブベースナビゲーションの実装
- おみくじシステムの統合
- 三方良しの設計思想の適用
- iOS PWA対応の強化
- アプリ名を「8000000」に変更

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずissueを作成して変更内容を議論してください。