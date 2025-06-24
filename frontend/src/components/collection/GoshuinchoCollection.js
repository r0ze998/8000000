import React, { useState, useEffect } from 'react';
import './GoshuinchoCollection.css';

const GoshuinchoCollection = ({ 
  visits = [],
  onSelectVisit = () => {},
  currentPage = 0,
  onPageChange = () => {}
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState(null);
  const visitsPerPage = 4;
  const totalPages = Math.ceil(visits.length / visitsPerPage);

  // 季節の判定
  const getSeason = (date) => {
    const month = new Date(date).getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  };

  // 季節ごとのスタンプ色
  const getSeasonColor = (season) => {
    const colors = {
      spring: '#fcc9e9', // 桜色
      summer: '#00bfff', // 夏空色
      autumn: '#ff8c00', // 紅葉色
      winter: '#e0e0e0'  // 雪色
    };
    return colors[season] || '#e94709';
  };

  // ページめくりアニメーション
  const handlePageFlip = (direction) => {
    if (isFlipping) return;
    
    const newPage = direction === 'next' 
      ? Math.min(currentPage + 1, totalPages - 1)
      : Math.max(currentPage - 1, 0);
    
    if (newPage !== currentPage) {
      setIsFlipping(true);
      setTimeout(() => {
        onPageChange(newPage);
        setIsFlipping(false);
      }, 600);
    }
  };

  // 現在のページの訪問記録
  const currentVisits = visits.slice(
    currentPage * visitsPerPage,
    (currentPage + 1) * visitsPerPage
  );

  // 空のスロットを埋める
  const emptySlots = Array(visitsPerPage - currentVisits.length).fill(null);

  return (
    <div className="goshuincho-container">
      <div className="goshuincho-header">
        <h2 className="goshuincho-title japanese-title">
          <span className="title-icon">📜</span>
          御朱印帳
          <span className="title-icon">📜</span>
        </h2>
        <div className="collection-stats">
          <span className="stat-item">
            <span className="stat-icon">⛩️</span>
            {visits.length} / 88 社
          </span>
          <span className="stat-item">
            <span className="stat-icon">🏆</span>
            完成度 {Math.round((visits.length / 88) * 100)}%
          </span>
        </div>
      </div>

      <div className={`goshuincho-book ${isFlipping ? 'flipping' : ''}`}>
        {/* 左ページ */}
        <div className="goshuincho-page left-page">
          <div className="page-decoration top-left"></div>
          <div className="page-decoration top-right"></div>
          <div className="page-decoration bottom-left"></div>
          <div className="page-decoration bottom-right"></div>
          
          <div className="stamps-grid">
            {currentVisits.slice(0, 2).map((visit, index) => (
              <div key={index} className="stamp-slot">
                {visit ? (
                  <div 
                    className={`goshuin-stamp ${visit.verified ? 'verified' : ''}`}
                    onClick={() => setSelectedStamp(visit)}
                    style={{
                      '--stamp-color': getSeasonColor(getSeason(visit.timestamp))
                    }}
                  >
                    <div className="stamp-border">
                      <div className="stamp-content">
                        <div className="shrine-name">{visit.shrine?.name || visit.location}</div>
                        <div className="visit-date">
                          {new Date(visit.timestamp).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="stamp-seal">
                          <div className="seal-text">参拝</div>
                        </div>
                        {visit.verified && (
                          <div className="verified-mark">
                            <span>認証済</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="stamp-effects">
                      <div className="sparkle sparkle-1">✨</div>
                      <div className="sparkle sparkle-2">✨</div>
                      <div className="sparkle sparkle-3">✨</div>
                    </div>
                  </div>
                ) : (
                  <div className="empty-stamp-slot">
                    <div className="empty-decoration">
                      <span>未参拝</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {currentVisits.length < 2 && emptySlots.slice(0, 2 - currentVisits.length).map((_, index) => (
              <div key={`empty-left-${index}`} className="stamp-slot">
                <div className="empty-stamp-slot">
                  <div className="empty-decoration">
                    <span>未参拝</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="page-number">{currentPage * 2 + 1}</div>
        </div>

        {/* 中央の綴じ部分 */}
        <div className="book-spine">
          <div className="spine-decoration"></div>
        </div>

        {/* 右ページ */}
        <div className="goshuincho-page right-page">
          <div className="page-decoration top-left"></div>
          <div className="page-decoration top-right"></div>
          <div className="page-decoration bottom-left"></div>
          <div className="page-decoration bottom-right"></div>
          
          <div className="stamps-grid">
            {currentVisits.slice(2, 4).map((visit, index) => (
              <div key={index + 2} className="stamp-slot">
                {visit ? (
                  <div 
                    className={`goshuin-stamp ${visit.verified ? 'verified' : ''}`}
                    onClick={() => setSelectedStamp(visit)}
                    style={{
                      '--stamp-color': getSeasonColor(getSeason(visit.timestamp))
                    }}
                  >
                    <div className="stamp-border">
                      <div className="stamp-content">
                        <div className="shrine-name">{visit.shrine?.name || visit.location}</div>
                        <div className="visit-date">
                          {new Date(visit.timestamp).toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="stamp-seal">
                          <div className="seal-text">参拝</div>
                        </div>
                        {visit.verified && (
                          <div className="verified-mark">
                            <span>認証済</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="stamp-effects">
                      <div className="sparkle sparkle-1">✨</div>
                      <div className="sparkle sparkle-2">✨</div>
                      <div className="sparkle sparkle-3">✨</div>
                    </div>
                  </div>
                ) : (
                  <div className="empty-stamp-slot">
                    <div className="empty-decoration">
                      <span>未参拝</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {currentVisits.length < 4 && emptySlots.slice(Math.max(0, 2 - currentVisits.length), 4 - currentVisits.length).map((_, index) => (
              <div key={`empty-right-${index}`} className="stamp-slot">
                <div className="empty-stamp-slot">
                  <div className="empty-decoration">
                    <span>未参拝</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="page-number">{currentPage * 2 + 2}</div>
        </div>
      </div>

      {/* ページナビゲーション */}
      <div className="page-navigation">
        <button 
          className="page-nav-btn prev"
          onClick={() => handlePageFlip('prev')}
          disabled={currentPage === 0 || isFlipping}
        >
          <span className="nav-icon">◀</span>
          前のページ
        </button>
        
        <div className="page-indicator">
          <span className="current-page">{currentPage + 1}</span>
          <span className="separator">/</span>
          <span className="total-pages">{totalPages || 1}</span>
        </div>
        
        <button 
          className="page-nav-btn next"
          onClick={() => handlePageFlip('next')}
          disabled={currentPage >= totalPages - 1 || isFlipping}
        >
          次のページ
          <span className="nav-icon">▶</span>
        </button>
      </div>

      {/* 選択した御朱印の詳細 */}
      {selectedStamp && (
        <div className="stamp-detail-modal" onClick={() => setSelectedStamp(null)}>
          <div className="stamp-detail-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedStamp(null)}>✕</button>
            <h3>{selectedStamp.shrine?.name || selectedStamp.location}</h3>
            <div className="detail-info">
              <p>参拝日：{new Date(selectedStamp.timestamp).toLocaleDateString('ja-JP')}</p>
              <p>認証方法：{selectedStamp.verificationMethod === 'photo' ? '📷 写真' : '📍 GPS'}</p>
              {selectedStamp.culturalValue && (
                <p>文化価値：{selectedStamp.culturalValue} ポイント</p>
              )}
            </div>
            {selectedStamp.photo && (
              <div className="stamp-photo">
                <img src={selectedStamp.photo} alt="参拝写真" />
              </div>
            )}
            <div className="stamp-actions">
              <button className="action-btn share-btn">
                <span className="btn-icon">🔗</span>
                シェア
              </button>
              <button className="action-btn detail-btn" onClick={() => onSelectVisit(selectedStamp)}>
                <span className="btn-icon">📖</span>
                詳細を見る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoshuinchoCollection;