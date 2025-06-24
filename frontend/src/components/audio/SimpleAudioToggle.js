import React, { useState, useEffect, useRef } from 'react';
import audioManager from '../services/audioManager';
import './SimpleAudioToggle.css';

const SimpleAudioToggle = () => {
  const [isEnabled, setIsEnabled] = useState(audioManager.bgmEnabled);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    // ユーザーインタラクション後に音声を開始
    const handleFirstInteraction = async () => {
      if (!hasInteracted && isEnabled) {
        setHasInteracted(true);
        await audioManager.playBGM();
      }
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [hasInteracted, isEnabled]);

  const handleToggle = () => {
    setIsAnimating(true);
    
    // リップルエフェクトを作成
    const button = buttonRef.current;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    
    // アニメーション後に削除
    setTimeout(() => {
      ripple.remove();
      setIsAnimating(false);
    }, 600);
    
    audioManager.toggleBGM();
    setIsEnabled(audioManager.bgmEnabled);
    
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  return (
    <div className="audio-controls">
      <div className="audio-toggle-wrapper">
        <button
          ref={buttonRef}
          className={`audio-toggle ${isEnabled ? 'enabled' : 'disabled'} ${isAnimating ? 'animating' : ''}`}
          onClick={handleToggle}
          title={isEnabled ? '雅楽をオフにする' : '雅楽をオンにする'}
        >
          <span className="icon-wrapper">
            <span className={`icon music ${isEnabled ? 'active' : ''}`}>🎵</span>
            <span className={`icon mute ${!isEnabled ? 'active' : ''}`}>🔇</span>
          </span>
          {isEnabled && (
            <div className="sound-waves">
              <span className="wave"></span>
              <span className="wave"></span>
              <span className="wave"></span>
            </div>
          )}
        </button>
        {isEnabled && <div className="glow-effect"></div>}
      </div>
      {!hasInteracted && isEnabled && (
        <div className="audio-hint-wrapper">
          <span className="audio-hint">
            <span className="hint-icon">👆</span>
            クリックして音楽を開始
          </span>
        </div>
      )}
    </div>
  );
};

export default SimpleAudioToggle;