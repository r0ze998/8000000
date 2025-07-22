import React from 'react';

export const SakuraParticles = ({ count }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: '10px',
          height: '10px',
          background: '#ffb3ba',
          borderRadius: '50%',
          animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
          opacity: 0.7
        }}
      />
    ))}
  </div>
);

export const LightParticles = ({ color }) => (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: '4px',
          height: '4px',
          background: color,
          borderRadius: '50%',
          animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
          opacity: 0.5
        }}
      />
    ))}
  </div>
);