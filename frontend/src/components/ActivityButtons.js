import React from 'react';
import { CULTURAL_ACTIVITIES } from '../constants/culturalActivities';
import { ActivityIconComponents } from './ActivityIcons';

const ActivityButtons = ({ onActivitySelect, onShrineSelect }) => {
  return (
    <div className="activity-section">
      <h2>文化活動を記録</h2>
      
      {/* 神社・寺院データベースから選択 */}
      <div className="special-activity-section">
        <button
          className="shrine-database-btn"
          onClick={onShrineSelect}
        >
          📚 神社・寺院データベースから選択
        </button>
      </div>
      
      {/* 通常の文化活動 */}
      <div className="activity-grid">
        {Object.entries(CULTURAL_ACTIVITIES).map(([key, activity]) => {
          const IconComponent = ActivityIconComponents[key];
          return (
            <button
              key={key}
              className="activity-button"
              onClick={() => onActivitySelect(key)}
            >
              <div className="activity-icon-wrapper">
                {IconComponent ? <IconComponent size={40} /> : activity.emoji}
              </div>
              <span>{activity.name}</span>
              <span className="exp-label">+{activity.exp} 文化資本</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityButtons;