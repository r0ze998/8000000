import React, { useState, useEffect } from 'react';
import './PlayerStatus.css';

const PlayerStatus = ({ 
  level = 1, 
  experience = 0, 
  nextLevelExp = 100,
  title = "初詣参拝者",
  rank = "白帯",
  stats = {
    totalVisits: 0,
    uniqueShrines: 0,
    collectedOmamori: 0,
    seasonalEvents: 0
  }
}) => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(level);
  const expPercentage = (experience / nextLevelExp) * 100;

  useEffect(() => {
    if (level > previousLevel) {
      setShowLevelUp(true);
      setPreviousLevel(level);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [level, previousLevel]);

  const getRankColor = (rank) => {
    const rankColors = {
      "白帯": "#ffffff",
      "黄帯": "#ffd700",
      "橙帯": "#ff8c00",
      "緑帯": "#32cd32",
      "青帯": "#00bfff",
      "紫帯": "#9370db",
      "茶帯": "#8b4513",
      "黒帯": "#000000",
      "紅帯": "#dc143c",
      "金帯": "linear-gradient(45deg, #ffd700, #ffed4b, #ffd700)"
    };
    return rankColors[rank] || "#ffffff";
  };

  const getTitleIcon = (title) => {
    const titleIcons = {
      "初詣参拝者": "🎍",
      "神社巡礼者": "⛩️",
      "御朱印収集家": "📜",
      "神社マスター": "🏯",
      "伝説の参拝者": "🌟",
      "神々の使者": "🦊"
    };
    return titleIcons[title] || "🙏";
  };

  return (
    <div className="player-status-container japanese-pattern-bg">
      {/* レベルアップ演出 */}
      {showLevelUp && (
        <div className="level-up-animation">
          <div className="level-up-burst"></div>
          <div className="level-up-text">
            <h1>レベルアップ！</h1>
            <p>Lv.{level}に到達しました！</p>
          </div>
        </div>
      )}

      {/* プレイヤー情報カード */}
      <div className="player-card wa-card">
        <div className="player-header">
          <div className="player-avatar">
            <div className="avatar-frame">
              <div className="avatar-icon">{getTitleIcon(title)}</div>
              <div className="level-badge">Lv.{level}</div>
            </div>
          </div>
          
          <div className="player-info">
            <h2 className="player-title japanese-title">{title}</h2>
            <div 
              className="player-rank"
              style={{ 
                background: typeof getRankColor(rank) === 'string' && getRankColor(rank).includes('gradient') 
                  ? getRankColor(rank) 
                  : getRankColor(rank),
                color: rank === "黒帯" || rank === "茶帯" ? "#ffffff" : "#000000"
              }}
            >
              {rank}
            </div>
          </div>
        </div>

        {/* 経験値バー */}
        <div className="exp-section">
          <div className="exp-label">
            <span>経験値</span>
            <span>{experience} / {nextLevelExp}</span>
          </div>
          <div className="exp-bar-container">
            <div 
              className="exp-bar-fill"
              style={{ width: `${expPercentage}%` }}
            >
              <span className="exp-text">{Math.round(expPercentage)}%</span>
            </div>
          </div>
        </div>

        {/* ステータス */}
        <div className="player-stats">
          <div className="stat-item">
            <div className="stat-icon">⛩️</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalVisits}</div>
              <div className="stat-label">総参拝数</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">🗾</div>
            <div className="stat-info">
              <div className="stat-value">{stats.uniqueShrines}</div>
              <div className="stat-label">訪問神社</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">🎋</div>
            <div className="stat-info">
              <div className="stat-value">{stats.collectedOmamori}</div>
              <div className="stat-label">お守り</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">🎌</div>
            <div className="stat-info">
              <div className="stat-value">{stats.seasonalEvents}</div>
              <div className="stat-label">季節行事</div>
            </div>
          </div>
        </div>

        {/* 実績プレビュー */}
        <div className="achievements-preview">
          <h3>最近の実績</h3>
          <div className="achievement-badges">
            <div className="achievement-badge" title="初めての参拝">
              <span className="badge-icon">🌸</span>
            </div>
            <div className="achievement-badge" title="5つの神社を訪問">
              <span className="badge-icon">🏮</span>
            </div>
            <div className="achievement-badge" title="春の参拝者">
              <span className="badge-icon">🌺</span>
            </div>
            <div className="achievement-badge locked" title="???">
              <span className="badge-icon">🔒</span>
            </div>
          </div>
        </div>
      </div>

      {/* クエスト進行状況 */}
      <div className="active-quests wa-card">
        <h3 className="japanese-title">進行中のクエスト</h3>
        <div className="quest-list">
          <div className="quest-item">
            <div className="quest-icon">📿</div>
            <div className="quest-info">
              <div className="quest-name">初心者の道</div>
              <div className="quest-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '60%' }}></div>
                </div>
                <span className="progress-text">3/5 神社訪問</span>
              </div>
            </div>
            <div className="quest-reward">
              <span className="reward-icon">🎁</span>
              <span className="reward-text">+50 EXP</span>
            </div>
          </div>
          
          <div className="quest-item">
            <div className="quest-icon">🌸</div>
            <div className="quest-info">
              <div className="quest-name">桜の季節</div>
              <div className="quest-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '20%' }}></div>
                </div>
                <span className="progress-text">1/5 桜の名所</span>
              </div>
            </div>
            <div className="quest-reward">
              <span className="reward-icon">🌸</span>
              <span className="reward-text">桜のお守り</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStatus;