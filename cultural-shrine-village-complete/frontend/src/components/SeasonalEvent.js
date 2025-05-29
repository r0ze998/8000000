import React, { useState, useEffect } from 'react';
import './SeasonalEvent.css';

const SEASONAL_EVENTS = {
  spring: {
    name: '春の開花祭',
    emoji: '🌸',
    bonus: '桜の木が2倍',
    theme: 'sakura',
    background: 'linear-gradient(135deg, #ffb7c5 0%, #ffc0cb 100%)'
  },
  summer: {
    name: '夏の成長期',
    emoji: '☀️',
    bonus: 'EXP 1.5倍',
    theme: 'tropical',
    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
  },
  autumn: {
    name: '秋の収穫祭',
    emoji: '🍁',
    bonus: '特別な紅葉の木',
    theme: 'autumn',
    background: 'linear-gradient(135deg, #fa8072 0%, #ff6347 100%)'
  },
  winter: {
    name: '冬の魔法',
    emoji: '❄️',
    bonus: 'クリスタルツリー',
    theme: 'winter',
    background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)'
  }
};

function SeasonalEvent({ onThemeChange }) {
  const [currentSeason, setCurrentSeason] = useState('spring');
  const [timeLeft, setTimeLeft] = useState({ days: 14, hours: 8, minutes: 32 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        }
        return prev;
      });
    }, 60000); // 1分ごと

    return () => clearInterval(timer);
  }, []);

  const event = SEASONAL_EVENTS[currentSeason];

  return (
    <div className="seasonal-event" style={{ background: event.background }}>
      <div className="event-header">
        <span className="event-emoji">{event.emoji}</span>
        <h3>{event.name}</h3>
        <span className="event-emoji">{event.emoji}</span>
      </div>
      
      <div className="event-content">
        <p className="event-bonus">🎁 {event.bonus}</p>
        <div className="event-timer">
          <span>残り時間: </span>
          <span className="time-unit">{timeLeft.days}日</span>
          <span className="time-unit">{timeLeft.hours}時間</span>
          <span className="time-unit">{timeLeft.minutes}分</span>
        </div>
      </div>
      
      <div className="season-selector">
        {Object.entries(SEASONAL_EVENTS).map(([season, data]) => (
          <button
            key={season}
            className={`season-btn ${currentSeason === season ? 'active' : ''}`}
            onClick={() => {
              setCurrentSeason(season);
              onThemeChange(season);
            }}
            title={data.name}
          >
            {data.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SeasonalEvent;