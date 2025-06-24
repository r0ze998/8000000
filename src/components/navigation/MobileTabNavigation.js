import React, { useState, useEffect, useRef } from 'react';

const MobileTabNavigation = ({ activeTab, onTabChange, hasNotification = {} }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef(null);
  
  // 片手操作に最適化されたタブ配置
  const tabs = [
    {
      id: 'home',
      label: 'ホーム',
      icon: '🏠',
      activeIcon: '🏡',
      reachability: 'easy' // 親指で簡単にアクセス可能
    },
    {
      id: 'visit',
      label: '参拝',
      icon: '⛩️',
      activeIcon: '⛩️',
      reachability: 'easy',
      isPrimary: true // メインアクション
    },
    {
      id: 'collection',
      label: 'コレクション',
      icon: '📿',
      activeIcon: '📿',
      reachability: 'medium'
    },
    {
      id: 'explore',
      label: '発見',
      icon: '🗺️',
      activeIcon: '🗺️',
      reachability: 'medium'
    },
    {
      id: 'profile',
      label: 'プロフィール',
      icon: '👤',
      activeIcon: '👤',
      reachability: 'easy'
    }
  ];
  
  // スクロール時のナビゲーション制御（Apple HIG準拠）
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 下にスクロール時は隠す、上にスクロール時は表示
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [lastScrollY]);
  
  // ハプティックフィードバック（iOS対応）
  const triggerHaptic = (type = 'light') => {
    if (window.navigator && window.navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      window.navigator.vibrate(patterns[type]);
    }
  };
  
  // タブ変更処理
  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    
    triggerHaptic('light');
    onTabChange(tabId);
    
    // 音声フィードバック（アクセシビリティ）
    if (window.speechSynthesis) {
      const tab = tabs.find(t => t.id === tabId);
      const utterance = new SpeechSynthesisUtterance(`${tab.label}タブに移動しました`);
      utterance.volume = 0.3;
      utterance.rate = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // キーボードナビゲーション（アクセシビリティ）
  const handleKeyDown = (event, tabId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTabChange(tabId);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const currentIndex = tabs.findIndex(t => t.id === activeTab);
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
      handleTabChange(tabs[nextIndex].id);
    }
  };
  
  return (
    <nav 
      ref={navRef}
      className={`mobile-tab-navigation ${isVisible ? 'visible' : 'hidden'}`}
      role="tablist"
      aria-label="メインナビゲーション"
    >
      <div className="tab-container">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={`tab-item ${tab.reachability} ${activeTab === tab.id ? 'active' : ''} ${tab.isPrimary ? 'primary' : ''}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
          >
            {/* タブアイコン */}
            <div className="tab-icon-container">
              <span 
                className="tab-icon"
                role="img"
                aria-label={tab.label}
              >
                {activeTab === tab.id ? tab.activeIcon : tab.icon}
              </span>
              
              {/* 通知バッジ */}
              {hasNotification[tab.id] && (
                <div 
                  className="notification-badge"
                  aria-label="新しい通知があります"
                />
              )}
              
              {/* アクティブインジケーター */}
              {activeTab === tab.id && (
                <div className="active-indicator" />
              )}
            </div>
            
            {/* タブラベル */}
            <span className="tab-label">{tab.label}</span>
            
            {/* リーチャビリティヒント */}
            <div className={`reachability-hint ${tab.reachability}`} />
          </button>
        ))}
      </div>
      
      {/* セーフエリアインジケーター */}
      <div className="safe-area-inset" />
    </nav>
  );
};

// スロットル関数
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export default MobileTabNavigation;