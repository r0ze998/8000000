# 実装計画書 - 8000000 習慣化アプリ

## 📁 新しいファイル構造

```
src/
├── core/                    # コア機能
│   ├── hooks/
│   │   ├── useHabitLoop.js      # Hookedモデルの実装
│   │   ├── useLocation.js       # 位置情報
│   │   └── useCamera.js         # QRスキャン
│   ├── services/
│   │   ├── VisitService.js      # 参拝ロジック
│   │   ├── RewardService.js     # 報酬システム
│   │   └── NFTService.js        # NFTミント
│   └── constants/
│       ├── rewards.js           # 報酬定義
│       └── shrines.js           # 神社データ
│
├── features/               # 機能別モジュール
│   ├── visit/             # 参拝機能
│   │   ├── VisitFAB.js         # 参拝ボタン
│   │   ├── QRScanner.js        # QRスキャナー
│   │   ├── VisitAnimation.js   # 参拝演出
│   │   └── RewardModal.js      # 報酬表示
│   │
│   ├── goshuin/           # 御朱印
│   │   ├── GoshuinNFT.js       # NFTコンポーネント
│   │   ├── GoshuinGallery.js   # コレクション
│   │   └── GoshuinShare.js     # SNS共有
│   │
│   ├── village/           # 村システム
│   │   ├── VillageHub.js       # 村のハブ画面
│   │   ├── GuardianDeity.js    # 守護神
│   │   ├── VillageRanking.js   # ランキング
│   │   └── WeeklyMVP.js        # 週間MVP
│   │
│   └── gamification/      # ゲーミフィケーション
│       ├── LevelSystem.js      # 神職レベル
│       ├── BadgeCollection.js  # バッジ
│       ├── StreakTracker.js    # ストリーク
│       └── SeasonalEvents.js   # 季節イベント
│
├── ui/                     # UI基盤
│   ├── components/
│   │   ├── FAB.js              # Floating Action Button
│   │   ├── RewardCard.js       # 報酬カード
│   │   └── ProgressRing.js     # 進捗リング
│   └── screens/
│       ├── HomeScreen.js       # ホーム画面
│       ├── ProfileScreen.js    # プロフィール
│       └── VillageScreen.js    # 村画面
│
└── blockchain/            # ブロックチェーン
    ├── contracts/
    │   ├── GoshuinNFT.cairo    # NFTコントラクト
    │   └── VillageDAO.cairo    # 村DAO
    └── hooks/
        ├── useNFTMint.js       # NFTミント
        └── useContract.js      # コントラクト連携
```

## 🎨 コンポーネント詳細設計

### 1. VisitFAB（参拝ボタン）
```javascript
// features/visit/VisitFAB.js
import React from 'react';
import { motion } from 'framer-motion';
import { useHabitLoop } from '../../core/hooks/useHabitLoop';

const VisitFAB = () => {
  const { triggerVisit, canVisit, nearbyShrine } = useHabitLoop();
  
  return (
    <motion.div
      className="visit-fab"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        boxShadow: canVisit 
          ? '0 0 30px rgba(255, 100, 100, 0.8)' 
          : '0 2px 10px rgba(0,0,0,0.2)'
      }}
    >
      <button 
        onClick={triggerVisit}
        disabled={!canVisit}
        className="fab-button"
      >
        <span className="icon">⛩️</span>
        <span className="text">参拝する</span>
        {nearbyShrine && (
          <span className="shrine-name">{nearbyShrine.name}</span>
        )}
      </button>
    </motion.div>
  );
};
```

### 2. QRScanner（QRスキャナー）
```javascript
// features/visit/QRScanner.js
import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useLocation } from '../../core/hooks/useLocation';

const QRScanner = ({ onScan, onLocationVerified }) => {
  const { currentLocation, verifyShrine } = useLocation();
  
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    });
    
    scanner.render(onScanSuccess, onScanFailure);
    
    // 位置情報も並行してチェック
    checkLocationVerification();
  }, []);
  
  const onScanSuccess = (decodedText) => {
    // QRコードから神社IDを抽出
    const shrineId = parseQRCode(decodedText);
    onScan(shrineId);
  };
  
  const checkLocationVerification = async () => {
    const shrine = await verifyShrine(currentLocation);
    if (shrine) {
      onLocationVerified(shrine);
    }
  };
  
  return (
    <div className="qr-scanner">
      <div id="qr-reader" />
      <p className="hint">QRコードをスキャン、または位置情報で確認中...</p>
    </div>
  );
};
```

### 3. RewardModal（報酬モーダル）
```javascript
// features/visit/RewardModal.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const RewardModal = ({ reward, onClose, onShare }) => {
  const [revealing, setRevealing] = useState(true);
  
  useEffect(() => {
    if (reward.rarity >= 4) { // SR以上
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [reward]);
  
  return (
    <AnimatePresence>
      <motion.div
        className="reward-modal"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <div className="reward-container">
          {revealing ? (
            <motion.div
              className="mystery-box"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              onClick={() => setRevealing(false)}
            >
              <span className="tap-hint">タップして開封</span>
            </motion.div>
          ) : (
            <motion.div
              className="reward-content"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className={`goshuin-card rarity-${reward.rarity}`}>
                <img src={reward.image} alt={reward.name} />
                <h3>{reward.name}</h3>
                <p className="blessing">{reward.blessing}</p>
                <div className="metadata">
                  <span>{new Date().toLocaleDateString('ja-JP')}</span>
                  <span>{reward.shrineName}</span>
                </div>
              </div>
              
              <div className="actions">
                <button onClick={onShare} className="share-button">
                  SNSで共有
                </button>
                <button onClick={onClose} className="close-button">
                  閉じる
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
```

### 4. VillageHub（村のハブ画面）
```javascript
// features/village/VillageHub.js
import React from 'react';
import { useVillage } from '../../core/hooks/useVillage';
import GuardianDeity from './GuardianDeity';
import VillageRanking from './VillageRanking';
import ActivityFeed from './ActivityFeed';

const VillageHub = () => {
  const { village, guardianDeity, ranking, activities } = useVillage();
  
  return (
    <div className="village-hub">
      <GuardianDeity deity={guardianDeity} />
      
      <div className="village-stats">
        <div className="stat-card">
          <h4>今週の文化貢献度</h4>
          <p className="score">{village.weeklyScore.toLocaleString()}</p>
          <span className="rank">全国{ranking}位</span>
        </div>
        
        <div className="stat-card">
          <h4>アクティブ氏子</h4>
          <p className="count">{village.activeUsers}人</p>
          <span className="growth">+{village.weeklyGrowth}%</span>
        </div>
      </div>
      
      <ActivityFeed activities={activities} />
      
      <VillageRanking />
    </div>
  );
};
```

### 5. useHabitLoop（習慣化フック）
```javascript
// core/hooks/useHabitLoop.js
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from './useLocation';
import { useNotifications } from './useNotifications';
import VisitService from '../services/VisitService';
import RewardService from '../services/RewardService';

export const useHabitLoop = () => {
  const [state, setState] = useState({
    canVisit: false,
    nearbyShrine: null,
    lastVisit: null,
    streak: 0
  });
  
  const { currentLocation } = useLocation();
  const { scheduleNotification } = useNotifications();
  
  // External Triggers
  useEffect(() => {
    // 位置情報トリガー
    checkNearbyShrine();
    
    // 時間トリガー（朝の通知）
    scheduleMorningReminder();
    
    // 社会的トリガー
    subscribeToFriendActivities();
  }, [currentLocation]);
  
  // Action
  const triggerVisit = useCallback(async () => {
    setState(prev => ({ ...prev, isVisiting: true }));
    
    try {
      // 1タップで参拝完了
      const visit = await VisitService.quickVisit(state.nearbyShrine);
      
      // Variable Reward
      const reward = await RewardService.generateReward(visit);
      
      // Investment
      await NFTService.mint(reward);
      
      // Update state
      updateStreak();
      scheduleNextReminder();
      
      return { visit, reward };
    } catch (error) {
      console.error('Visit failed:', error);
    }
  }, [state.nearbyShrine]);
  
  return {
    ...state,
    triggerVisit
  };
};
```

## 🗓️ 実装スケジュール

### Week 1-2: Core Habit Loop
- [ ] VisitFAB実装
- [ ] QRScanner/位置情報認証
- [ ] 基本的な参拝フロー
- [ ] 報酬生成ロジック

### Week 3-4: NFT & Rewards
- [ ] GoshuinNFTコントラクト
- [ ] NFTミント機能
- [ ] 報酬アニメーション
- [ ] SNS共有機能

### Week 5-6: Village System
- [ ] 村データ構造
- [ ] 守護神システム
- [ ] ランキング機能
- [ ] アクティビティフィード

### Week 7-8: Gamification
- [ ] 神職レベルシステム
- [ ] バッジコレクション
- [ ] ストリーク追跡
- [ ] 季節イベント

## 📱 画面遷移図

```
┌─────────┐     ┌──────────┐     ┌──────────┐
│  起動   │ --> │ ホーム    │ --> │ 村画面    │
└─────────┘     └─────┬────┘     └──────────┘
                      │
                      ↓ FABタップ
                ┌──────────┐
                │QRスキャン │
                └─────┬────┘
                      ↓
                ┌──────────┐
                │参拝演出   │
                └─────┬────┘
                      ↓
                ┌──────────┐     ┌──────────┐
                │報酬獲得   │ --> │SNS共有   │
                └──────────┘     └──────────┘
```

## 🔥 パフォーマンス最適化

1. **遅延読み込み**
   - QRスキャナーは必要時のみ
   - NFT画像の段階的読み込み

2. **キャッシュ戦略**
   - 神社データのローカルキャッシュ
   - 画像のService Worker活用

3. **バンドルサイズ削減**
   - Code Splitting
   - Tree Shaking
   - 画像最適化