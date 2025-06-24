import React, { useState, useEffect } from 'react';

function HomeTab({ 
  userProfile = {}, 
  userLocation = {}, 
  onShrineSelect = () => {},
  onActivityStart = () => {},
  onEventJoin = () => {}
}) {
  const [nearbySpots, setNearbySpots] = useState([]);
  const [todaysPick, setTodaysPick] = useState(null);
  const [seasonalEvents, setSeasonalEvents] = useState([]);
  const [userProgress, setUserProgress] = useState({
    weeklyVisits: { current: 0, goal: 3 },
    monthlyLearning: { current: 0, goal: 120 }
  });
  const [communityHighlights, setCommunityHighlights] = useState([]);

  useEffect(() => {
    loadHomeContent();
  }, [userLocation]);

  const loadHomeContent = () => {
    // 今日のおすすめ
    setTodaysPick({
      type: 'seasonal_shrine',
      shrine: {
        name: '明治神宮',
        reason: '初夏の新緑が美しい季節です',
        image: '/images/meiji-jingu-summer.jpg',
        distance: '2.3km',
        culturalPoints: 150,
        specialEvent: '夏越の大祓'
      },
      learningTip: {
        title: '夏越の大祓とは？',
        content: '半年間の穢れを祓い、残り半年の無病息災を祈る神事',
        readTime: '3分'
      }
    });

    // 近くのスポット
    setNearbySpots([
      {
        id: 'shrine_1',
        type: 'shrine',
        name: '根津神社',
        distance: '0.8km',
        features: ['つつじ祭り開催中', '重要文化財'],
        quickAction: '今すぐ参拝',
        estimatedTime: '30分',
        currentVisitors: 45
      },
      {
        id: 'spot_1',
        type: 'cultural_spot',
        name: '文京ふるさと歴史館',
        distance: '1.2km',
        features: ['神社の歴史展示', '無料入館日'],
        quickAction: '展示を見る',
        estimatedTime: '45分'
      },
      {
        id: 'event_1',
        type: 'community_event',
        name: '地域文化交流会',
        distance: '1.5km',
        features: ['神楽体験', '10名限定'],
        quickAction: '参加申込',
        spotsLeft: 3
      }
    ]);

    // 季節のイベント
    setSeasonalEvents([
      {
        id: 'summer_2024',
        title: '夏の神社スタンプラリー',
        period: '7月1日〜8月31日',
        progress: { current: 3, total: 10 },
        reward: '限定御朱印帳NFT',
        participants: 1234
      }
    ]);

    // ユーザーの進捗
    setUserProgress({
      weeklyVisits: { current: 2, goal: 3 },
      monthlyLearning: { current: 45, goal: 60 }, // 分
      culturalLevel: { current: 12, nextLevel: 15 },
      activeQuests: 3
    });

    // コミュニティハイライト
    setCommunityHighlights([
      {
        type: 'achievement',
        user: '文化探求者A',
        content: '100社参拝達成！',
        likes: 234,
        time: '2時間前'
      },
      {
        type: 'knowledge_share',
        user: '神社建築研究家',
        content: '春日造と流造の違いについて解説記事を投稿',
        likes: 89,
        time: '5時間前'
      }
    ]);
  };

  // クイックアクション処理
  const handleQuickAction = (item) => {
    switch(item.type) {
      case 'shrine':
        onShrineSelect(item);
        break;
      case 'cultural_spot':
        onActivityStart('museum_visit', item);
        break;
      case 'community_event':
        onEventJoin(item);
        break;
      default:
        break;
    }
  };

  // 進捗率計算
  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="home-tab">
      {/* ウェルカムヘッダー */}
      <div className="welcome-header">
        <div className="greeting">
          <h2>こんにちは、{userProfile.name || 'プレイヤー'}さん</h2>
          <p className="subtitle">今日も文化探訪を楽しみましょう</p>
        </div>
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-value">{userProfile.level || 1}</span>
            <span className="stat-label">レベル</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userProfile.stats?.totalVisits || 0}</span>
            <span className="stat-label">参拝数</span>
          </div>
        </div>
      </div>

      {/* 今日のおすすめ */}
      {todaysPick && (
        <div className="todays-pick section">
          <h3 className="section-title">
            <span className="icon">✨</span>
            今日のおすすめ
          </h3>
          <div className="pick-card">
            <div className="pick-image">
              <div className="image-placeholder shrine-image">
                <span className="distance-badge">{todaysPick.shrine.distance}</span>
              </div>
            </div>
            <div className="pick-content">
              <h4>{todaysPick.shrine.name}</h4>
              <p className="pick-reason">{todaysPick.shrine.reason}</p>
              {todaysPick.shrine.specialEvent && (
                <div className="special-event">
                  <span className="event-badge">🎋 {todaysPick.shrine.specialEvent}</span>
                </div>
              )}
              <div className="pick-actions">
                <button 
                  className="primary-action-btn"
                  onClick={() => onShrineSelect(todaysPick.shrine)}
                >
                  詳細を見る
                </button>
                <button className="secondary-action-btn">
                  ルート案内
                </button>
              </div>
            </div>
          </div>

          {/* 学びのヒント */}
          {todaysPick.learningTip && (
            <div className="learning-tip">
              <h5>💡 {todaysPick.learningTip.title}</h5>
              <p>{todaysPick.learningTip.content}</p>
              <span className="read-time">{todaysPick.learningTip.readTime}で読める</span>
            </div>
          )}
        </div>
      )}

      {/* 近くのスポット */}
      <div className="nearby-spots section">
        <h3 className="section-title">
          <span className="icon">📍</span>
          近くのスポット
        </h3>
        <div className="spots-list">
          {nearbySpots.map(spot => (
            <div key={spot.id} className="spot-card">
              <div className="spot-header">
                <h4>{spot.name}</h4>
                <span className="distance">{spot.distance}</span>
              </div>
              <div className="spot-features">
                {spot.features.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
              <div className="spot-footer">
                <span className="time-estimate">
                  {spot.estimatedTime && `🕐 ${spot.estimatedTime}`}
                  {spot.spotsLeft !== undefined && `👥 残り${spot.spotsLeft}名`}
                  {spot.currentVisitors && `👥 ${spot.currentVisitors}人が訪問中`}
                </span>
                <button 
                  className="quick-action-btn"
                  onClick={() => handleQuickAction(spot)}
                >
                  {spot.quickAction}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 今週の目標 */}
      <div className="weekly-goals section">
        <h3 className="section-title">
          <span className="icon">🎯</span>
          今週の目標
        </h3>
        <div className="goals-grid">
          <div className="goal-card">
            <h5>参拝目標</h5>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${calculateProgress(userProgress.weeklyVisits?.current || 0, userProgress.weeklyVisits?.goal || 3)}%` }}
              />
            </div>
            <span className="progress-text">
              {userProgress.weeklyVisits?.current || 0}/{userProgress.weeklyVisits?.goal || 3}回
            </span>
          </div>
          <div className="goal-card">
            <h5>学習時間</h5>
            <div className="progress-bar">
              <div 
                className="progress-fill learning"
                style={{ width: `${calculateProgress(userProgress.monthlyLearning?.current || 0, userProgress.monthlyLearning?.goal || 120)}%` }}
              />
            </div>
            <span className="progress-text">
              {userProgress.monthlyLearning?.current || 0}/{userProgress.monthlyLearning?.goal || 120}分
            </span>
          </div>
        </div>
      </div>

      {/* 季節のイベント */}
      {seasonalEvents.length > 0 && (
        <div className="seasonal-events section">
          <h3 className="section-title">
            <span className="icon">🎌</span>
            開催中のイベント
          </h3>
          {seasonalEvents.map(event => (
            <div key={event.id} className="event-banner">
              <div className="event-info">
                <h4>{event.title}</h4>
                <p className="event-period">{event.period}</p>
                <div className="event-progress">
                  <span>進捗: {event.progress.current}/{event.progress.total}</span>
                  <span className="participants">👥 {event.participants}人参加中</span>
                </div>
              </div>
              <div className="event-reward">
                <span className="reward-label">報酬</span>
                <span className="reward-name">{event.reward}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* コミュニティハイライト */}
      <div className="community-highlights section">
        <h3 className="section-title">
          <span className="icon">🌟</span>
          コミュニティの話題
        </h3>
        <div className="highlights-feed">
          {communityHighlights.map((highlight, index) => (
            <div key={index} className="highlight-item">
              <div className="highlight-header">
                <span className="user-name">{highlight.user}</span>
                <span className="time">{highlight.time}</span>
              </div>
              <p className="highlight-content">{highlight.content}</p>
              <div className="highlight-footer">
                <span className="likes">❤️ {highlight.likes}</span>
                <button className="interact-btn">詳しく見る</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* クイックアクセス */}
      <div className="quick-access">
        <button className="quick-btn" onClick={() => onActivityStart('camera_scan')}>
          <span className="btn-icon">📷</span>
          <span className="btn-label">参拝記録</span>
        </button>
        <button className="quick-btn" onClick={() => onActivityStart('learning')}>
          <span className="btn-icon">📚</span>
          <span className="btn-label">学習開始</span>
        </button>
        <button className="quick-btn" onClick={() => onActivityStart('map_explore')}>
          <span className="btn-icon">🗺️</span>
          <span className="btn-label">地図で探す</span>
        </button>
        <button className="quick-btn" onClick={() => onActivityStart('community')}>
          <span className="btn-icon">👥</span>
          <span className="btn-label">交流する</span>
        </button>
      </div>

      <style jsx>{`
        /* ホームタブ CSS */
        .home-tab {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          padding-bottom: 80px;
        }

        /* ウェルカムヘッダー */
        .welcome-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .greeting h2 {
          color: #FFD700;
          font-size: 1.5rem;
          margin-bottom: 5px;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .quick-stats {
          display: flex;
          gap: 20px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.8rem;
          font-weight: bold;
          color: #FFD700;
        }

        .stat-label {
          display: block;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 5px;
        }

        /* セクション共通 */
        .section {
          margin-bottom: 30px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #FFD700;
          font-size: 1.2rem;
          margin-bottom: 15px;
        }

        .section-title .icon {
          font-size: 1.3rem;
        }

        /* 今日のおすすめ */
        .pick-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 20px;
          border: 1px solid rgba(255, 215, 0, 0.2);
          margin-bottom: 15px;
        }

        .pick-image {
          margin-bottom: 15px;
        }

        .image-placeholder {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #FF6B35 0%, #FFD700 100%);
          border-radius: 15px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
        }

        .shrine-image::before {
          content: '⛩️';
        }

        .distance-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
        }

        .pick-content h4 {
          color: #FFD700;
          font-size: 1.3rem;
          margin-bottom: 8px;
        }

        .pick-reason {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 10px;
        }

        .special-event {
          margin-bottom: 15px;
        }

        .event-badge {
          background: rgba(255, 107, 53, 0.2);
          color: #FF6B35;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.9rem;
          border: 1px solid rgba(255, 107, 53, 0.3);
        }

        .pick-actions {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 10px;
        }

        .primary-action-btn, .secondary-action-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-action-btn {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
        }

        .secondary-action-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .primary-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
        }

        .secondary-action-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* 学びのヒント */
        .learning-tip {
          background: rgba(33, 150, 243, 0.1);
          border-left: 3px solid #2196F3;
          padding: 15px;
          border-radius: 10px;
        }

        .learning-tip h5 {
          color: #2196F3;
          margin-bottom: 8px;
        }

        .learning-tip p {
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .read-time {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
        }

        /* 近くのスポット */
        .spots-list {
          display: grid;
          gap: 15px;
        }

        .spot-card {
          background: white;
          border-radius: 15px;
          padding: 15px;
          border: 1px solid #e0e0e0;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .spot-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .spot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .spot-header h4 {
          color: #333;
          font-size: 1.1rem;
          margin: 0;
          font-weight: 600;
        }

        .distance {
          background: #f0f0f0;
          padding: 4px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
          color: #666;
          font-weight: 500;
        }

        .spot-features {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .feature-tag {
          background: rgba(76, 175, 80, 0.2);
          color: #4CAF50;
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
        }

        .spot-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .time-estimate {
          color: #666;
          font-size: 0.8rem;
        }

        .quick-action-btn {
          background: linear-gradient(135deg, #2196F3, #03DAC6);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quick-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(33, 150, 243, 0.4);
        }

        /* 今週の目標 */
        .goals-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .goal-card {
          background: white;
          padding: 15px;
          border-radius: 15px;
          border: 1px solid #e0e0e0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .goal-card h5 {
          color: #333;
          font-size: 0.9rem;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50, #8BC34A);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-fill.learning {
          background: linear-gradient(90deg, #2196F3, #03DAC6);
        }

        .progress-text {
          color: #666;
          font-size: 0.8rem;
          font-weight: 500;
        }

        /* 季節のイベント */
        .event-banner {
          background: linear-gradient(135deg, #fff8e1, #ffecb3);
          border: 1px solid #ffc107;
          border-radius: 15px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(255, 193, 7, 0.2);
        }

        .event-info h4 {
          color: #e65100;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .event-period {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .event-progress {
          display: flex;
          gap: 15px;
          color: #666;
          font-size: 0.8rem;
        }

        .event-reward {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          padding: 10px 15px;
          border-radius: 12px;
        }

        .reward-label {
          display: block;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.8rem;
          margin-bottom: 5px;
        }

        .reward-name {
          color: #FFD700;
          font-weight: bold;
          font-size: 0.9rem;
        }

        /* コミュニティハイライト */
        .highlights-feed {
          display: grid;
          gap: 15px;
        }

        .highlight-item {
          background: white;
          padding: 15px;
          border-radius: 12px;
          border-left: 3px solid #ffc107;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .highlight-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .user-name {
          color: #e65100;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .time {
          color: #666;
          font-size: 0.8rem;
        }

        .highlight-content {
          color: #333;
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .highlight-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .likes {
          color: #666;
          font-size: 0.8rem;
        }

        .interact-btn {
          background: none;
          color: #2196F3;
          border: none;
          font-size: 0.8rem;
          cursor: pointer;
          text-decoration: underline;
        }

        /* クイックアクセス */
        .quick-access {
          position: fixed;
          bottom: calc(60px + env(safe-area-inset-bottom));
          left: 50%;
          transform: translateX(-50%);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          background: white;
          padding: 15px;
          border-radius: 20px;
          max-width: 400px;
          width: calc(100% - 40px);
          box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.15);
          border: 1px solid #e0e0e0;
        }

        .quick-btn {
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 15px;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quick-btn:hover {
          background: #e9ecef;
          transform: translateY(-2px);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
        }

        .btn-icon {
          font-size: 1.5rem;
        }

        .btn-label {
          font-size: 0.7rem;
          color: #666;
          font-weight: 500;
        }

        /* レスポンシブ対応 */
        @media (max-width: 480px) {
          .welcome-header {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
          
          .goals-grid {
            grid-template-columns: 1fr;
          }
          
          .pick-actions {
            grid-template-columns: 1fr;
          }
          
          .event-banner {
            flex-direction: column;
            gap: 15px;
          }
          
          .quick-access {
            bottom: calc(50px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
}

export default HomeTab;