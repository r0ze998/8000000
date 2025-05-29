import React from 'react';
import './AchievementBadges.css';

const ACHIEVEMENTS = [
  { id: 1, name: '初めての一歩', description: '最初の習慣を作成', emoji: '👣', unlocked: true },
  { id: 2, name: '一週間の継続', description: '7日連続で習慣を達成', emoji: '🔥', unlocked: true },
  { id: 3, name: '森の始まり', description: '最初の木を獲得', emoji: '🌱', unlocked: true },
  { id: 4, name: '習慣マスター', description: '30日連続で習慣を達成', emoji: '🏆', unlocked: false },
  { id: 5, name: 'センチュリー', description: '100回習慣を完了', emoji: '💯', unlocked: false },
  { id: 6, name: '伝説の森', description: '100本の木を獲得', emoji: '🌳', unlocked: false },
  { id: 7, name: '黄金の収穫', description: '黄金の木を獲得', emoji: '✨', unlocked: false },
  { id: 8, name: '神秘の発見', description: '神秘の木を獲得', emoji: '🔮', unlocked: false },
  { id: 9, name: '習慣の賢者', description: 'レベル10に到達', emoji: '🧙', unlocked: false },
  { id: 10, name: '永遠の森', description: '365日間習慣を継続', emoji: '♾️', unlocked: false },
];

function AchievementBadges({ unlockedIds = [] }) {
  return (
    <div className="achievement-badges">
      <h3>🏅 アチーブメント</h3>
      <div className="badges-grid">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = achievement.unlocked || unlockedIds.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              className={`badge ${isUnlocked ? 'unlocked' : 'locked'}`}
              title={achievement.description}
            >
              <div className="badge-emoji">
                {isUnlocked ? achievement.emoji : '🔒'}
              </div>
              <div className="badge-name">
                {isUnlocked ? achievement.name : '???'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AchievementBadges;