import React from 'react';
import './BottomNavigation.css';

function BottomNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'ホーム', enabled: true },
    { id: 'explore', icon: '🗺️', label: '探索', enabled: true },
    { id: 'visit', icon: '⛩️', label: '参拝', enabled: true },
    { id: 'learn', icon: '📚', label: '学び', enabled: true },
    { id: 'profile', icon: '👤', label: 'マイページ', enabled: true }
  ];

  return (
    <div className="bottom-navigation">
      <div className="nav-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''} ${!tab.enabled ? 'disabled' : ''}`}
            onClick={() => {
              console.log(`Tab clicked: ${tab.id}, enabled: ${tab.enabled}`);
              if (tab.enabled) {
                onTabChange(tab.id);
              }
            }}
            disabled={!tab.enabled}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
            {activeTab === tab.id && <div className="nav-indicator" />}
          </button>
        ))}
      </div>
      <div className="safe-area-bottom" />
    </div>
  );
}

export default BottomNavigation;