import React, { useState, useEffect } from 'react';
import { useHabitLoop } from '../../core/hooks/useHabitLoop';
import './VisitFAB.css';

const VisitFAB = () => {
  const { 
    canVisit, 
    nearbyShrine, 
    isVisiting,
    triggerVisit,
    streak 
  } = useHabitLoop();
  
  const [isPressed, setIsPressed] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  
  // 神社が近くにある時にパルスアニメーション
  useEffect(() => {
    if (nearbyShrine && canVisit) {
      const interval = setInterval(() => {
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 2000);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [nearbyShrine, canVisit]);
  
  const handleClick = async () => {
    if (!canVisit || isVisiting) return;
    
    setIsPressed(true);
    await triggerVisit();
    setIsPressed(false);
  };
  
  return (
    <div className="visit-fab-container">
      {/* ストリーク表示 */}
      {streak > 0 && (
        <div className="streak-badge">
          <span className="streak-number">{streak}</span>
          <span className="streak-text">日</span>
        </div>
      )}
      
      {/* メインFABボタン */}
      <button
        className={`visit-fab ${isPressed ? 'pressed' : ''} ${showPulse ? 'pulse' : ''} ${!canVisit ? 'disabled' : ''}`}
        onClick={handleClick}
        disabled={!canVisit || isVisiting}
      >
        {isVisiting ? (
          <div className="loading-spinner" />
        ) : (
          <>
            <span className="fab-icon">⛩️</span>
            <span className="fab-text">参拝する</span>
          </>
        )}
      </button>
      
      {/* 神社名表示 */}
      {nearbyShrine && (
        <div className="shrine-hint">
          <span className="shrine-name">{nearbyShrine.name}</span>
          <span className="distance">{nearbyShrine.distance}m</span>
        </div>
      )}
    </div>
  );
};

export default VisitFAB;