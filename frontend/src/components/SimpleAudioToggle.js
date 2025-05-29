import React, { useState, useEffect } from 'react';
import gagakuAudio from '../services/gagakuAudio';
import './SimpleAudioToggle.css';

const SimpleAudioToggle = () => {
  const [isEnabled, setIsEnabled] = useState(gagakuAudio.getState());
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // ユーザーインタラクション後に音声を開始
    const handleFirstInteraction = async () => {
      if (!hasInteracted && isEnabled) {
        setHasInteracted(true);
        await gagakuAudio.play();
      }
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [hasInteracted, isEnabled]);

  const handleToggle = () => {
    const newState = gagakuAudio.toggle();
    setIsEnabled(newState);
    
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  return (
    <button
      className={`audio-toggle ${isEnabled ? 'enabled' : 'disabled'}`}
      onClick={handleToggle}
      title={isEnabled ? '雅楽をオフにする' : '雅楽をオンにする'}
    >
      {isEnabled ? '🎵' : '🔇'}
    </button>
  );
};

export default SimpleAudioToggle;