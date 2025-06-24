import React, { useState, useEffect } from 'react';
import { useHabitLoop } from '../../../frontend/src/core/hooks/useHabitLoop';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { screenReader } from '../../../frontend/src/utils/accessibility';

const HomeTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState('');
  
  const {
    canVisit,
    nearbyShrine,
    streak,
    todayVisited,
    isVisiting,
    lastVisit,
    triggerVisit
  } = useHabitLoop();
  
  // 初期化
  useEffect(() => {
    const initializeHome = async () => {
      setTimeOfDay(getTimeOfDay());
      
      // パフォーマンス最適化：少し遅延させてからローディング完了
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsLoading(false);
    };
    
    initializeHome();
  }, []);
  
  // 時間帯の取得
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'dusk';
    return 'night';
  };
  
  // 挨拶メッセージ
  const getGreeting = () => {
    const greetings = {
      dawn: '早朝の参拝は特別な功徳があります',
      morning: 'おはようございます',
      afternoon: 'こんにちは',
      dusk: '夕暮れの参拝で一日を締めくくりましょう',
      night: 'お疲れ様でした'
    };
    return greetings[timeOfDay] || 'こんにちは';
  };
  
  // 参拝ステータス
  const getVisitStatus = () => {
    if (todayVisited) {
      return {
        type: 'completed',
        icon: '✅',
        title: '今日の参拝完了',
        message: `連続${streak}日目達成！`,
        action: null
      };
    }
    
    if (nearbyShrine) {
      return {
        type: 'ready',
        icon: '⛩️',
        title: `${nearbyShrine.name}が近くにあります`,
        message: 'タップして参拝しましょう',
        action: 'visit'
      };
    }
    
    return {
      type: 'search',
      icon: '📍',
      title: '神社を探しています',
      message: '近くの神社に移動するか、QRコードで参拝できます',
      action: 'scan'
    };
  };
  
  // 参拝実行
  const handleVisit = async () => {
    if (!canVisit || isVisiting || todayVisited) return;
    
    try {
      screenReader.announce('参拝を開始します');
      const result = await triggerVisit();
      
      if (result) {
        screenReader.announce('参拝が完了しました。報酬を確認してください');
      }
    } catch (error) {
      console.error('Visit failed:', error);
      screenReader.announce('参拝に失敗しました。もう一度お試しください');
    }
  };
  
  // QRスキャン開始
  const handleScanQR = () => {
    // QRスキャナーを起動（親コンポーネントに委譲）
    screenReader.announce('QRコードスキャナーを起動します');
    // TODO: QRスキャナーモーダルを開く処理を追加
  };
  
  if (isLoading) {
    return <LoadingSkeleton type="home" />;
  }
  
  const status = getVisitStatus();
  
  return (
    <main 
      className="simple-home"
      role="main"
      aria-label="ホーム画面"
    >
      {/* ヘッダー */}
      <header className="home-header">
        <div className="greeting">
          <span className="time-icon" role="img" aria-label={timeOfDay}>
            {timeOfDay === 'dawn' ? '🌅' : 
             timeOfDay === 'morning' ? '☀️' : 
             timeOfDay === 'afternoon' ? '🌤️' : 
             timeOfDay === 'dusk' ? '🌇' : '🌙'}
          </span>
          <h1 className="greeting-text">{getGreeting()}</h1>
        </div>
      </header>
      
      {/* メインコンテンツ */}
      <section className="visit-section" aria-label="参拝セクション">
        {/* 連続記録表示 */}
        <div className="streak-display">
          <div className="streak-number" aria-label={`連続${streak}日`}>
            <span className="streak-icon">🔥</span>
            <span className="streak-count">{streak}</span>
          </div>
          <p className="streak-label">連続参拝日数</p>
        </div>
        
        {/* 参拝ステータス */}
        <div className={`visit-status status-${status.type}`}>
          <div className="status-icon" role="img" aria-label={status.title}>
            {status.icon}
          </div>
          <h2 className="status-title">{status.title}</h2>
          <p className="status-message">{status.message}</p>
          
          {/* アクションボタン */}
          {status.action && (
            <div className="action-container">
              {status.action === 'visit' ? (
                <button
                  className="visit-button primary"
                  onClick={handleVisit}
                  disabled={isVisiting}
                  aria-label={`${nearbyShrine?.name}で参拝する`}
                >
                  {isVisiting ? (
                    <>
                      <span className="loading-spinner" aria-hidden="true" />
                      <span>参拝中...</span>
                    </>
                  ) : (
                    <>
                      <span className="button-icon">⛩️</span>
                      <span>参拝する</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="scan-button secondary"
                  onClick={handleScanQR}
                  aria-label="QRコードをスキャンして参拝"
                >
                  <span className="button-icon">📱</span>
                  <span>QRで参拝</span>
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* 最後の参拝情報 */}
        {lastVisit && !todayVisited && (
          <div className="last-visit-info">
            <p className="last-visit-text">
              最後の参拝: {new Date(lastVisit).toLocaleDateString()}
            </p>
          </div>
        )}
        
        {/* 今日完了時の次回案内 */}
        {todayVisited && (
          <div className="next-visit-hint">
            <p>明日も参拝して記録を伸ばしましょう！</p>
            <small>朝の通知でお知らせします</small>
          </div>
        )}
      </section>
      
      {/* 今日の統計（簡潔に） */}
      <section className="today-stats" aria-label="今日の統計">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{todayVisited ? '1' : '0'}</div>
            <div className="stat-label">今日の参拝</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{streak}</div>
            <div className="stat-label">連続日数</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeTab;