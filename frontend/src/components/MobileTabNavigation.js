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

      <style jsx>{`
        /* Mobile-First Tab Navigation - Apple HIG & Material Design準拠 */

        .mobile-tab-navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 0.5px solid rgba(0, 0, 0, 0.1);
          transform: translateY(0);
          transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          z-index: 1000;
          
          /* iOS Safe Area対応 */
          padding-bottom: env(safe-area-inset-bottom);
        }

        .mobile-tab-navigation.hidden {
          transform: translateY(100%);
        }

        .mobile-tab-navigation.visible {
          transform: translateY(0);
        }

        .tab-container {
          display: flex;
          align-items: center;
          justify-content: space-around;
          height: 60px;
          padding: 4px 8px 0;
          max-width: 500px;
          margin: 0 auto;
        }

        /* Tab Item Base Styles */
        .tab-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6px 4px;
          border: none;
          background: none;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
          position: relative;
          min-height: 48px; /* Apple HIG最小タッチターゲット */
          min-width: 48px;
          
          /* フォーカス管理 */
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .tab-item:hover {
          background: rgba(0, 0, 0, 0.05);
          transform: scale(1.02);
        }

        .tab-item:active {
          transform: scale(0.98);
          background: rgba(0, 0, 0, 0.1);
        }

        .tab-item.active {
          color: #007AFF; /* iOS Blue */
        }

        .tab-item.active:hover {
          background: rgba(0, 122, 255, 0.1);
        }

        /* Primary Action (参拝ボタン) */
        .tab-item.primary {
          background: linear-gradient(135deg, #007AFF, #0056CC);
          color: white;
          border-radius: 20px;
          box-shadow: 0 2px 10px rgba(0, 122, 255, 0.3);
          transform: scale(1.1);
        }

        .tab-item.primary:hover {
          background: linear-gradient(135deg, #0056CC, #004499);
          transform: scale(1.12);
        }

        .tab-item.primary:active {
          transform: scale(1.08);
        }

        .tab-item.primary .tab-icon {
          font-size: 28px;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }

        .tab-item.primary .tab-label {
          color: white;
          font-weight: 600;
        }

        /* Icon Container */
        .tab-icon-container {
          position: relative;
          margin-bottom: 2px;
        }

        .tab-icon {
          font-size: 24px;
          display: block;
          transition: transform 0.2s ease;
        }

        .tab-item.active .tab-icon {
          transform: scale(1.1);
        }

        /* Notification Badge */
        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          background: #FF3B30; /* iOS Red */
          border-radius: 50%;
          border: 1px solid white;
          animation: notification-pulse 2s infinite;
        }

        @keyframes notification-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Active Indicator */
        .active-indicator {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #007AFF;
          border-radius: 2px;
          animation: active-indicator-appear 0.3s ease-out;
        }

        @keyframes active-indicator-appear {
          0% { transform: translateX(-50%) scale(0); opacity: 0; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }

        /* Tab Label */
        .tab-label {
          font-size: 10px;
          font-weight: 500;
          color: #8E8E93; /* iOS Secondary Label */
          text-align: center;
          line-height: 1.2;
          transition: color 0.2s ease;
          max-width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tab-item.active .tab-label {
          color: #007AFF;
          font-weight: 600;
        }

        /* Reachability Optimization (片手操作) */
        .reachability-hint {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          border-radius: 12px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        /* 親指でアクセスしやすいエリア */
        .tab-item.easy .reachability-hint {
          background: radial-gradient(circle, rgba(76, 217, 100, 0.1), transparent);
        }

        /* 少し届きにくいエリア */
        .tab-item.medium .reachability-hint {
          background: radial-gradient(circle, rgba(255, 204, 0, 0.1), transparent);
        }

        /* リーチャビリティガイド表示 */
        .mobile-tab-navigation[data-show-reachability="true"] .reachability-hint {
          opacity: 1;
        }

        /* Safe Area Inset */
        .safe-area-inset {
          height: env(safe-area-inset-bottom, 0);
          background: inherit;
        }

        /* Accessibility Features */
        .tab-item:focus {
          background: rgba(0, 122, 255, 0.1);
          box-shadow: 0 0 0 2px #007AFF;
        }

        .tab-item:focus .tab-label {
          color: #007AFF;
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .tab-item,
          .tab-icon,
          .mobile-tab-navigation,
          .active-indicator {
            transition: none;
            animation: none;
          }
          
          .notification-badge {
            animation: none;
          }
        }

        /* High Contrast Support */
        @media (prefers-contrast: high) {
          .mobile-tab-navigation {
            background: white;
            border-top: 2px solid black;
          }
          
          .tab-item.active {
            background: black;
            color: white;
          }
          
          .tab-item.active .tab-label {
            color: white;
          }
          
          .notification-badge {
            background: red;
            border: 2px solid white;
          }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          .mobile-tab-navigation {
            background: rgba(28, 28, 30, 0.95);
            border-top: 0.5px solid rgba(255, 255, 255, 0.1);
          }
          
          .tab-item:hover {
            background: rgba(255, 255, 255, 0.05);
          }
          
          .tab-item:active {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .tab-label {
            color: #8E8E93;
          }
          
          .tab-item.active .tab-label {
            color: #0A84FF; /* iOS Blue Dark */
          }
          
          .tab-item.active {
            color: #0A84FF;
          }
        }

        /* Responsive Design */
        @media (max-width: 320px) {
          .tab-label {
            font-size: 9px;
          }
          
          .tab-icon {
            font-size: 20px;
          }
          
          .tab-item.primary .tab-icon {
            font-size: 24px;
          }
        }

        @media (min-width: 768px) {
          .tab-container {
            max-width: 400px;
          }
          
          .tab-item {
            padding: 8px 6px;
          }
        }

        /* Landscape Orientation */
        @media (orientation: landscape) and (max-height: 500px) {
          .tab-container {
            height: 50px;
          }
          
          .tab-item {
            min-height: 40px;
            padding: 4px 2px;
          }
          
          .tab-label {
            font-size: 9px;
          }
          
          .tab-icon {
            font-size: 20px;
          }
        }

        /* PWA Support */
        @media (display-mode: standalone) {
          .mobile-tab-navigation {
            /* PWA環境でのセーフエリア調整 */
            padding-bottom: max(env(safe-area-inset-bottom), 20px);
          }
        }
      `}</style>
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