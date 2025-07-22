import React from 'react';

const CulturalBelt = ({ culturalCapital }) => {
  const getBeltColor = (capital) => {
    if (capital < 100) return '#FFFFFF';
    if (capital < 300) return '#FFFF00';
    if (capital < 600) return '#FFA500';
    if (capital < 1000) return '#008000';
    return '#000000';
  };

  const getBeltLevel = (capital) => {
    if (capital < 100) return '白帯';
    if (capital < 300) return '黄帯';
    if (capital < 600) return '橙帯';
    if (capital < 1000) return '緑帯';
    return '黒帯';
  };

  const getBeltIcon = (capital) => {
    if (capital < 100) return '⚪';
    if (capital < 300) return '🟡';
    if (capital < 600) return '🟠';
    if (capital < 1000) return '🟢';
    return '⚫';
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '15px', 
      margin: '20px 0',
      justifyContent: 'center',
      background: 'rgba(255,255,255,0.1)',
      padding: '15px 25px',
      borderRadius: '25px',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ fontSize: '24px' }}>{getBeltIcon(culturalCapital)}</div>
      <div
        style={{
          width: '100px',
          height: '25px',
          backgroundColor: getBeltColor(culturalCapital),
          border: '3px solid rgba(255,255,255,0.3)',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      />
      <span style={{ 
        fontSize: '18px', 
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        {getBeltLevel(culturalCapital)} ({culturalCapital})
      </span>
    </div>
  );
};

export default CulturalBelt;