# 8000000 - 習慣化フロー設計書

## 🎯 コアコンセプト
「毎日の参拝を習慣化し、日本の神社文化をデジタルで保存・継承する」

## 🔄 Hooked Model 実装

### 1. External Trigger（外的トリガー）
- **位置情報通知**: 神社の近くに来たらプッシュ通知
- **時間通知**: 朝の参拝習慣リマインダー（6:00/7:00）
- **社会的通知**: フレンドが参拝したお知らせ
- **季節イベント**: 初詣、七五三、お祭りなど

### 2. Action（最小限の行動）
```
ホーム画面
    ↓
「参拝する」FAB（右下の大きな丸ボタン）
    ↓
カメラ起動（QRコード/位置情報自動検出）
    ↓
1タップで参拝完了
```

### 3. Variable Reward（可変報酬）
- **Reward of the Tribe（社会的報酬）**
  - 村ランキング上昇
  - 週間MVP表彰
  - フレンドからの「いいね」
  
- **Reward of the Hunt（獲得報酬）**
  - レア祈願札（0.1%〜10%）
  - 季節限定御朱印
  - 神職バッジ
  
- **Reward of the Self（内的報酬）**
  - 参拝ストリーク記録
  - 個人的な願い事の成就度
  - 文化貢献度スコア

### 4. Investment（投資）
- **時間の投資**: 毎日の参拝習慣
- **データの投資**: 願い事、写真、感想の記録
- **社会的投資**: 友達招待、村への貢献
- **経済的投資**: NFT奉納（ガス代）

## 🎮 Octalysis Framework 実装

### 1. Epic Meaning & Calling（壮大な意味）
- **ミッション**: 「1000年後に日本の神社文化を伝える」
- **村の守護神システム**
  ```javascript
  村データ構造:
  {
    villageId: "tokyo_shibuya",
    guardianDeity: {
      name: "都市繁栄の神",
      story: "渋谷の発展を見守り続ける...",
      power: "商売繁盛、技術革新"
    },
    culturalScore: 15000,
    activeUsers: 234
  }
  ```

### 2. Development & Accomplishment（成長と達成）
- **神職ランクシステム**
  ```
  初参拝者 → 氏子 → 巫女/神職見習い → 神職 → 宮司
  ```
- **バッジシステム**
  - 連続参拝バッジ（7日、30日、100日、365日）
  - 地域貢献バッジ
  - レア御朱印コレクターバッジ

### 3. Empowerment of Creativity（創造性）
- **参拝写真のカスタマイズ**
- **願い事の詩的表現**
- **オリジナル絵馬デザイン**

### 4. Ownership & Possession（所有感）
- **NFT御朱印**
  ```solidity
  struct Goshuin {
    uint256 id;
    address owner;
    string shrineName;
    uint256 timestamp;
    string season;
    uint8 rarity; // 1-5 (common to legendary)
    string blessing;
  }
  ```
- **個人の参拝記録アーカイブ**
- **カスタマイズ可能なプロフィール神社**

### 5. Social Influence（社会的影響）
- **村ランキング**
  - 週間アクティブ参拝者数
  - 文化貢献度
  - レア御朱印保有数
- **参拝仲間システム**
- **リアルタイムフィード**

### 6. Scarcity（希少性）
- **季節限定御朱印**（春桜、夏祭、秋紅葉、冬雪）
- **時間限定祈願札**（満月の夜、早朝限定）
- **地域限定守護神**

### 7. Unpredictability（不確実性）
- **ガチャ要素の祈願札**
  ```
  確率分布:
  - SSR 伝説の祈願（0.5%）
  - SR 特別な祈願（5%）
  - R 良い祈願（20%）
  - N 普通の祈願（74.5%）
  ```
- **ランダムイベント**
- **神様からのサプライズメッセージ**

### 8. Loss & Avoidance（損失回避）
- **参拝ストリークの維持**
- **期間限定イベントの締切**
- **ランキング降格の警告**

## 📱 新UI/UXフロー

### メイン画面構成
```
┌─────────────────────┐
│   守護神と村情報     │
│  ┌─────────────┐   │
│  │  今日の参拝   │   │
│  │   チャンス    │   │
│  └─────────────┘   │
│                     │
│  最近の村の活動      │
│  ・田中さんが参拝    │
│  ・レア御朱印発見！  │
│                     │
│  週間ランキング      │
│  1位 渋谷村 1250pt  │
│                     │
└─────────────────────┘
        [参拝する]← FABボタン
```

### 参拝フロー（シンプル化）
1. **FABタップ** → カメラ起動
2. **QRスキャン/位置確認** → 自動認識
3. **参拝アニメーション** → 3秒
4. **報酬画面** → 御朱印NFT表示
5. **共有画面** → Twitter/Instagram連携

## 🗄️ データ構造

### ユーザーデータ
```typescript
interface User {
  id: string;
  name: string;
  level: number; // 神職レベル
  streak: number; // 連続参拝日数
  villageId: string;
  totalVisits: number;
  goshuinCollection: GoshuinNFT[];
  badges: Badge[];
  weeklyContribution: number;
}
```

### 参拝記録
```typescript
interface VisitRecord {
  userId: string;
  shrineId: string;
  timestamp: number;
  location: GeoLocation;
  reward: {
    goshuinId?: string;
    prayerCard?: PrayerCard;
    points: number;
  };
  photo?: string;
}
```

### 村データ
```typescript
interface Village {
  id: string;
  name: string;
  guardianDeity: GuardianDeity;
  weeklyScore: number;
  activeUsers: User[];
  culturalAssets: CulturalAsset[];
  ranking: number;
}
```

## 🚀 実装優先順位

### Phase 1: Core Loop（2週間）
1. 参拝FABボタン
2. QRコード/位置情報認識
3. 基本的な御朱印NFT生成
4. 参拝ストリーク機能

### Phase 2: Variable Rewards（2週間）
1. レア度システム
2. 季節限定コンテンツ
3. ガチャ演出
4. 報酬アニメーション

### Phase 3: Social Features（2週間）
1. 村ランキング
2. フレンドシステム
3. リアルタイムフィード
4. 週間MVP

### Phase 4: Gamification（2週間）
1. 神職レベルシステム
2. バッジコレクション
3. 守護神ストーリー
4. 特別イベント

## 📊 KPI設定

### Engagement Metrics
- **DAU/MAU比率**: 目標 40%以上
- **平均参拝頻度**: 週4回以上
- **7日間継続率**: 60%以上
- **30日間継続率**: 30%以上

### Growth Metrics
- **招待による新規ユーザー**: 20%
- **村あたりアクティブユーザー**: 50人以上
- **SNS共有率**: 30%以上

### Monetization Metrics
- **NFTミント率**: 参拝の80%
- **プレミアム機能利用率**: 10%
- **平均課金額**: 月500円