# 8000000 - 神社参拝習慣化アプリ

習慣化を軸とした神社参拝アプリ。Hooked モデルとOctalysis フレームワークに基づき、毎日の参拝習慣を楽しく継続できるよう設計されています。日本の文化活動（神社参拝、寺院訪問、祭り参加など）をブロックチェーン上で永続的に記録し、文化資本として可視化するシステムです。

## 🎯 コンセプト

### Hooked Model (習慣化サイクル)
- **Trigger**: 朝の通知、近くの神社検出
- **Action**: ワンタップ参拝（位置情報またはQR）
- **Variable Reward**: レア御朱印、祈願カード、特別な加護
- **Investment**: NFT御朱印収集、連続記録、村の発展

### 三方良しの設計思想
- **参拝者**: ゲーミフィケーションによる文化体験向上
- **神社**: デジタル参拝記録による訪問促進
- **地域社会**: 観光統合による地域活性化

## 機能

### 🔥 習慣化システム
- ワンタップ参拝（GPS/QR対応）
- 連続記録とストリーク追跡
- 朝の参拝リマインダー
- 近くの神社への自動通知

### 🎲 可変報酬システム
- レアリティ別御朱印（Common〜Legendary）
- 季節限定デザイン（桜、紅葉、満月）
- 祈願カード収集（特殊効果付き）
- 特別な時間・天候ボーナス

### ⛩️ 参拝体験
- GPS位置情報による神社検出
- QRコードスキャンでリモート参拝
- ガチャ風報酬演出
- リアルタイム天候・月齢反映

### 📱 村システム
- 守護神ストーリー
- 村ランキング
- NFT奉納システム
- コミュニティ機能

### 🥋 文化帯ランキング
- 白帯 (0-99 文化資本)
- 黄帯 (100-299)
- 橙帯 (300-499)
- 緑帯 (500-999)
- 青帯 (1000-1999)
- 紫帯 (2000-3999)
- 茶帯 (4000-5999)
- 黒帯 (6000-7999)
- 赤帯 (8000-9999)
- 金帯 (10000+)

## セットアップ

### インストール

1. リポジトリのクローン
```bash
git clone https://github.com/r0ze998/cultural-shrine-village-starknet.git 8000000
cd 8000000
```

2. 依存関係のインストール
```bash
cd frontend
npm install
```

### アプリケーションの起動

```bash
npm start
```

アプリは http://localhost:3000 で起動します。

## 使い方

### 基本的な参拝フロー
1. **アプリ起動** - 位置情報を許可
2. **神社検出** - 近くの神社で⛩️ボタンが光る
3. **ワンタップ参拝** - ボタンをタップして参拝完了
4. **報酬獲得** - 御朱印や祈願カードをゲット
5. **連続記録更新** - 毎日続けてストリークを伸ばす

### リモート参拝
- 神社のQRコードをスキャン
- 手動で神社コードを入力
- 特別イベント参加

### タブ構成
- 🏠 **ホーム**: 今日の参拝状況、近くの神社
- 🗺️ **探索**: 神社マップ、発見した神社
- ⛩️ **参拝**: 参拝履歴、御朱印帳
- 📚 **学び**: 守護神の物語、神社の歴史
- 👤 **プロフィール**: ストリーク、実績、コレクション

## デプロイ

### Vercelでのデプロイ

```bash
vercel --prod
```

Root Directory: `frontend`
Framework: `Create React App`

## 🛠️ 技術スタック

### Frontend
- **Framework**: React 18+ with Hooks
- **Mobile**: Capacitor (iOS/Android対応)
- **State Management**: React Context API
- **Location**: Geolocation API
- **Camera**: MediaDevices API (QRスキャン)
- **Audio**: Web Audio API (BGMシステム)
- **Notifications**: Notification API + Service Workers
- **Graphics**: SVG + Canvas API
- **Styling**: CSS3 + Animations, CSS Modules
- **PWA**: Service Worker, Manifest.json

### Backend & Blockchain
- **Blockchain**: Starknet (Cairo 2.6.0+)
- **Wallet**: StarkNet React (ArgentX, Braavos)
- **NFT**: ERC-721 御朱印コントラクト
- **Storage**: LocalStorage + IPFS (NFTメタデータ)

### Services & APIs
- **位置情報**: GPS + 神社データベース
- **天候**: Weather API連携
- **月齢**: 天文計算アルゴリズム
- **画像生成**: Canvas API (御朱印デザイン)
- **アニメーション**: カスタムパーティクルエフェクト（桜の花びら）

### Architecture
- **Design Pattern**: Hooked Model + Octalysis Framework
- **Core Services**: VisitService, RewardService, NotificationService
- **Habit Loop**: useHabitLoop custom hook
- **Deployment**: Vercel (Static Site Generation)

## 🏛️ 収録神社・寺院

- 伊勢神宮（三重県）- 神話級
- 清水寺（京都府）- 伝説級
- 明治神宮（東京都）- 伝説級
- 出雲大社（島根県）- 伝説級
- 東大寺（奈良県）- 伝説級
- 日光東照宮（栃木県）- 史跡級
- 厳島神社（広島県）- 史跡級
- 善光寺（長野県）- 史跡級
- 金閣寺（京都府）- 史跡級
- 浅草寺（東京都）- 史跡級
- 八坂神社（京都府）- 希少級
- 東福寺（京都府）- 希少級
- 川崎大師（神奈川県）- 一般級
- 成田山新勝寺（千葉県）- 一般級
- 武蔵一宮氷川神社（埼玉県）- 一般級
- 地元の小さな神社（全国）- 一般級

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

## 📝 環境変数

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

## 🤝 作者

8000000 Development Team

---

🌸 日本の伝統文化をデジタルで未来へ 🌸
🤖 このプロジェクトは Claude Code を使用して開発されました。