import React, { useState, useEffect } from 'react';
import './App.css';
import StarkNetDebug from './components/common/StarkNetDebug';

// コンポーネントのインポート
import Explore from './components/features/explore/Explore';
import Worship from './components/features/worship/Worship';
import Profile from './components/features/profile/Profile';
import MyShrine from './components/features/shrine/MyShrine';

// タブの定義
type TabType = 'worship' | 'explore' | 'myshrine' | 'profile';

interface TabConfig {
  id: TabType;
  icon: string;
  label: string;
  component: React.ComponentType;
}

const tabs: TabConfig[] = [
  { id: 'worship', icon: '🙏', label: '参拝', component: Worship },
  { id: 'explore', icon: '🗺️', label: '探索', component: Explore },
  { id: 'myshrine', icon: '⛩️', label: 'マイ神社', component: MyShrine },
  { id: 'profile', icon: '👤', label: 'プロフィール', component: Profile }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('worship');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // アプリケーション初期化
    const initializeApp = async () => {
      try {
        // Account Abstractionの準備は各コンポーネントで行う
        setIsInitialized(true);
      } catch (error) {
        console.error('アプリケーション初期化エラー:', error);
        setIsInitialized(true); // エラーがあっても継続
      }
    };

    initializeApp();
  }, []);

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || Worship;

  if (!isInitialized) {
    return (
      <div className="app-loading">
        <div className="loading-container">
          <div className="shrine-loader">
            <div className="torii-gate">⛩️</div>
            <div className="loading-text">神社アプリを準備中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* デバッグパネル（開発環境でのみ表示） */}
      {process.env.NODE_ENV === 'development' && <StarkNetDebug />}
      <div className="app-container">
        {/* ヘッダー */}
        <header className="app-header">
          <div className="header-content">
            <div className="app-title">
              <span className="title-icon">⛩️</span>
              <h1>神社参拝</h1>
            </div>
          </div>
        </header>

        {/* タブナビゲーション - モバイルでは下部、デスクトップでは上部 */}
        <nav className="tab-navigation">
          <div className="tab-bar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* メインコンテンツ */}
        <main className="app-main">
          <div className="tab-content">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;