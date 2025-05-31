import React, { useState, useEffect } from 'react';
import './HomeTab.css';

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
    </div>
  );
}

export default HomeTab;