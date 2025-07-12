
import React, { useState, useEffect } from 'react';
import AccountStatus from '../../common/AccountStatus';
import './Profile.css';
import { useAccountAbstraction } from '../../../hooks/useAccountAbstraction';
import { calculateLevel, calculateLevelProgress } from '../../../utils';

// 文化帯ランキングシステム
const CULTURAL_BELTS = [
  { name: '白帯', minCapital: 0, maxCapital: 99, color: '#FFFFFF', icon: '⚪' },
  { name: '黄帯', minCapital: 100, maxCapital: 299, color: '#FFD700', icon: '🟡' },
  { name: '橙帯', minCapital: 300, maxCapital: 499, color: '#FF8C00', icon: '🟠' },
  { name: '緑帯', minCapital: 500, maxCapital: 999, color: '#32CD32', icon: '🟢' },
  { name: '青帯', minCapital: 1000, maxCapital: 1999, color: '#4169E1', icon: '🔵' },
  { name: '紫帯', minCapital: 2000, maxCapital: 3999, color: '#8B008B', icon: '🟣' },
  { name: '茶帯', minCapital: 4000, maxCapital: 5999, color: '#8B4513', icon: '🟤' },
  { name: '黒帯', minCapital: 6000, maxCapital: 7999, color: '#000000', icon: '⚫' },
  { name: '赤帯', minCapital: 8000, maxCapital: 9999, color: '#DC143C', icon: '🔴' },
  { name: '金帯', minCapital: 10000, maxCapital: Infinity, color: '#FFD700', icon: '👑' }
];

