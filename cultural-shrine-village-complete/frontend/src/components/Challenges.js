import React from 'react';
import './Challenges.css';

const CHALLENGES = [
  {
    id: 1,
    type: 'daily',
    title: 'デイリーチャレンジ',
    description: '3つの習慣を完了する',
    progress: 1,
    total: 3,
    reward: '50 EXP',
    emoji: '📅'
  },
  {
    id: 2,
    type: 'weekly',
    title: 'ウィークリーチャレンジ',
    description: '7日連続ログイン',
    progress: 4,
    total: 7,
    reward: '特別な虹の木',
    emoji: '📆'
  },
  {
    id: 3,
    type: 'special',
    title: '春の特別チャレンジ',
    description: '新しい習慣を3つ作成',
    progress: 1,
    total: 3,
    reward: '桜の森テーマ',
    emoji: '🌸'
  },
  {
    id: 4,
    type: 'achievement',
    title: 'マスターチャレンジ',
    description: '100日間の総ストリーク',
    progress: 28,
    total: 100,
    reward: 'レジェンドバッジ',
    emoji: '👑'
  }
];

function Challenges({ onChallengeComplete }) {
  const getProgressPercentage = (progress, total) => {
    return (progress / total) * 100;
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'daily': return '#4CAF50';
      case 'weekly': return '#2196F3';
      case 'special': return '#FF6B6B';
      case 'achievement': return '#FFD700';
      default: return '#9C27B0';
    }
  };

  return (
    <div className="challenges">
      <h3>🎯 チャレンジ</h3>
      <div className="challenges-list">
        {CHALLENGES.map((challenge) => (
          <div key={challenge.id} className="challenge-card">
            <div className="challenge-header">
              <span className="challenge-emoji">{challenge.emoji}</span>
              <div className="challenge-info">
                <h4>{challenge.title}</h4>
                <p>{challenge.description}</p>
              </div>
            </div>
            
            <div className="challenge-progress">
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${getProgressPercentage(challenge.progress, challenge.total)}%`,
                    backgroundColor: getTypeColor(challenge.type)
                  }}
                />
              </div>
              <span className="progress-text">
                {challenge.progress} / {challenge.total}
              </span>
            </div>
            
            <div className="challenge-reward">
              <span>報酬: {challenge.reward}</span>
              {challenge.progress >= challenge.total && (
                <button 
                  className="claim-btn"
                  onClick={() => onChallengeComplete(challenge)}
                >
                  受け取る
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Challenges;