import React from 'react';
import './Leaderboard.css';

const mockUsers = [
  { rank: 1, name: 'Forest Master', trees: 156, level: 25, streak: 180 },
  { rank: 2, name: 'Habit Hero', trees: 142, level: 23, streak: 150 },
  { rank: 3, name: 'Daily Warrior', trees: 128, level: 21, streak: 120 },
  { rank: 4, name: 'Tree Collector', trees: 95, level: 18, streak: 90 },
  { rank: 5, name: 'あなた', trees: 4, level: 3, streak: 7, isCurrentUser: true },
];

function Leaderboard() {
  return (
    <div className="leaderboard">
      <h3>🏆 グローバルランキング</h3>
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <span>順位</span>
          <span>ユーザー</span>
          <span>🌳</span>
          <span>Lv</span>
          <span>🔥</span>
        </div>
        {mockUsers.map((user) => (
          <div 
            key={user.rank} 
            className={`leaderboard-row ${user.isCurrentUser ? 'current-user' : ''}`}
          >
            <span className="rank">#{user.rank}</span>
            <span className="name">{user.name}</span>
            <span className="trees">{user.trees}</span>
            <span className="level">{user.level}</span>
            <span className="streak">{user.streak}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;