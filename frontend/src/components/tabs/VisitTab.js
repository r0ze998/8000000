import React, { useState, useEffect } from 'react';
import { useHabitLoop } from '../../core/hooks/useHabitLoop';
import VisitService from '../../core/services/VisitService';
import LoadingSkeleton from '../LoadingSkeleton';
import './VisitTab.css';

const VisitTab = () => {
  const [visitHistory, setVisitHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, week, month
  
  const { streak, todayVisited } = useHabitLoop();
  
  useEffect(() => {
    loadVisitHistory();
  }, []);
  
  const loadVisitHistory = async () => {
    try {
      const history = VisitService.getVisitHistory('user_001', 50);
      setVisitHistory(history);
    } catch (error) {
      console.error('Failed to load visit history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // フィルタリングされた履歴
  const getFilteredHistory = () => {
    if (selectedFilter === 'all') return visitHistory;
    
    const now = new Date();
    const filterDate = new Date();
    
    if (selectedFilter === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (selectedFilter === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
    }
    
    return visitHistory.filter(visit => 
      new Date(visit.timestamp) >= filterDate
    );
  };
  
  // 参拝統計の計算
  const getVisitStats = () => {
    const total = visitHistory.length;
    const thisWeek = visitHistory.filter(visit => {
      const visitDate = new Date(visit.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return visitDate >= weekAgo;
    }).length;
    
    const thisMonth = visitHistory.filter(visit => {
      const visitDate = new Date(visit.timestamp);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return visitDate >= monthAgo;
    }).length;
    
    return { total, thisWeek, thisMonth };
  };
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '今日';
    if (diffDays === 2) return '昨日';
    if (diffDays <= 7) return `${diffDays - 1}日前`;
    
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return <LoadingSkeleton type="default" count={8} />;
  }
  
  const stats = getVisitStats();
  const filteredHistory = getFilteredHistory();
  
  return (
    <main className="visit-tab" role="main" aria-label="参拝履歴">
      {/* ヘッダー統計 */}
      <section className="visit-stats" aria-label="参拝統計">
        <h1 className="tab-title">参拝履歴</h1>
        
        <div className="stats-overview">
          <div className="stat-card primary">
            <div className="stat-value">{streak}</div>
            <div className="stat-label">連続日数</div>
            <div className="stat-icon">🔥</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">総参拝数</div>
            <div className="stat-icon">⛩️</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.thisMonth}</div>
            <div className="stat-label">今月</div>
            <div className="stat-icon">📅</div>
          </div>
        </div>
      </section>
      
      {/* フィルター */}
      <section className="visit-filters">
        <div className="filter-tabs" role="tablist">
          {[
            { id: 'all', label: 'すべて' },
            { id: 'week', label: '今週' },
            { id: 'month', label: '今月' }
          ].map(filter => (
            <button
              key={filter.id}
              className={`filter-tab ${selectedFilter === filter.id ? 'active' : ''}`}
              role="tab"
              aria-selected={selectedFilter === filter.id}
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>
      
      {/* 参拝履歴リスト */}
      <section className="visit-history" aria-label="参拝履歴一覧">
        {filteredHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⛩️</div>
            <h3>参拝履歴がありません</h3>
            <p>最初の参拝を記録しましょう</p>
          </div>
        ) : (
          <div className="history-list">
            {filteredHistory.map(visit => (
              <article 
                key={visit.id} 
                className="visit-item"
                aria-label={`${visit.shrineName}での参拝記録`}
              >
                <div className="visit-header">
                  <h3 className="shrine-name">{visit.shrineName}</h3>
                  <div className="visit-time">
                    <span className="visit-date">{formatDate(visit.timestamp)}</span>
                    <span className="visit-clock">{formatTime(visit.timestamp)}</span>
                  </div>
                </div>
                
                <div className="visit-details">
                  <div className="visit-method">
                    <span className="method-icon">
                      {visit.verificationMethod === 'location' ? '📍' : '📱'}
                    </span>
                    <span className="method-text">
                      {visit.verificationMethod === 'location' ? '位置情報' : 'QRコード'}
                    </span>
                  </div>
                  
                  {visit.weather && (
                    <div className="visit-weather">
                      <span className="weather-icon">
                        {visit.weather === 'clear' ? '☀️' : 
                         visit.weather === 'cloudy' ? '☁️' :
                         visit.weather === 'rainy' ? '🌧️' :
                         visit.weather === 'snowy' ? '❄️' : '🌤️'}
                      </span>
                      <span className="weather-text">{visit.weather}</span>
                    </div>
                  )}
                  
                  {visit.season && (
                    <div className="visit-season">
                      <span className="season-icon">
                        {visit.season === 'spring' ? '🌸' :
                         visit.season === 'summer' ? '🌻' :
                         visit.season === 'autumn' ? '🍁' : '❄️'}
                      </span>
                      <span className="season-text">{visit.season}</span>
                    </div>
                  )}
                </div>
                
                {/* 特別な条件のバッジ */}
                <div className="visit-badges">
                  {visit.timeOfDay === 'dawn' && (
                    <span className="badge special">早朝参拝</span>
                  )}
                  {visit.moonPhase === 'full' && (
                    <span className="badge rare">満月</span>
                  )}
                  {visit.weather === 'rainy' && (
                    <span className="badge bonus">雨天参拝</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      
      {/* 今日の参拝状況 */}
      {!todayVisited && (
        <section className="today-reminder">
          <div className="reminder-card">
            <span className="reminder-icon">🙏</span>
            <div className="reminder-text">
              <h4>今日の参拝はまだです</h4>
              <p>ホームタブから参拝を記録しましょう</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default VisitTab;