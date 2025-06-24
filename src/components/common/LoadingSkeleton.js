import React from 'react';

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
      
      <style jsx>{`
        .loading-skeleton {
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        @keyframes skeleton-pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        .skeleton-text,
        .skeleton-rect,
        .skeleton-circle {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-circle {
          border-radius: 50%;
        }

        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .skeleton-home {
          padding: 20px;
          min-height: calc(100vh - 120px);
        }

        .skeleton-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .skeleton-avatar {
          width: 48px;
          height: 48px;
        }

        .skeleton-greeting {
          height: 20px;
          width: 120px;
        }

        .skeleton-streak {
          text-align: center;
          margin: 32px 0;
        }

        .skeleton-streak-number {
          height: 32px;
          width: 80px;
          margin: 0 auto 8px;
        }

        .skeleton-streak-label {
          height: 16px;
          width: 60px;
          margin: 0 auto;
        }

        .skeleton-fab {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin: 40px auto;
          position: relative;
        }

        .skeleton-status {
          margin-top: 40px;
        }

        .skeleton-status-title {
          height: 24px;
          width: 150px;
          margin-bottom: 12px;
        }

        .skeleton-status-desc {
          height: 16px;
          width: 200px;
        }

        .skeleton-tab-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: white;
          display: flex;
          padding: 8px 0;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        }

        .skeleton-tab-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .skeleton-tab-icon {
          width: 24px;
          height: 24px;
        }

        .skeleton-tab-label {
          width: 40px;
          height: 12px;
        }

        .skeleton-shrine-list {
          padding: 16px;
        }

        .skeleton-shrine-item {
          display: flex;
          gap: 12px;
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .skeleton-shrine-image {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .skeleton-shrine-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .skeleton-shrine-name {
          height: 20px;
          width: 120px;
        }

        .skeleton-shrine-distance {
          height: 14px;
          width: 80px;
        }

        .skeleton-shrine-desc {
          height: 14px;
          width: 160px;
        }

        .skeleton-goshuin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
          padding: 16px;
        }

        .skeleton-goshuin-item {
          text-align: center;
        }

        .skeleton-goshuin-image {
          width: 100%;
          height: 120px;
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .skeleton-goshuin-name {
          height: 16px;
          width: 80px;
          margin: 0 auto;
        }

        .skeleton-profile {
          padding: 24px;
          text-align: center;
        }

        .skeleton-profile-avatar {
          width: 100px;
          height: 100px;
          margin: 0 auto 16px;
        }

        .skeleton-profile-name {
          height: 24px;
          width: 120px;
          margin: 0 auto 32px;
        }

        .skeleton-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-top: 24px;
        }

        .skeleton-stat-item {
          padding: 16px;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.02);
        }

        .skeleton-stat-number {
          height: 28px;
          width: 40px;
          margin: 0 auto 8px;
        }

        .skeleton-stat-label {
          height: 14px;
          width: 60px;
          margin: 0 auto;
        }

        .skeleton-default {
          padding: 16px;
        }

        .skeleton-line {
          margin-bottom: 12px;
        }

        .skeleton-line:last-child {
          margin-bottom: 0;
        }

        .skeleton-text {
          height: 20px;
          width: 100%;
        }

        @media (max-width: 480px) {
          .skeleton-goshuin-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .skeleton-stats-grid {
            grid-template-columns: 1fr;
          }
          
          .skeleton-home {
            padding: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loading-skeleton,
          .skeleton-text,
          .skeleton-rect,
          .skeleton-circle {
            animation: none;
          }
          
          .skeleton-text,
          .skeleton-rect,
          .skeleton-circle {
            background: #e0e0e0;
          }
        }

        @media (prefers-contrast: high) {
          .skeleton-text,
          .skeleton-rect,
          .skeleton-circle {
            background: #d0d0d0;
            border: 1px solid #999;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSkeleton;