import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ type = 'default', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'home':
        return (
          <div className="skeleton-home">
            {/* ヘッダー部分 */}
            <div className="skeleton-header">
              <div className="skeleton-circle skeleton-avatar"></div>
              <div className="skeleton-text skeleton-greeting"></div>
            </div>
            
            {/* ストリーク表示 */}
            <div className="skeleton-streak">
              <div className="skeleton-text skeleton-streak-number"></div>
              <div className="skeleton-text skeleton-streak-label"></div>
            </div>
            
            {/* 参拝ボタン */}
            <div className="skeleton-fab"></div>
            
            {/* 今日の状況 */}
            <div className="skeleton-status">
              <div className="skeleton-text skeleton-status-title"></div>
              <div className="skeleton-text skeleton-status-desc"></div>
            </div>
          </div>
        );
        
      case 'tab-navigation':
        return (
          <div className="skeleton-tab-nav">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-tab-item">
                <div className="skeleton-circle skeleton-tab-icon"></div>
                <div className="skeleton-text skeleton-tab-label"></div>
              </div>
            ))}
          </div>
        );
        
      case 'shrine-list':
        return (
          <div className="skeleton-shrine-list">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="skeleton-shrine-item">
                <div className="skeleton-rect skeleton-shrine-image"></div>
                <div className="skeleton-shrine-content">
                  <div className="skeleton-text skeleton-shrine-name"></div>
                  <div className="skeleton-text skeleton-shrine-distance"></div>
                  <div className="skeleton-text skeleton-shrine-desc"></div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'goshuin-grid':
        return (
          <div className="skeleton-goshuin-grid">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="skeleton-goshuin-item">
                <div className="skeleton-rect skeleton-goshuin-image"></div>
                <div className="skeleton-text skeleton-goshuin-name"></div>
              </div>
            ))}
          </div>
        );
        
      case 'profile-stats':
        return (
          <div className="skeleton-profile">
            <div className="skeleton-circle skeleton-profile-avatar"></div>
            <div className="skeleton-text skeleton-profile-name"></div>
            <div className="skeleton-stats-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-stat-item">
                  <div className="skeleton-text skeleton-stat-number"></div>
                  <div className="skeleton-text skeleton-stat-label"></div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return (
          <div className="skeleton-default">
            {[...Array(count)].map((_, i) => (
              <div key={i} className="skeleton-line">
                <div className="skeleton-text"></div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="loading-skeleton" role="status" aria-label="読み込み中">
      {renderSkeleton()}
    </div>
  );
};

export default LoadingSkeleton;