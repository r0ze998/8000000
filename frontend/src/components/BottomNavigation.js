import React from 'react';
import './BottomNavigation.css';

function BottomNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'ホーム' },
    { id: 'explore', icon: '🗺️', label: '探索' },
    { id: 'visit', icon: '⛩️', label: '参拝' },
    { id: 'learn', icon: '📚', label: '学び' },
    { id: 'profile', icon: '👤', label: 'マイページ' }
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