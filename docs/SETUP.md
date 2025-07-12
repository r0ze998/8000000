# セットアップガイド - 8000000 神社参拝習慣化アプリ

## 🚀 基本セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env`ファイルを作成し、以下の設定を行ってください：

```env
# Google Maps API Key（必須）
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# StarkNet Configuration
REACT_APP_STARKNET_NETWORK=testnet

# Application Configuration
REACT_APP_VERSION=2.0.0
REACT_APP_DEBUG=false

# API Configuration
REACT_APP_API_URL=https://api.example.com
```

### 3. Google Maps API キーの取得

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成または既存のプロジェクトを選択
3. **APIs & Services** → **Library** から **Maps JavaScript API** を有効化
4. **APIs & Services** → **Credentials** で API キーを作成
5. 作成したAPI キーを`.env`ファイルに設定

### 4. アプリケーションの起動
```bash
npm start
```

アプリケーションは `http://localhost:3000` で起動します。

## 🔧 開発モード

### Google Maps API キーなしでの開発
Google Maps API キーが設定されていない場合、アプリは以下のフォールバック機能を使用します：
- プレースホルダーマップ表示
- 神社データはテストデータを使用
- 地図機能以外は正常に動作

### デバッグモード
```bash
# デバッグモードを有効化
REACT_APP_DEBUG=true npm start
```

## 🏗️ 開発を続けるために

### 主要な機能と実装状況

#### ✅ 完成済み機能
- **参拝システム**: 瞑想セッション、祈りの選択、NFT報酬
- **マイ神社**: ピクセルアート神社構築、NFTコレクション
- **探索機能**: 神社マップ、検索機能
- **プロフィール**: アカウント管理、設定
- **Account Abstraction**: モックAPI実装

#### 🔄 継続開発が必要な機能

##### 1. Google Maps統合の強化
- **現在の状態**: 基本的な地図表示とマーカー配置
- **拡張すべき機能**:
  - 現在地取得とGPS追跡
  - 神社への道順案内
  - 近くの神社への通知
  - QRコードスキャン機能

##### 2. StarkNet統合
- **現在の状態**: モック実装
- **実装すべき機能**:
  - 実際のウォレット連携（ArgentX, Braavos）
  - リアルNFTミント
  - スマートコントラクト連携

##### 3. PWA機能の強化
- **実装すべき機能**:
  - オフライン対応
  - プッシュ通知
  - インストール可能性

##### 4. ソーシャル機能
- **実装すべき機能**:
  - 友達システム
  - 神社レビュー
  - コミュニティ機能

### 実装の優先順位

#### 🔥 高優先度
1. **Google Maps API完全統合**
2. **GPS位置情報機能**
3. **QRコードスキャン**
4. **プッシュ通知**

#### 🔸 中優先度
1. **StarkNet実装**
2. **PWA機能**
3. **追加の祈りタイプ**
4. **音声ガイド**

#### 🔹 低優先度
1. **ソーシャル機能**
2. **高度な分析機能**
3. **多言語対応**

## 📁 プロジェクト構造

```
src/
├── components/        # React コンポーネント
│   ├── common/       # 共通コンポーネント
│   └── features/     # 機能別コンポーネント
├── hooks/            # カスタムフック
├── utils/            # ユーティリティ関数
├── types/            # TypeScript型定義
├── data/             # 静的データ
├── constants/        # 定数
└── styles/           # CSS スタイル
```

## 🛠️ 追加実装ガイド

### 新しい祈りタイプの追加
1. `src/constants/prayerTypes.ts`に新しい祈りタイプを追加
2. 必要に応じて色とアイコンを設定
3. 特別な効果がある場合は`src/utils/gameUtils.ts`に実装

### 新しいNFTタイプの追加
1. `src/data/nftParts.ts`に新しいNFTデータを追加
2. `src/utils/nftUtils.ts`でドロップ確率を調整
3. 必要に応じて特別な効果を実装

### 新しい神社の追加
1. `src/data/shrines.ts`に神社データを追加
2. 正確な位置情報（緯度経度）を設定
3. 適切な希少度を設定

## 🧪 テスト

### 単体テスト
```bash
npm test
```

### 本番ビルド
```bash
npm run build
```

### デプロイ
```bash
# Vercel
vercel --prod

# その他のプラットフォーム
npm run build
# dist/フォルダを任意のホスティングにデプロイ
```

## 🎯 次のステップ

1. **Google Maps API キーを設定**
2. **GPS機能を実装**
3. **QRコードスキャン機能を追加**
4. **プッシュ通知システムを構築**
5. **StarkNet統合を実装**

## 🤝 貢献

このプロジェクトへの貢献を歓迎します：

1. イシューを作成して問題を報告
2. プルリクエストで機能追加
3. ドキュメントの改善
4. バグ修正

## 📝 ライセンス

MIT License

---

🌸 日本の伝統文化をデジタルで未来へ 🌸