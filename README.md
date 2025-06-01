# 8000000 - 神社参拝習慣化アプリ

習慣化を軸とした神社参拝アプリ。Hooked モデルとOctalysis フレームワークに基づき、毎日の参拝習慣を楽しく継続できるよう設計されています。

## コンセプト

**Hooked Model (習慣化サイクル)**
- **Trigger**: 朝の通知、近くの神社検出
- **Action**: ワンタップ参拝（位置情報またはQR）
- **Variable Reward**: レア御朱印、祈願カード、特別な加護
- **Investment**: NFT御朱印収集、連続記録、村の発展

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

## 技術スタック

### Frontend
- **Framework**: React 18+ with Hooks
- **Mobile**: Capacitor (iOS/Android対応)
- **State Management**: React Context API
- **Location**: Geolocation API
- **Camera**: MediaDevices API (QRスキャン)
- **Audio**: Web Audio API (BGMシステム)
- **Notifications**: Notification API + Service Workers

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

### Architecture
- **Design Pattern**: Hooked Model + Octalysis Framework
- **Core Services**: VisitService, RewardService, NotificationService
- **Habit Loop**: useHabitLoop custom hook
- **Deployment**: Vercel (Static Site Generation)

## ライセンス

MIT License

## 作者

8000000 Development Team

---

🌸 日本の伝統文化をデジタルで未来へ 🌸