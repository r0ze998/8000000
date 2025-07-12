
import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/constants.css';

// Components
import {
  StarkNetDebug,
  WelcomeOnboarding,
  AccountStatus,
  Explore,
  Worship,
  Profile,
  MyShrine
} from './components';

// Hooks
import { useOnboarding } from './hooks';

// Types (commented out until needed)
// import type { User } from './types';

// Utils
import { debugLog } from './utils';

// =============================================================================
// Types & Constants
// =============================================================================

type TabType = 'worship' | 'explore' | 'myshrine' | 'profile';

interface TabConfig {
  id: TabType;
  icon: string;
  label: string;
  component: React.ComponentType;
}

const TABS: TabConfig[] = [
  { id: 'worship', icon: '🙏', label: '参拝', component: Worship },
  { id: 'explore', icon: '🗺️', label: '探索', component: Explore },
  { id: 'myshrine', icon: '⛩️', label: 'マイ神社', component: MyShrine },
  { id: 'profile', icon: '👤', label: 'プロフィール', component: Profile }
];

// =============================================================================
// Main Component
// =============================================================================

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('worship');
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { needsOnboarding, isLoading, completeOnboarding } = useOnboarding();

  // Initialize application
  useEffect(() => {
    const initializeApp = async () => {
      try {
        debugLog('Initializing application...');
        
        // Initialize user data (will be loaded from context/state management later)
        setIsInitialized(true);
        
        debugLog('Application initialized successfully');
      } catch (error) {
        console.error('アプリケーション初期化エラー:', error);
        setIsInitialized(true); // Continue even with errors
      }
    };

    initializeApp();
  }, []);

  // Get active component
  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component || Worship;

  // Loading state during onboarding check
  if (isLoading) {
    return <LoadingScreen message="神社アプリを準備中..." />;
  }

  // Show onboarding for new users
  if (needsOnboarding) {
    return <WelcomeOnboarding onComplete={completeOnboarding} />;
  }

  // Loading state during app initialization
  if (!isInitialized) {
    return <LoadingScreen message="アカウントを準備中..." />;
  }

  return (
    <div className="app">
      {/* Debug panel (development only) */}
      {process.env.NODE_ENV === 'development' && <StarkNetDebug />}
      
      <div className="app-container">
        {/* Header */}
        <AppHeader />
        
        {/* Tab Navigation */}
        <TabNavigation 
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Main Content */}
        <main className="app-main">
          <div className="tab-content">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
};

// =============================================================================
// Sub Components
// =============================================================================

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="app-loading">
    <div className="loading-container">
      <div className="shrine-loader">
        <div className="torii-gate">⛩️</div>
        <div className="loading-text">{message}</div>
      </div>
    </div>
  </div>
);

const AppHeader: React.FC = () => (
  <header className="app-header">
    <div className="header-content">
      <div className="app-title">
        <span className="title-icon">⛩️</span>
        <h1>神社参拝</h1>
      </div>
      <div className="header-account">
        <AccountStatus showDetails={false} />
      </div>
    </div>
  </header>
);

interface TabNavigationProps {
  tabs: TabConfig[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange 
}) => (
  <nav className="tab-navigation">
    <div className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

export default App;
