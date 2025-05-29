import React from 'react';
import { getBeltRank } from './CulturalBelt';

const VillageMembersSection = ({ members, playerShrine, onVisitFriend }) => {
  const getRankEmoji = (capital) => {
    const rank = getBeltRank(capital);
    const emojis = ['⚪', '🟡', '🟠', '🟢', '🔵', '🟣', '🟤', '⚫', '🔴', '🟡'];
    return emojis[rank.level] || '⚪';
  };

  return (
    <div className="village-section">
      <h2>文化村のメンバー</h2>
      <div className="member-list">
        <div className="member-card player">
          <div className="member-header">
            <span className="rank-emoji">{getRankEmoji(playerShrine.culturalCapital)}</span>
            <h3>あなた - {playerShrine.name || '未設定'}</h3>
            <span className="member-level">Lv.{playerShrine.level}</span>
          </div>
          <div className="member-stats">
            <span>📚 {playerShrine.culturalCapital} 文化資本</span>
            <span>🙏 {playerShrine.blessings} ご利益</span>
          </div>
        </div>
        
        {members.map((member) => (
          <div key={member.id} className="member-card">
            <div className="member-header">
              <span className="rank-emoji">{getRankEmoji(member.culturalCapital)}</span>
              <h3>{member.name} - {member.shrine}</h3>
              <span className="member-level">Lv.{member.level}</span>
            </div>
            <div className="member-stats">
              <span>📚 {member.culturalCapital} 文化資本</span>
              <button
                className="visit-button"
                onClick={() => onVisitFriend(member)}
              >
                🎋 訪問
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VillageMembersSection;