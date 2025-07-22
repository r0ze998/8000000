import React from 'react';

const PrayerSelectionModal = ({ prayerTypes, onSelect, onClose }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs === 0 ? `${mins}分` : `${mins}分${secs}秒`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">🙏 祈りの種類を選択</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="grid grid-2" style={{ gap: '1rem' }}>
          {Object.entries(prayerTypes).map(([key, prayer]) => (
            <button
              key={key}
              className="card"
              onClick={() => onSelect(key)}
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                padding: '1.5rem',
                background: `linear-gradient(135deg, ${prayer.color}20, ${prayer.color}10)`,
                border: `2px solid ${prayer.color}40`,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.borderColor = prayer.color;
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.borderColor = `${prayer.color}40`;
              }}
            >
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem',
                filter: `drop-shadow(0 0 10px ${prayer.color})`
              }}>
                {prayer.name.split(' ')[0]}
              </div>
              
              <div style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem',
                color: prayer.color
              }}>
                {prayer.name.split(' ')[1]}
              </div>
              
              <div style={{ 
                fontSize: '1rem', 
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '1rem' 
              }}>
                {formatDuration(prayer.duration)}
              </div>
              
              <div style={{ 
                fontSize: '0.9rem', 
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.4'
              }}>
                {getDescription(key)}
              </div>
            </button>
          ))}
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          💡 祈りの時間中は呼吸ガイドに従って瞑想してください
        </div>
      </div>
    </div>
  );
};

const getDescription = (prayerType) => {
  const descriptions = {
    meditation: '心を静めて内省する時間。集中力と精神の安定を高めます。',
    gratitude: '感謝の気持ちを込めて祈る。日々の恵みに感謝します。',
    peace: '平和への祈り。心の平穏と世界の調和を願います。',
    health: '健康への祈り。身体と心の健やかさを願います。',
    goals: '目標達成への祈り。願いの実現と努力の実りを祈ります。',
    fortune: '運気上昇の祈り。幸運と良縁に恵まれることを願います。'
  };
  return descriptions[prayerType] || '';
};

export default PrayerSelectionModal;