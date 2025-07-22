import React, { useState, useEffect } from 'react';
import './App.css';

// Component imports
import WorshipScreen from './components/WorshipScreen';
import ExploreScreen from './components/ExploreScreen';
import MyShrineScreen from './components/MyShrineScreen';
import ProfileScreen from './components/ProfileScreen';
import AccountStatus from './components/AccountStatus';

function ShrineVillageApp() {
  const [activeTab, setActiveTab] = useState('worship');
  const [shrineName, setShrineName] = useState('あなたの神社');
  const [playerData, setPlayerData] = useState({
    culturalCapital: 0,
    worshipCount: 0,
    level: 1,
    streak: 0,
    nftCollection: [],
    shrineLevel: 1,
    godPower: 0
  });

  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // Initialize app state
    const savedData = localStorage.getItem('shrineAppData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setPlayerData(parsed.playerData || playerData);
      setShrineName(parsed.shrineName || shrineName);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever data changes
    localStorage.setItem('shrineAppData', JSON.stringify({
      playerData,
      shrineName
    }));
  }, [playerData, shrineName]);

  const updatePlayerData = (updates) => {
    setPlayerData(prev => ({ ...prev, ...updates }));
  };

  const addCulturalCapital = (amount) => {
    updatePlayerData({
      culturalCapital: playerData.culturalCapital + amount,
      level: Math.floor((playerData.culturalCapital + amount) / 100) + 1
    });
  };

  const addWorshipCount = () => {
    updatePlayerData({
      worshipCount: playerData.worshipCount + 1,
      streak: playerData.streak + 1
    });
  };

  const addNFT = (nft) => {
    updatePlayerData({
      nftCollection: [...playerData.nftCollection, {
        ...nft,
        id: Date.now(),
        timestamp: new Date().toISOString()
      }]
    });
  };

  const renderActiveScreen = () => {
    const screenProps = {
      playerData,
      updatePlayerData,
      addCulturalCapital,
      addWorshipCount,
      addNFT,
      shrineName,
      setShrineName
    };

    switch (activeTab) {
      case 'worship':
        return <WorshipScreen {...screenProps} />;
      case 'explore':
        return <ExploreScreen {...screenProps} />;
      case 'myshrine':
        return <MyShrineScreen {...screenProps} />;
      case 'profile':
        return <ProfileScreen {...screenProps} account={account} isConnected={isConnected} />;
      default:
        return <WorshipScreen {...screenProps} />;
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case 'worship':
        return `🙏 ${shrineName}`;
      case 'explore':
        return '🗺️ 探索';
      case 'myshrine':
        return '⛩️ マイ神社';
      case 'profile':
        return '👤 プロフィール';
      default:
        return '🙏 神社参拝';
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1 className="app-title">⛩️ 神社参拝</h1>
        <AccountStatus 
          isConnected={isConnected}
          account={account}
          onConnect={() => {
            // Mock connection
            setIsConnected(true);
            setAccount({ address: '0x1234...5678', balance: '0.5 ETH' });
          }}
          onDisconnect={() => {
            setIsConnected(false);
            setAccount(null);
          }}
        />
      </header>

      {/* Tab Navigation */}
      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'worship' ? 'active' : ''}`}
          onClick={() => setActiveTab('worship')}
        >
          🙏 {shrineName}
        </button>
        <button
          className={`tab-button ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          🗺️ 探索
        </button>
        <button
          className={`tab-button ${activeTab === 'myshrine' ? 'active' : ''}`}
          onClick={() => setActiveTab('myshrine')}
        >
          ⛩️ マイ神社
        </button>
        <button
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 プロフィール
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {renderActiveScreen()}
      </main>
    </div>
  );
}

export default ShrineVillageApp;