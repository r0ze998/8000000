/**
 * Main Application Component (Refactored)
 * メインアプリケーションコンポーネント - リファクタリング版
 */

import CulturalIdentityDashboard from '../src/components/CulturalIdentityDashboard';
import StoryCreationSystem from '../src/components/StoryCreationSystem';
import { MobileTabNavigation } from '../src/components/navigation';
import NFTHakoniwa from '../src/components/NFTHakoniwa';
import { useAppState } from '../src/hooks/useAppState';
import { useBGM } from '../src/hooks/useBGM';

export default function Home() {
  // カスタムフックから状態とアクションを取得
  const {
    activeTab,
    showStoryCreation,
    showFullDashboard,
    hasNotification,
    isDarkMode,
    mockData,
    currentStreak,
    todayVisited,
    userLevel,
    setActiveTab,
    setShowStoryCreation,
    setShowFullDashboard,
    toggleDarkMode,
    handleHakoniwaSave,
    handleStoryComplete,
    startVisitExperience
  } = useAppState();

  const {
    currentBGM,
    isBGMPlaying,
    bgmTracks,
    toggleBGM,
    changeBGM
  } = useBGM();

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* ヘッダー */}
      <div className="header">
        <div className="app-title">
          <span className="icon">⛩️</span>
          <span className="title">8000000</span>
        </div>
        <div className="user-status">
          <div className="controls">
            {/* BGM制御 */}
            <button 
              className="control-button"
              onClick={toggleBGM}
              title={isBGMPlaying ? 'BGMを停止' : 'BGMを再生'}
            >
              {isBGMPlaying ? '🔊' : '🔇'}
            </button>
            
            {/* ダークモード切り替え */}
            <button 
              className="control-button"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'ライトモード' : 'ダークモード'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="status-badges">
            <span className={`level-badge level-${userLevel}`}>
              Lv.{userLevel}
            </span>
            <span className="streak-badge">{currentStreak}日連続</span>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="main-content">
        
        {/* ホームタブ */}
        {activeTab === 'home' && (
          <>
            {/* 今日の参拝状況 */}
            <div className="today-section">
              <h2>今日の参拝</h2>
              {todayVisited ? (
                <div className="today-completed">
                  <div className="completion-icon">✅</div>
                  <div className="completion-text">
                    <div className="main-text">今日の参拝完了</div>
                    <div className="sub-text">素晴らしい習慣ですね！</div>
                  </div>
                </div>
              ) : (
                <div className="today-pending">
                  <div className="pending-icon">🙏</div>
                  <div className="pending-text">
                    <div className="main-text">今日はまだ参拝していません</div>
                    <div className="sub-text">習慣を続けて {currentStreak + 1} 日連続を目指しましょう</div>
                  </div>
                </div>
              )}
            </div>

            {/* クイックアクション */}
            <div className="quick-actions">
              <h3>クイックアクション</h3>
              <div className="action-buttons">
                <button 
                  className="action-btn primary"
                  onClick={startVisitExperience}
                >
                  <span className="icon">📝</span>
                  <span className="text">参拝体験を記録</span>
                </button>
                
                <button 
                  className="action-btn secondary"
                  onClick={() => setShowFullDashboard(true)}
                >
                  <span className="icon">📊</span>
                  <span className="text">文化アイデンティティ</span>
                </button>
              </div>
            </div>

            {/* 最近の参拝履歴 */}
            <div className="recent-visits">
              <h3>最近の参拝</h3>
              {mockData?.visits?.map(visit => (
                <div key={visit.id} className="visit-item">
                  <span className="visit-shrine">{visit.shrineName}</span>
                  <span className="visit-date">{visit.date}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* 参拝タブ */}
        {activeTab === 'visit' && (
          <div className="tab-content">
            <h2>参拝記録</h2>
            <div className="visit-options">
              <button 
                className="visit-btn main"
                onClick={startVisitExperience}
              >
                <span className="icon">⛩️</span>
                <span>体験を記録する</span>
              </button>
            </div>
            
            <div className="recent-visits">
              <h3>最近の参拝</h3>
              {mockData?.visits?.map(visit => (
                <div key={visit.id} className="visit-item">
                  <span className="visit-shrine">{visit.shrineName}</span>
                  <span className="visit-date">{visit.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* my神社タブ */}
        {activeTab === 'collection' && (
          <div style={{ 
            padding: 0, 
            height: 'calc(100vh - 150px)', 
            width: '100%',
            overflow: 'hidden'
          }}>
            <NFTHakoniwa 
              userNFTs={mockData?.nfts || []}
              userSBTs={mockData?.sbts || []}
              userLevel={userLevel}
              onHakoniwaSave={handleHakoniwaSave}
            />
          </div>
        )}

        {/* 探索タブ */}
        {activeTab === 'explore' && (
          <div className="tab-content">
            <h2>神社を探索</h2>
            <div className="explore-options">
              <div className="explore-card">
                <span className="icon">📍</span>
                <span>近くの神社</span>
              </div>
              <div className="explore-card">
                <span className="icon">🗾</span>
                <span>神社マップ</span>
              </div>
              <div className="explore-card">
                <span className="icon">🏆</span>
                <span>人気の神社</span>
              </div>
              <div className="explore-card">
                <span className="icon">🎌</span>
                <span>季節の神社</span>
              </div>
            </div>
          </div>
        )}

        {/* プロフィールタブ */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            <h2>プロフィール</h2>
            <div className="profile-header">
              <div className="avatar">👤</div>
              <div className="profile-info">
                <div className="profile-name">参拝者</div>
                <div className="profile-level">レベル {userLevel}</div>
              </div>
            </div>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-number">{currentStreak}</span>
                <span className="stat-label">連続日数</span>
              </div>
              <div className="profile-stat">
                <span className="stat-number">{mockData?.visits?.length || 0}</span>
                <span className="stat-label">総参拝数</span>
              </div>
              <div className="profile-stat">
                <span className="stat-number">{mockData?.nfts?.length || 0}</span>
                <span className="stat-label">記録数</span>
              </div>
            </div>

            {/* BGM設定 */}
            <div className="settings-section">
              <h3>BGM設定</h3>
              <div className="bgm-status">
                <span>現在の音楽: {bgmTracks[currentBGM].emoji} {bgmTracks[currentBGM].name}</span>
                <span className={`bgm-indicator ${isBGMPlaying ? 'playing' : 'stopped'}`}>
                  {isBGMPlaying ? '再生中' : '停止中'}
                </span>
              </div>
              
              <div className="bgm-selector">
                {Object.entries(bgmTracks).map(([key, track]) => (
                  <button
                    key={key}
                    className={`bgm-option ${currentBGM === key ? 'active' : ''}`}
                    onClick={() => changeBGM(key)}
                  >
                    <span className="bgm-emoji">{track.emoji}</span>
                    <div className="bgm-info">
                      <div className="bgm-name">{track.name}</div>
                      <div className="bgm-desc">{track.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bgm-controls">
                <button className="bgm-control-btn" onClick={toggleBGM}>
                  {isBGMPlaying ? '🔇 BGM停止' : '🔊 BGM再生'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* フッターナビゲーション */}
      <MobileTabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        hasNotification={hasNotification}
      />

      {/* モーダル */}
      {showStoryCreation && (
        <StoryCreationSystem
          visitData={{
            shrineName: '体験神社',
            date: new Date().toISOString().split('T')[0],
            weather: 'clear',
            timeOfDay: 'morning'
          }}
          onStoryComplete={handleStoryComplete}
          onCancel={() => setShowStoryCreation(false)}
        />
      )}

      {showFullDashboard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <CulturalIdentityDashboard 
              userData={mockData}
              onClose={() => setShowFullDashboard(false)}
            />
          </div>
        </div>
      )}

      {/* スタイル */}
      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: ${isDarkMode ? '#1a1a1a' : '#f5f5f5'};
          color: ${isDarkMode ? '#ffffff' : '#333333'};
          transition: all 0.3s ease;
        }

        .app-container.dark-mode {
          background: #1a1a1a;
          color: #ffffff;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: ${isDarkMode ? '#2d2d2d' : 'white'};
          border-bottom: 1px solid ${isDarkMode ? '#404040' : '#e0e0e0'};
        }

        .app-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .app-title .icon {
          font-size: 24px;
        }

        .app-title .title {
          font-size: 20px;
          font-weight: bold;
        }

        .user-status {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .controls {
          display: flex;
          gap: 8px;
        }

        .control-button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .control-button:hover {
          background: ${isDarkMode ? '#404040' : '#f0f0f0'};
        }

        .status-badges {
          display: flex;
          gap: 8px;
        }

        .level-badge, .streak-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }

        .level-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .streak-badge {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }

        .main-content {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          padding-bottom: 100px;
        }

        .today-section {
          background: ${isDarkMode ? '#2d2d2d' : 'white'};
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .today-section h2 {
          margin: 0 0 15px 0;
          font-size: 18px;
        }

        .today-completed, .today-pending {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .completion-icon, .pending-icon {
          font-size: 48px;
        }

        .main-text {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .sub-text {
          font-size: 14px;
          color: ${isDarkMode ? '#aaaaaa' : '#666666'};
        }

        .quick-actions {
          background: ${isDarkMode ? '#2d2d2d' : 'white'};
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .quick-actions h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .action-btn.secondary {
          background: ${isDarkMode ? '#404040' : '#f0f0f0'};
          color: ${isDarkMode ? '#ffffff' : '#333333'};
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .action-btn .icon {
          font-size: 20px;
        }

        .recent-visits {
          background: ${isDarkMode ? '#2d2d2d' : 'white'};
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .recent-visits h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
        }

        .visit-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid ${isDarkMode ? '#404040' : '#f0f0f0'};
        }

        .visit-item:last-child {
          border-bottom: none;
        }

        .visit-shrine {
          font-weight: bold;
        }

        .visit-date {
          color: ${isDarkMode ? '#aaaaaa' : '#666666'};
          font-size: 14px;
        }

        .tab-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .explore-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 20px;
        }

        .explore-card {
          background: ${isDarkMode ? '#2d2d2d' : 'white'};
          border-radius: 15px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: transform 0.2s;
        }

        .explore-card:hover {
          transform: translateY(-5px);
        }

        .explore-card .icon {
          font-size: 32px;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${isDarkMode ? '#404040' : '#f0f0f0'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .profile-name {
          font-size: 18px;
          font-weight: bold;
        }

        .profile-level {
          font-size: 14px;
          color: ${isDarkMode ? '#aaaaaa' : '#666666'};
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }

        .profile-stat {
          text-align: center;
          padding: 15px;
          background: ${isDarkMode ? '#2d2d2d' : 'white'};
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 12px;
          color: ${isDarkMode ? '#aaaaaa' : '#666666'};
        }

        .settings-section {
          background: ${isDarkMode ? '#2d2d2d' : 'white'};
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .settings-section h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
        }

        .bgm-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding: 10px;
          background: ${isDarkMode ? '#1a1a1a' : '#f8f9fa'};
          border-radius: 8px;
        }

        .bgm-indicator {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }

        .bgm-indicator.playing {
          background: #4CAF50;
          color: white;
        }

        .bgm-indicator.stopped {
          background: #9E9E9E;
          color: white;
        }

        .bgm-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 15px;
        }

        .bgm-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 2px solid ${isDarkMode ? '#404040' : '#e0e0e0'};
          border-radius: 8px;
          background: ${isDarkMode ? '#1a1a1a' : 'white'};
          cursor: pointer;
          transition: all 0.2s;
        }

        .bgm-option.active {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .bgm-option:hover {
          background: ${isDarkMode ? '#404040' : '#f0f0f0'};
        }

        .bgm-emoji {
          font-size: 20px;
        }

        .bgm-name {
          font-weight: bold;
          margin-bottom: 2px;
        }

        .bgm-desc {
          font-size: 12px;
          color: ${isDarkMode ? '#aaaaaa' : '#666666'};
        }

        .bgm-controls {
          text-align: center;
        }

        .bgm-control-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 25px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .bgm-control-btn:hover {
          transform: scale(1.05);
        }

        .visit-options {
          margin: 20px 0;
        }

        .visit-btn {
          width: 100%;
          padding: 20px;
          border: none;
          border-radius: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: transform 0.2s;
        }

        .visit-btn:hover {
          transform: translateY(-2px);
        }

        .visit-btn .icon {
          font-size: 24px;
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 15px;
          }
          
          .explore-options {
            grid-template-columns: 1fr;
          }
          
          .profile-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}