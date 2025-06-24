import React from 'react';
import { CULTURAL_ACTIVITIES } from '../constants/culturalActivities';
import { ActivityIconComponents } from './ActivityIcons';

const ActivityButtons = ({ onActivitySelect, onShrineSelect }) => {
  return (
    <div className="activity-section">
      <h2>参拝記録</h2>
      
      {/* 神社・寺院データベースから選択 */}
      <div className="special-activity-section">
        <button
          className="shrine-database-btn"
          onClick={onShrineSelect}
        >
          📚 神社・寺院データベースから選択
        </button>
        <p className="database-description">
          全国200箇所以上の神社・寺院から選択して参拝を記録
        </p>
      </div>
      
      {/* 手動での参拝記録 */}
      <div className="manual-record-section">
        <h3>手動で記録</h3>
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
    </div>
  );
};

export default ActivityButtons;