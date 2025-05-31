import { useState, useEffect } from 'react';
import CulturalIdentityDashboard from '../components/CulturalIdentityDashboard';
import StoryCreationSystem from '../components/StoryCreationSystem';
import MobileTabNavigation from '../components/MobileTabNavigation';
import NFTHakoniwa from '../components/NFTHakoniwa';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [showStoryCreation, setShowStoryCreation] = useState(false);
  const [showFullDashboard, setShowFullDashboard] = useState(false);
  const [mockData, setMockData] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [todayVisited, setTodayVisited] = useState(false);
  const [hasNotification, setHasNotification] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBGMPlaying, setIsBGMPlaying] = useState(false);
  const [currentBGM, setCurrentBGM] = useState('forest');
  const [currentAudio, setCurrentAudio] = useState(null);
  const [myShrineConfig, setMyShrineConfig] = useState({
    name: 'my神社',
    torii: 'basic',
    mainHall: 'basic',
    decorations: ['lanterns'],
    environment: 'forest',
    blessing: 'prosperity'
  });

  // BGM tracks for different tabs and moods with MP3 files
  const bgmTracks = {
    forest: { 
      name: '森の音', 
      emoji: '🌲', 
      description: '自然の音で心を落ち着かせる',
      file: '/audio/forest.mp3'
    },
    temple: { 
      name: '寺院の鐘', 
      emoji: '🔔', 
      description: '厳かな鐘の音',
      file: '/audio/temple.mp3'
    },
    rain: { 
      name: '雨の音', 
      emoji: '🌧️', 
      description: '静寂な雨音',
      file: '/audio/rain.mp3'
    },
    wind: { 
      name: '風の音', 
      emoji: '🍃', 
      description: '清々しい風の音',
      file: '/audio/wind.mp3'
    },
    meditation: { 
      name: '瞑想音楽', 
      emoji: '🧘', 
      description: '深い瞑想のための音楽',
      file: '/audio/meditation.mp3'
    }
  };

  // Initialize with realistic mock data
  useEffect(() => {
    // Check for saved preferences
    const savedDarkMode = localStorage.getItem('isDarkMode') === 'true';
    const savedBGM = localStorage.getItem('currentBGM') || 'forest';
    const savedBGMPlaying = localStorage.getItem('isBGMPlaying') === 'true';
    const savedShrineConfig = localStorage.getItem('myShrineConfig');
    
    setIsDarkMode(savedDarkMode);
    setCurrentBGM(savedBGM);
    setIsBGMPlaying(savedBGMPlaying);
    
    if (savedShrineConfig) {
      try {
        setMyShrineConfig(JSON.parse(savedShrineConfig));
      } catch (e) {
        console.log('Error parsing saved shrine config');
      }
    }
    
    // Auto-start BGM if it was playing
    if (savedBGMPlaying) {
      setTimeout(() => {
        playBGM(savedBGM);
      }, 500); // Wait for component to mount
    }
    
    setMockData({
      visits: [
        { id: 1, shrineName: '明治神宮', date: '2024-05-30', streakCount: 7 },
        { id: 2, shrineName: '浅草寺', date: '2024-05-29', streakCount: 6 },
        { id: 3, shrineName: '伏見稲荷大社', date: '2024-05-28', streakCount: 5 }
      ],
      nfts: [
        {
          id: 1,
          type: 'omamori',
          title: '雨の日の静寂な参拝',
          shrine: '明治神宮',
          rarity: 'rare',
          story: '雨粒が木々を優しく叩く音が、心を落ち着かせてくれました...',
          date: '2024-05-30',
          culturalValue: 850
        }
      ],
      sbts: [{ id: 1, roleType: 'kannushi', shrine: '明治神宮', contributionLevel: 'advanced', governanceWeight: 100 }],
      poaps: [{ id: 1, eventName: '春の神社めぐりイベント', contributionLevel: 'organizer', date: '2024-04-15' }],
      culturalScore: 12500
    });
  }, []);

  // Audio functions using HTML5 Audio API
  const playBGM = (bgmKey) => {
    const track = bgmTracks[bgmKey];
    
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Create new audio element
    const audio = new Audio(track.file);
    audio.loop = true;
    audio.volume = 0.3; // Set volume to 30%
    
    // Error handling
    audio.addEventListener('error', (e) => {
      console.log(`BGM file not found: ${track.file}. Using fallback silence.`);
      // Create a silent audio context as fallback
      createFallbackAudio(bgmKey);
    });

    audio.addEventListener('canplaythrough', () => {
      audio.play().catch(e => {
        console.log('Autoplay prevented. BGM will start on next user interaction.');
      });
    });

    setCurrentAudio(audio);
  };

  const createFallbackAudio = (bgmKey) => {
    // Fallback to Web Audio API if MP3 files are not available
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Simple tone based on BGM type
    const frequencies = {
      forest: 220,   // A3
      temple: 174,   // F3
      rain: 1000,    // High frequency
      wind: 80,      // Low frequency
      meditation: 528 // Solfeggio frequency
    };
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequencies[bgmKey] || 220, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    
    // Store reference for cleanup
    setCurrentAudio({ 
      pause: () => oscillator.stop(),
      currentTime: 0 
    });
  };

  const stopBGM = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
  };

  const handleQuickVisit = () => {
    // Don't auto-complete, just start the visit flow
    setShowStoryCreation(true);
  };

  const handleActualVisit = () => {
    // This is for actual quick visit completion (if needed)
    if (!todayVisited) {
      setCurrentStreak(prev => prev + 1);
      setTodayVisited(true);
      // Add new visit to mock data
      if (mockData) {
        const newVisit = {
          id: mockData.visits.length + 1,
          shrineName: '今日の神社',
          date: new Date().toISOString().split('T')[0],
          streakCount: currentStreak + 1
        };
        setMockData(prev => ({
          ...prev,
          visits: [newVisit, ...prev.visits]
        }));
      }
      // Show success feedback
      alert('🎉 参拝記録完了！\n連続記録が' + (currentStreak + 1) + '日になりました！');
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Clear notifications for visited tab
    if (hasNotification[tabId]) {
      setHasNotification(prev => ({ ...prev, [tabId]: false }));
    }
    
    // Auto-change BGM based on tab
    if (isBGMPlaying) {
      const tabBGM = {
        home: 'forest',
        visit: 'temple',
        collection: 'meditation',
        explore: 'wind',
        profile: 'rain'
      };
      if (tabBGM[tabId] && tabBGM[tabId] !== currentBGM) {
        setCurrentBGM(tabBGM[tabId]);
        localStorage.setItem('currentBGM', tabBGM[tabId]);
        playBGM(tabBGM[tabId]);
      }
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('isDarkMode', newDarkMode.toString());
  };

  const toggleBGM = () => {
    const newBGMState = !isBGMPlaying;
    setIsBGMPlaying(newBGMState);
    localStorage.setItem('isBGMPlaying', newBGMState.toString());
    
    if (newBGMState) {
      playBGM(currentBGM);
    } else {
      stopBGM();
    }
  };

  const changeBGM = (bgmKey) => {
    setCurrentBGM(bgmKey);
    localStorage.setItem('currentBGM', bgmKey);
    
    if (isBGMPlaying) {
      playBGM(bgmKey);
    }
  };

  // 神社設定の更新
  const handleShrineUpdate = (newShrineConfig) => {
    setMyShrineConfig(newShrineConfig);
    // LocalStorageに保存
    if (typeof window !== 'undefined') {
      localStorage.setItem('myShrineConfig', JSON.stringify(newShrineConfig));
    }
  };

  // 箱庭保存
  const handleHakoniwaSave = (hakoniwData) => {
    console.log('Hakoniwa saved:', hakoniwData);
    // 通知表示などの処理をここに追加可能
    // 箱庭保存時にコレクションタブに通知追加
    setHasNotification(prev => ({ ...prev, collection: true }));
  };

  const handleStoryComplete = (result) => {
    console.log('Story created:', result);
    
    // Mark today as visited and increase streak
    if (!todayVisited) {
      setCurrentStreak(prev => prev + 1);
      setTodayVisited(true);
    }
    
    if (mockData) {
      const newNFT = {
        id: mockData.nfts.length + 1,
        type: 'omamori',
        title: result.title,
        shrine: result.shrine || '体験神社',
        rarity: result.rarity || 'common',
        story: result.story,
        date: new Date().toISOString().split('T')[0],
        culturalValue: result.culturalValue || 500
      };
      
      // Add visit record
      const newVisit = {
        id: mockData.visits.length + 1,
        shrineName: result.shrine || '体験神社',
        date: new Date().toISOString().split('T')[0],
        streakCount: currentStreak + 1
      };
      
      setMockData(prev => ({
        ...prev,
        visits: [newVisit, ...prev.visits],
        nfts: [...prev.nfts, newNFT],
        culturalScore: prev.culturalScore + (result.culturalValue || 500)
      }));
      
      // Add notification for collection tab
      setHasNotification(prev => ({ ...prev, collection: true }));
    }
    setShowStoryCreation(false);
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* ヘッダー - シンプルに */}
      <div className="header">
        <div className="app-title">
          <span className="icon">⛩️</span>
          <span className="title">八百万</span>
        </div>
        <div className="user-status">
          <div className="controls">
            {/* BGM Control */}
            <button 
              className="control-button"
              onClick={toggleBGM}
              title={isBGMPlaying ? 'BGMを停止' : 'BGMを再生'}
            >
              {isBGMPlaying ? '🔊' : '🔇'}
            </button>
            
            {/* Dark Mode Toggle */}
            <button 
              className="control-button"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'ライトモード' : 'ダークモード'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <div className="status-badges">
            <span className={`level-badge level-${Math.floor(currentStreak / 10) + 1}`}>
              Lv.{Math.floor(currentStreak / 10) + 1}
            </span>
            <span className="streak-badge">{currentStreak}日連続</span>
          </div>
        </div>
      </div>

      {/* メイン画面 - ユーザーの主要アクションを前面に */}
      <div className="main-content">
        
        {/* タブコンテンツの表示制御 */}
        {activeTab === 'home' && (
          <>
        
        {/* 今日の状況 - 一目でわかる */}
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

        {/* 主要アクション - 大きく、わかりやすく */}
        <div className="primary-actions">
          <button 
            className={`primary-action ${todayVisited ? 'completed' : 'pending'}`}
            onClick={handleQuickVisit}
            disabled={todayVisited}
          >
            <div className="action-icon">
              {todayVisited ? '✅' : '⛩️'}
            </div>
            <div className="action-text">
              <div className="action-title">
                {todayVisited ? '参拝記録済み' : '参拝を記録する'}
              </div>
              <div className="action-subtitle">
                {todayVisited ? '今日も素晴らしい！' : '体験を詳しく記録しましょう'}
              </div>
            </div>
          </button>

          {todayVisited && (
            <button 
              className="secondary-action"
              onClick={() => setShowStoryCreation(true)}
            >
              <div className="action-icon">✨</div>
              <div className="action-text">
                <div className="action-title">体験を記録する</div>
                <div className="action-subtitle">今日の参拝の思い出を残す</div>
              </div>
            </button>
          )}
        </div>

        {/* 進捗表示 - 励みになるデザイン */}
        <div className="progress-section">
          <div className="progress-header">
            <h3>あなたの参拝の旅</h3>
            <button 
              className="view-details"
              onClick={() => setShowFullDashboard(!showFullDashboard)}
            >
              {showFullDashboard ? '簡単表示' : '詳細を見る'}
            </button>
          </div>
          
          <div className="progress-stats">
            <div className="stat-item">
              <div className="stat-number">{currentStreak}</div>
              <div className="stat-label">連続日数</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{mockData?.visits?.length || 0}</div>
              <div className="stat-label">総参拝数</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{mockData?.nfts?.length || 0}</div>
              <div className="stat-label">思い出記録</div>
            </div>
          </div>

          {/* 今週の進捗カレンダー */}
          <div className="week-progress">
            <div className="week-title">今週の記録</div>
            <div className="week-calendar">
              {['月', '火', '水', '木', '金', '土', '日'].map((day, index) => (
                <div 
                  key={day} 
                  className={`day ${index < 6 ? 'completed' : todayVisited ? 'completed' : 'pending'}`}
                >
                  <div className="day-label">{day}</div>
                  <div className="day-status">
                    {index < 6 || todayVisited ? '⛩️' : '○'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* クイックアクション - すぐアクセスできる機能 */}
        <div className="quick-actions">
          <button className="quick-action">
            <span className="quick-icon">📍</span>
            <span className="quick-text">近くの神社</span>
          </button>
          <button className="quick-action">
            <span className="quick-icon">🗾</span>
            <span className="quick-text">神社マップ</span>
          </button>
          <button className="quick-action">
            <span className="quick-icon">👥</span>
            <span className="quick-text">みんなの記録</span>
          </button>
          <button className="quick-action">
            <span className="quick-icon">🏆</span>
            <span className="quick-text">ランキング</span>
          </button>
        </div>

        {/* 詳細ダッシュボード - 段階的開示 */}
        {showFullDashboard && (
          <div className="detailed-dashboard">
            <div className="dashboard-header">
              <h3>詳細な記録</h3>
              <p>あなたの文化的な旅の全体像</p>
            </div>
            <CulturalIdentityDashboard 
              userAddress="0x1234...5678"
              culturalData={mockData}
              onNavigate={(view) => console.log('Navigate to:', view)}
            />
          </div>
        )}
        </>
        )}

        {/* 参拝タブ */}
        {activeTab === 'visit' && (
          <div className="tab-content">
            <h2>参拝記録</h2>
            <div className="visit-quick-actions">
              <button className="visit-action" onClick={() => setShowStoryCreation(true)}>
                <span className="icon">⛩️</span>
                <span>参拝体験を記録</span>
              </button>
              <button className="visit-action" onClick={handleActualVisit}>
                <span className="icon">⚡</span>
                <span>クイック参拝記録</span>
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
              userLevel={Math.floor(currentStreak / 10) + 1}
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
                <div className="profile-level">レベル {Math.floor(currentStreak / 10) + 1}</div>
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

            {/* BGM Settings */}
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

            {/* App Settings */}
            <div className="settings-section">
              <h3>アプリ設定</h3>
              <div className="setting-item">
                <span className="setting-label">テーマ</span>
                <button className="theme-toggle" onClick={toggleDarkMode}>
                  <span className="theme-icon">{isDarkMode ? '☀️' : '🌙'}</span>
                  <span>{isDarkMode ? 'ライトモード' : 'ダークモード'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BGM Status Indicator - fixed position */}
      {isBGMPlaying && (
        <div className="bgm-indicator-floating">
          <span className="bgm-emoji">{bgmTracks[currentBGM].emoji}</span>
          <span className="bgm-status-text">♪</span>
        </div>
      )}

      {/* モバイルタブナビゲーション */}
      <MobileTabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasNotification={hasNotification}
      />

      {/* ストーリー作成システム */}
      {showStoryCreation && (
        <StoryCreationSystem
          visitData={{
            shrine: '明治神宮',
            date: new Date().toISOString().split('T')[0],
            weather: 'sunny',
            time: 'morning'
          }}
          onStoryComplete={handleStoryComplete}
          onCancel={() => setShowStoryCreation(false)}
        />
      )}

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding-bottom: 80px; /* Space for navigation */
        }

        /* ヘッダー - コンパクトで情報的 */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
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
          font-weight: 700;
          color: #1a1a1a;
        }

        .user-status {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-badges {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-end;
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
          transition: all 0.2s ease;
          min-width: 36px;
          min-height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-button:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .streak-badge {
          background: linear-gradient(135deg, #007AFF, #0056CC);
          color: white;
          padding: 6px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 600;
        }

        .level-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Level color system */
        .level-1 {
          background: linear-gradient(135deg, #8E8E93, #6D6D70);
          color: white;
        }

        .level-2 {
          background: linear-gradient(135deg, #34C759, #30D158);
          color: white;
        }

        .level-3 {
          background: linear-gradient(135deg, #007AFF, #0056CC);
          color: white;
        }

        .level-4 {
          background: linear-gradient(135deg, #AF52DE, #9932CC);
          color: white;
        }

        .level-5 {
          background: linear-gradient(135deg, #FF9500, #FF8C00);
          color: white;
        }

        .level-6, .level-7, .level-8, .level-9, .level-10 {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #8B4513;
          box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
        }

        /* メインコンテンツ */
        .main-content {
          padding: 20px;
          max-width: 420px;
          margin: 0 auto;
        }

        /* 今日の状況セクション */
        .today-section {
          margin-bottom: 24px;
        }

        .today-section h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 16px 0;
        }

        .today-completed, .today-pending {
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .completion-icon, .pending-icon {
          font-size: 32px;
          min-width: 40px;
          text-align: center;
        }

        .completion-text, .pending-text {
          flex: 1;
        }

        .main-text {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 4px;
        }

        .sub-text {
          font-size: 14px;
          color: #666;
          line-height: 1.4;
        }

        /* 主要アクション */
        .primary-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .primary-action {
          display: flex;
          align-items: center;
          gap: 16px;
          background: linear-gradient(135deg, #007AFF, #0056CC);
          color: white;
          border: none;
          border-radius: 16px;
          padding: 20px 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3);
          width: 100%;
          min-height: 80px;
        }

        .primary-action.completed {
          background: linear-gradient(135deg, #34C759, #28A745);
          box-shadow: 0 4px 20px rgba(52, 199, 89, 0.3);
        }

        .primary-action:disabled {
          opacity: 0.8;
          cursor: default;
          transform: none;
        }

        .primary-action:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 122, 255, 0.4);
        }

        .secondary-action {
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          color: #333;
          border: 2px solid #e0e0e0;
          border-radius: 16px;
          padding: 16px 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          min-height: 60px;
        }

        .secondary-action:hover {
          border-color: #007AFF;
          background: #f8f9ff;
          transform: translateY(-1px);
        }

        .action-icon {
          font-size: 28px;
          min-width: 32px;
          text-align: center;
        }

        .action-text {
          flex: 1;
          text-align: left;
        }

        .action-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 2px;
        }

        .action-subtitle {
          font-size: 13px;
          opacity: 0.8;
        }

        /* 進捗セクション */
        .progress-section {
          background: white;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .progress-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .view-details {
          background: none;
          border: none;
          color: #007AFF;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .progress-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-item {
          text-align: center;
          padding: 16px 8px;
          background: #f8f9ff;
          border-radius: 12px;
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #007AFF;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        /* 週間進捗 */
        .week-progress {
          margin-top: 20px;
        }

        .week-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .week-calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }

        .day {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px 4px;
          border-radius: 8px;
          background: #f5f5f5;
        }

        .day.completed {
          background: #e8f5e8;
        }

        .day-label {
          font-size: 11px;
          color: #666;
          font-weight: 500;
        }

        .day-status {
          font-size: 16px;
        }

        /* クイックアクション */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .quick-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 80px;
        }

        .quick-action:hover {
          border-color: #007AFF;
          background: #f8f9ff;
          transform: translateY(-1px);
        }

        .quick-icon {
          font-size: 24px;
        }

        .quick-text {
          font-size: 13px;
          font-weight: 500;
          color: #333;
          text-align: center;
        }

        /* 詳細ダッシュボード */
        .detailed-dashboard {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 2px solid #e0e0e0;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .dashboard-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 8px 0;
        }

        .dashboard-header p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        /* レスポンシブ対応 */
        @media (max-width: 480px) {
          .main-content {
            padding: 16px;
          }

          .header {
            padding: 12px 16px;
          }

          .quick-actions {
            grid-template-columns: repeat(4, 1fr);
          }

          .quick-action {
            padding: 16px 8px;
            min-height: 70px;
          }

          .quick-icon {
            font-size: 20px;
          }

          .quick-text {
            font-size: 11px;
          }
        }

        /* タブコンテンツスタイル */
        .tab-content {
          padding: 20px 0;
        }

        .tab-content h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
        }

        /* 参拝タブ */
        .visit-quick-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .visit-action {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 16px 20px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .visit-action:hover {
          border-color: #007AFF;
          background: #f8f9ff;
        }

        .recent-visits {
          background: white;
          border-radius: 12px;
          padding: 20px;
        }

        .recent-visits h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .visit-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .visit-item:last-child {
          border-bottom: none;
        }

        .visit-shrine {
          font-weight: 500;
        }

        .visit-date {
          color: #666;
          font-size: 14px;
        }

        /* コレクションタブ */
        .collection-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat {
          background: white;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #007AFF;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
        }

        .nft-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .nft-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .nft-image {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .nft-title {
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .nft-shrine {
          color: #666;
          font-size: 12px;
        }

        /* 探索タブ */
        .explore-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .explore-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid #e0e0e0;
        }

        .explore-card:hover {
          border-color: #007AFF;
          background: #f8f9ff;
          transform: translateY(-2px);
        }

        .explore-card .icon {
          font-size: 32px;
          display: block;
          margin-bottom: 8px;
        }

        /* プロフィールタブ */
        .profile-header {
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .avatar {
          font-size: 48px;
          width: 60px;
          height: 60px;
          background: #f0f0f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .profile-level {
          color: #007AFF;
          font-weight: 500;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .profile-stat {
          background: white;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
        }

        .profile-stat .stat-number {
          font-size: 20px;
          font-weight: 700;
          color: #007AFF;
          display: block;
          margin-bottom: 4px;
        }

        .profile-stat .stat-label {
          font-size: 12px;
          color: #666;
        }

        /* Settings Sections */
        .settings-section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-top: 24px;
        }

        .settings-section h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #1a1a1a;
        }

        /* BGM Settings */
        .bgm-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 12px;
          background: #f8f9ff;
          border-radius: 8px;
        }

        .bgm-indicator {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .bgm-indicator.playing {
          background: #e8f5e8;
          color: #28a745;
        }

        .bgm-indicator.stopped {
          background: #f8f9fa;
          color: #666;
        }

        .bgm-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .bgm-option {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .bgm-option:hover {
          border-color: #007AFF;
          background: #f8f9ff;
        }

        .bgm-option.active {
          border-color: #007AFF;
          background: #007AFF;
          color: white;
        }

        .bgm-emoji {
          font-size: 24px;
          min-width: 32px;
        }

        .bgm-info {
          flex: 1;
        }

        .bgm-name {
          font-weight: 600;
          margin-bottom: 2px;
        }

        .bgm-desc {
          font-size: 12px;
          opacity: 0.8;
        }

        .bgm-controls {
          text-align: center;
        }

        .bgm-control-btn {
          background: linear-gradient(135deg, #007AFF, #0056CC);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bgm-control-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
        }

        /* Theme Settings */
        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
        }

        .setting-label {
          font-weight: 500;
        }

        .theme-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f0f0f0;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
        }

        .theme-toggle:hover {
          background: #e0e0e0;
        }

        .theme-icon {
          font-size: 16px;
        }

        /* Dark Mode Styles */
        .dark-mode {
          background: linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 100%);
          color: #ffffff;
        }

        .dark-mode .header {
          background: #2c2c2e;
          border-bottom: 1px solid #38383a;
        }

        .dark-mode .app-title .title {
          color: #ffffff;
        }

        .dark-mode .control-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .dark-mode .level-badge,
        .dark-mode .streak-badge {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .dark-mode .today-completed,
        .dark-mode .today-pending,
        .dark-mode .progress-section,
        .dark-mode .recent-visits,
        .dark-mode .stat,
        .dark-mode .nft-card,
        .dark-mode .explore-card,
        .dark-mode .profile-header,
        .dark-mode .profile-stat,
        .dark-mode .settings-section {
          background: #2c2c2e;
          border-color: #38383a;
        }

        .dark-mode .main-text,
        .dark-mode .tab-content h2,
        .dark-mode .progress-header h3,
        .dark-mode .settings-section h3,
        .dark-mode .profile-name {
          color: #ffffff;
        }

        .dark-mode .secondary-action,
        .dark-mode .visit-action,
        .dark-mode .quick-action {
          background: #2c2c2e;
          border-color: #38383a;
          color: #ffffff;
        }

        .dark-mode .secondary-action:hover,
        .dark-mode .visit-action:hover,
        .dark-mode .quick-action:hover {
          border-color: #007AFF;
          background: #1a1a2e;
        }

        .dark-mode .quick-text {
          color: #ffffff;
        }

        .dark-mode .sub-text,
        .dark-mode .visit-date,
        .dark-mode .stat-label,
        .dark-mode .nft-shrine,
        .dark-mode .profile-stat .stat-label {
          color: #a0a0a0;
        }

        .dark-mode .bgm-option {
          background: #2c2c2e;
          border-color: #38383a;
          color: #ffffff;
        }

        .dark-mode .bgm-option:hover {
          background: #1a1a2e;
        }

        .dark-mode .bgm-status {
          background: #38383a;
        }

        .dark-mode .theme-toggle {
          background: #38383a;
          color: #ffffff;
        }

        .dark-mode .theme-toggle:hover {
          background: #48484a;
        }

        /* BGM Floating Indicator */
        .bgm-indicator-floating {
          position: fixed;
          bottom: 100px;
          right: 20px;
          background: rgba(0, 122, 255, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          z-index: 1000;
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 12px rgba(0, 122, 255, 0.3);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 0.8;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .bgm-emoji {
          font-size: 16px;
        }

        .bgm-status-text {
          animation: bounce 1s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        .dark-mode .bgm-indicator-floating {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        /* Responsive BGM indicator */
        @media (max-width: 480px) {
          .bgm-indicator-floating {
            bottom: 90px;
            right: 16px;
            padding: 6px 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}