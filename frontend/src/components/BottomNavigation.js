import React from 'react';
import './BottomNavigation.css';

function BottomNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'visit', icon: '⛩️', label: '参拝' },
    { id: 'myshrine', icon: '🏛️', label: '神社' },
    { id: 'omikuji', icon: '🎋', label: 'おみくじ' },
    { id: 'community', icon: '👥', label: 'コミュニティ' },
    { id: 'events', icon: '🎌', label: 'イベント' }
  ];

  return (
    <div className="bottom-navigation">
      <div className="nav-container">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
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