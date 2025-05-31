import React from 'react';
import styles from './MobileTabNavigation.module.css';

const MobileTabNavigation = ({ activeTab, onTabChange, hasNotification = {} }) => {
  const tabs = [
    { id: 'home', label: 'ホーム', icon: '🏠' },
    { id: 'visit', label: '参拝', icon: '⛩️' },
    { id: 'collection', label: 'my神社', icon: '🏯' },
    { id: 'explore', label: '探索', icon: '🗺️' },
    { id: 'profile', label: 'プロフィール', icon: '👤' }
  ];

  return (
    <nav className={styles.tabNavigation} role="navigation" aria-label="メインナビゲーション">
      <div className={styles.tabContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            aria-label={tab.label}
          >
            <span className={styles.icon}>{tab.icon}</span>
            <span className={styles.label}>{tab.label}</span>
            {hasNotification[tab.id] && (
              <span className={styles.notification} aria-label="新着通知あり"></span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileTabNavigation;