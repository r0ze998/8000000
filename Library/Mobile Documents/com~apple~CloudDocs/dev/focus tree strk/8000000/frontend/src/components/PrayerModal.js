import React from 'react';

const PrayerModal = ({ prayer, timeRemaining, breathingPhase, onStop }) => {
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((prayer.duration - timeRemaining) / prayer.duration) * 100;

  const getBreathingInstruction = (phase) => {
    switch (phase) {
      case '息を吸って':
        return { text: '息を吸って', icon: '⬆️', color: '#4299E1' };
      case '息を止めて':
        return { text: '息を止めて', icon: '⏸️', color: '#FFD700' };
      case '息を吐いて':
        return { text: '息を吐いて', icon: '⬇️', color: '#48BB78' };
      default:
        return { text: '息を整えて', icon: '🫁', color: '#9F7AEA' };
    }
  };

  const breathingInfo = getBreathingInstruction(breathingPhase);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
        {/* Prayer Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 className="modal-title" style={{ marginBottom: '0.5rem' }}>
            {prayer.name}
          </h3>
          <div style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem'
          }}>
            心を静めて祈りを捧げましょう
          </div>
        </div>

        {/* Central Prayer Circle */}
        <div style={{
          width: '200px',
          height: '200px',
          margin: '0 auto 2rem',
          borderRadius: '50%',
          border: `4px solid ${prayer.color}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(circle, ${prayer.color}10, transparent)`,
          position: 'relative',
          animation: 'pulse 2s infinite'
        }}>
          {/* Large Prayer Emoji */}
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '0.5rem',
            filter: `drop-shadow(0 0 15px ${prayer.color})`
          }}>
            {prayer.name.split(' ')[0]}
          </div>
          
          {/* Timer Display */}
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            color: prayer.color 
          }}>
            {formatTimer(timeRemaining)}
          </div>

          {/* Progress Ring */}
          <svg
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              width: '208px',
              height: '208px',
              transform: 'rotate(-90deg)'
            }}
          >
            <circle
              cx="104"
              cy="104"
              r="100"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="104"
              cy="104"
              r="100"
              stroke={prayer.color}
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 100}`}
              strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress / 100)}`}
              style={{ 
                transition: 'stroke-dashoffset 1s ease',
                filter: `drop-shadow(0 0 10px ${prayer.color})`
              }}
            />
          </svg>
        </div>

        {/* Breathing Guide */}
        <div style={{
          background: `linear-gradient(135deg, ${breathingInfo.color}20, ${breathingInfo.color}10)`,
          border: `1px solid ${breathingInfo.color}40`,
          borderRadius: '15px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ 
            fontSize: '2rem', 
            marginBottom: '0.5rem'
          }}>
            {breathingInfo.icon}
          </div>
          <div style={{ 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            color: breathingInfo.color,
            marginBottom: '0.5rem'
          }}>
            {breathingInfo.text}
          </div>
          <div style={{ 
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            ゆっくりと呼吸を整えてください
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${prayer.color}, ${prayer.color}80)`,
              borderRadius: '4px',
              transition: 'width 1s ease'
            }} />
          </div>
          <div style={{
            textAlign: 'center',
            marginTop: '0.5rem',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            {Math.round(progress)}% 完了
          </div>
        </div>

        {/* Stop Button */}
        <button
          className="btn btn-secondary"
          onClick={onStop}
          style={{ 
            width: '100%',
            background: 'rgba(255, 107, 107, 0.2)',
            borderColor: 'rgba(255, 107, 107, 0.4)',
            color: '#FF6B6B'
          }}
        >
          ⏹️ 祈りを中断
        </button>

        {/* Guidance Text */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.6)',
          lineHeight: '1.4'
        }}>
          💡 呼吸ガイドに合わせてゆっくりと呼吸し、心を落ち着けて祈りに集中してください
        </div>
      </div>
    </div>
  );
};

export default PrayerModal;