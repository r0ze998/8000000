import React, { useState, useEffect } from 'react';
import ShrineVillageApp from './ShrineVillageApp';
import CommunityHub from './components/CommunityHub';
import SpecialEvents from './components/SpecialEvents';
import { COMPLETE_SHRINE_DATABASE } from './data/expandedShrineDatabase';
import './DemoApp.css';

const DemoApp = () => {
  const [activeTab, setActiveTab] = useState('village');
  const [userProfile, setUserProfile] = useState({
    name: 'デモユーザー',
    culturalCapital: 450,
    level: 5,
    goshuinCount: 25,
    visitedShrines: 32,
    achievements: ['初参拝', '文化愛好家', '御朱印コレクター'],
    joinedDate: '2024-01-15',
    favoriteRegion: '関西'
  });
  
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalShrines: COMPLETE_SHRINE_DATABASE.length,
    totalVisits: 15623,
    activeEvents: 4
  });

  useEffect(() => {
    // デモ用の通知を設定
    const demoNotifications = [
      {
        id: 1,
        type: 'achievement',
        title: '新しい文化帯を獲得！',
        message: '紫帯に昇段しました！文化の継承者として認定されました。',
        timestamp: Date.now() - 300000 // 5分前
      },
      {
        id: 2,
        type: 'event',
        title: '桜まつり開催中',
        message: '全国の桜の名所で特別NFTが獲得できます！',
        timestamp: Date.now() - 3600000 // 1時間前
      },
      {
        id: 3,
        type: 'community',
        title: '新しい文化体験投稿',
        message: '山田さんが伏見稲荷大社での体験を共有しました。',
        timestamp: Date.now() - 7200000 // 2時間前
      }
    ];
    
    setNotifications(demoNotifications);
  }, []);

  const tabs = [
    { 
      id: 'village', 
      name: '🏘️ マイ神社',
      description: 'あなたの文化村を管理'
    },
    { 
      id: 'community', 
      name: '👥 コミュニティ',
      description: '文化体験を共有'
    },
    { 
      id: 'events', 
      name: '🎌 特別イベント',
      description: '限定NFTと季節イベント'
    },
    { 
      id: 'database', 
      name: '🗾 全国マップ',
      description: '神社・寺院データベース'
    }
  ];

  const handleCommunityPost = (post) => {
    // コミュニティ投稿時の処理
    setUserProfile(prev => ({
      ...prev,
      culturalCapital: prev.culturalCapital + 10
    }));
    
    // 通知追加
    const newNotification = {
      id: Date.now(),
      type: 'community',
      title: '投稿完了',
      message: '文化体験を共有しました！+10文化資本',
      timestamp: Date.now()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleEventParticipation = (event) => {
    // イベント参加時の処理
    setUserProfile(prev => ({
      ...prev,
      culturalCapital: prev.culturalCapital + event.culturalValue,
      achievements: [...prev.achievements, event.specialReward]
    }));
    
    // 通知追加
    const newNotification = {
      id: Date.now(),
      type: 'achievement',
      title: 'イベント参加完了',
      message: `${event.eventName}に参加し、${event.specialReward}を獲得しました！`,
      timestamp: Date.now()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diffMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes}分前`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}時間前`;
    return `${Math.floor(diffMinutes / 1440)}日前`;
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="demo-app">
      {/* ヘッダー */}
      <header className="demo-header">
        <div className="header-brand">
          <h1>⛩️ Cultural Shrine Village</h1>
          <p>文化をつなぐ、心をつなぐ</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-number">{stats.totalUsers.toLocaleString()}</div>
            <div className="stat-label">参加者数</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalShrines}</div>
            <div className="stat-label">収録神社・寺院</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalVisits.toLocaleString()}</div>
            <div className="stat-label">総参拝記録</div>
          </div>
        </div>
        
        <div className="user-profile-mini">
          <div className="profile-info">
            <div className="profile-name">{userProfile.name}</div>
            <div className="profile-capital">💰 {userProfile.culturalCapital} 文化資本</div>
          </div>
          <div className="profile-level">Lv.{userProfile.level}</div>
        </div>
      </header>

      {/* 通知パネル */}
      {notifications.length > 0 && (
        <div className="notifications-panel">
          <h3>🔔 お知らせ</h3>
          <div className="notifications-list">
            {notifications.slice(0, 3).map(notification => (
              <div key={notification.id} className={`notification ${notification.type}`}>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">{formatTimeAgo(notification.timestamp)}</div>
                </div>
                <button 
                  className="dismiss-btn"
                  onClick={() => dismissNotification(notification.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* タブナビゲーション */}
      <nav className="demo-nav">
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="tab-name">{tab.name}</div>
              <div className="tab-description">{tab.description}</div>
            </button>
          ))}
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="demo-main">
        {activeTab === 'village' && (
          <ShrineVillageApp userProfile={userProfile} />
        )}
        
        {activeTab === 'community' && (
          <CommunityHub 
            userProfile={userProfile}
            onAddPost={handleCommunityPost}
          />
        )}
        
        {activeTab === 'events' && (
          <SpecialEvents 
            onEventParticipate={handleEventParticipation}
            userLocation={userProfile.favoriteRegion}
          />
        )}
        
        {activeTab === 'database' && (
          <div className="database-view">
            <div className="database-header">
              <h2>🗾 全国神社・寺院マップ</h2>
              <p>全国{COMPLETE_SHRINE_DATABASE.length}箇所の神社・寺院データベース</p>
            </div>
            
            <div className="database-stats">
              <div className="region-stats">
                <h3>地域別収録数</h3>
                <div className="region-grid">
                  <div className="region-item">
                    <div className="region-name">関東</div>
                    <div className="region-count">45箇所</div>
                  </div>
                  <div className="region-item">
                    <div className="region-name">関西</div>
                    <div className="region-count">38箇所</div>
                  </div>
                  <div className="region-item">
                    <div className="region-name">中部</div>
                    <div className="region-count">32箇所</div>
                  </div>
                  <div className="region-item">
                    <div className="region-name">九州</div>
                    <div className="region-count">28箇所</div>
                  </div>
                </div>
              </div>
              
              <div className="feature-highlights">
                <h3>特徴</h3>
                <ul>
                  <li>🏛️ 国宝・重要文化財指定建造物</li>
                  <li>🌍 世界遺産登録神社・寺院</li>
                  <li>📿 御朱印対応状況</li>
                  <li>🎭 年中行事・祭り情報</li>
                  <li>📍 GPS座標・アクセス情報</li>
                  <li>🎨 文化財・美術品情報</li>
                </ul>
              </div>
            </div>
            
            <div className="coming-soon">
              <h3>🚧 開発中の機能</h3>
              <ul>
                <li>インタラクティブマップ表示</li>
                <li>ルート検索・巡礼プランナー</li>
                <li>リアルタイム混雑状況</li>
                <li>バーチャル参拝機能</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="demo-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Cultural Shrine Village</h4>
            <p>ブロックチェーン技術で文化をつなぐ</p>
          </div>
          
          <div className="footer-section">
            <h4>技術</h4>
            <ul>
              <li>Starknet (Cairo)</li>
              <li>React.js</li>
              <li>SVG Graphics</li>
              <li>Web Audio API</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>機能</h4>
            <ul>
              <li>NFT文化記録</li>
              <li>文化帯ランク</li>
              <li>コミュニティ共有</li>
              <li>特別イベント</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>リンク</h4>
            <ul>
              <li><a href="https://github.com/r0ze998/cultural-shrine-village-starknet" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>ホワイトペーパー</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>API文書</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>🤖 Built with Claude Code | 文化をデジタルで永続保存</p>
        </div>
      </footer>
    </div>
  );
};

export default DemoApp;