interface UserStats {
  culturalCapital: number;
  totalVisits: number;
  streak: number;
  longestStreak: number;
  totalPrayers: number;
  nftCount: number;
  experience: number;
  level: number;
  lastVisitDate: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

const Profile: React.FC = () => {
  const { account, isReady } = useAccountAbstraction();
  const [userStats, setUserStats] = useState<UserStats>({
    culturalCapital: 0,
    totalVisits: 0,
    streak: 0,
    longestStreak: 0,
    totalPrayers: 0,
    nftCount: 0,
    experience: 0,
    level: 1,
    lastVisitDate: new Date().toISOString()
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first_visit', name: '初参拝', description: '初めての参拝を完了', icon: '🌟', unlocked: false },
    { id: 'week_streak', name: '一週間継続', description: '7日連続参拝達成', icon: '🔥', unlocked: false },
    { id: 'month_streak', name: '月間継続', description: '30日連続参拝達成', icon: '🏆', unlocked: false },
    { id: 'collector', name: 'コレクター', description: 'NFTを10個収集', icon: '🎁', unlocked: false },
    { id: 'devotee', name: '信心深き者', description: '100回参拝達成', icon: '🙏', unlocked: false },
    { id: 'cultured', name: '文化の守護者', description: '文化資本1000達成', icon: '⛩️', unlocked: false },
  ]);

  // ユーザー統計を読み込み
  useEffect(() => {
    const loadUserStats = () => {
      try {
        const savedStats = localStorage.getItem('userStats');
        if (savedStats) {
          const stats = JSON.parse(savedStats);
          setUserStats(stats);
        }
        
        // NFT数を取得
        const savedNFTs = JSON.parse(localStorage.getItem('shrineNFTs') || '[]');
        setUserStats(prev => ({ ...prev, nftCount: savedNFTs.length }));
      } catch (error) {
        console.error('統計読み込みエラー:', error);
      }
    };

    loadUserStats();
    
    // アチーブメントチェック
    checkAchievements();
  }, [isReady]);

  // アチーブメントチェック
  const checkAchievements = () => {
    setAchievements(prev => prev.map(achievement => {
      let unlocked = achievement.unlocked;
      
      switch (achievement.id) {
        case 'first_visit':
          unlocked = userStats.totalVisits >= 1;
          break;
        case 'week_streak':
          unlocked = userStats.streak >= 7;
          break;
        case 'month_streak':
          unlocked = userStats.streak >= 30;
          break;
        case 'collector':
          unlocked = userStats.nftCount >= 10;
          break;
        case 'devotee':
          unlocked = userStats.totalPrayers >= 100;
          break;
        case 'cultured':
          unlocked = userStats.culturalCapital >= 1000;
          break;
      }
      
      return { ...achievement, unlocked };
    }));
  };

  // 現在の文化帯を取得
  const getCurrentBelt = () => {
    const belt = CULTURAL_BELTS.find(belt => 
      userStats.culturalCapital >= belt.minCapital && 
      userStats.culturalCapital <= belt.maxCapital
    );
    return belt || CULTURAL_BELTS[0]!;
  };

  // 次の帯までの進捗を計算
  const getBeltProgress = () => {
    const currentBelt = getCurrentBelt();
    const currentIndex = CULTURAL_BELTS.indexOf(currentBelt);
    
    if (currentIndex === CULTURAL_BELTS.length - 1) {
      return 100; // 最高帯
    }
    
    const nextBelt = CULTURAL_BELTS[currentIndex + 1];
    if (!nextBelt) return 100;
    
    const progress = ((userStats.culturalCapital - currentBelt.minCapital) / 
                     (nextBelt.minCapital - currentBelt.minCapital)) * 100;
    
    return Math.min(100, Math.max(0, progress));
  };

  const currentBelt = getCurrentBelt();
  const beltProgress = getBeltProgress();
  const levelProgress = calculateLevelProgress(userStats.experience);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>👤 プロフィール</h2>
        <p className="profile-subtitle">あなたの参拝記録と成長</p>
      </div>
      
      <div className="profile-content">
        {/* アカウント情報 */}
        <section className="profile-section">
          <AccountStatus showDetails={true} />
        </section>

        {/* 文化帯ランキング */}
        <section className="profile-section belt-section">
          <h3>🥋 文化帯ランキング</h3>
          <div className="belt-display">
            <div className="current-belt">
              <span className="belt-icon" style={{ color: currentBelt.color }}>
                {currentBelt.icon}
              </span>
              <div className="belt-info">
                <h4>{currentBelt.name}</h4>
                <p className="cultural-capital">文化資本: {userStats.culturalCapital}</p>
              </div>
            </div>
            <div className="belt-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${beltProgress}%`,
                    backgroundColor: currentBelt.color
                  }}
                />
              </div>
              <p className="progress-text">
                次の帯まで: {CULTURAL_BELTS[CULTURAL_BELTS.indexOf(currentBelt) + 1]?.minCapital 
                  ? CULTURAL_BELTS[CULTURAL_BELTS.indexOf(currentBelt) + 1]!.minCapital - userStats.culturalCapital 
                  : '最高帯達成！'}
              </p>
            </div>
          </div>
        </section>

        {/* 参拝統計 */}
        <section className="profile-section stats-section">
          <h3>📊 参拝統計</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <p className="stat-value">{userStats.streak}</p>
                <p className="stat-label">連続参拝</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⛩️</div>
              <div className="stat-info">
                <p className="stat-value">{userStats.totalVisits}</p>
                <p className="stat-label">総参拝回数</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎁</div>
              <div className="stat-info">
                <p className="stat-value">{userStats.nftCount}</p>
                <p className="stat-label">NFT収集数</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-info">
                <p className="stat-value">Lv.{userStats.level}</p>
                <p className="stat-label">レベル</p>
              </div>
            </div>
          </div>
        </section>

        {/* アチーブメント */}
        <section className="profile-section achievements-section">
          <h3>🏆 実績</h3>
          <div className="achievements-grid">
            {achievements.map(achievement => (
              <div 
                key={achievement.id}
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <p className="achievement-name">{achievement.name}</p>
                  <p className="achievement-desc">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* その他のプロフィール設定 */}
        <section className="profile-section">
          <h3>🎨 アプリ設定</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <span className="setting-label">🔔 通知設定</span>
              <button className="setting-button">設定</button>
            </div>
            <div className="setting-item">
              <span className="setting-label">🌙 ダークモード</span>
              <button className="setting-button">オフ</button>
            </div>
            <div className="setting-item">
              <span className="setting-label">🎵 BGM設定</span>
              <button className="setting-button">設定</button>
            </div>
          </div>
        </section>

        {/* アプリ情報 */}
        <section className="profile-section">
          <h3>ℹ️ アプリについて</h3>
          <div className="app-info">
            <div className="info-item">
              <span className="info-label">バージョン:</span>
              <span className="info-value">2.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">技術:</span>
              <span className="info-value">Account Abstraction</span>
            </div>
            <div className="info-item">
              <span className="info-label">ネットワーク:</span>
              <span className="info-value">StarkNet Testnet</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
