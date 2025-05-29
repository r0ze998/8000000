import React, { useState, useEffect } from 'react';
import audioManager from '../services/audioManager';
import './AudioControls.css';

const AudioControls = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [bgmEnabled, setBgmEnabled] = useState(audioManager.bgmEnabled);
  const [sfxEnabled, setSfxEnabled] = useState(audioManager.sfxEnabled);
  const [bgmVolume, setBgmVolume] = useState(audioManager.bgmVolume * 100);
  const [sfxVolume, setSfxVolume] = useState(audioManager.sfxVolume * 100);
  const [currentTrack, setCurrentTrack] = useState('main');

  useEffect(() => {
    // 初回BGM再生
    const startAudio = async () => {
      await audioManager.initAudioContext();
      if (bgmEnabled) {
        audioManager.playBGM('main');
      }
    };

    // ユーザーインタラクション後に音声を開始
    const handleFirstInteraction = () => {
      startAudio();
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  const handleBGMToggle = () => {
    audioManager.toggleBGM();
    setBgmEnabled(audioManager.bgmEnabled);
  };

  const handleSFXToggle = () => {
    audioManager.sfxEnabled = !audioManager.sfxEnabled;
    audioManager.saveSettings();
    setSfxEnabled(audioManager.sfxEnabled);
  };

  const handleBGMVolumeChange = (e) => {
    const volume = parseInt(e.target.value) / 100;
    audioManager.setBGMVolume(volume);
    setBgmVolume(parseInt(e.target.value));
  };

  const handleSFXVolumeChange = (e) => {
    const volume = parseInt(e.target.value) / 100;
    audioManager.setSFXVolume(volume);
    setSfxVolume(parseInt(e.target.value));
  };

  const handleTrackChange = (trackName) => {
    setCurrentTrack(trackName);
    audioManager.playBGM(trackName);
  };

  return (
    <div className={`audio-controls ${isExpanded ? 'expanded' : ''}`}>
      <button 
        className="audio-toggle-btn"
        onClick={() => setIsExpanded(!isExpanded)}
        title="音楽設定"
      >
        {bgmEnabled ? '🎵' : '🔇'}
      </button>

      {isExpanded && (
        <div className="audio-panel">
          <h3>🎵 雅楽BGM設定</h3>
          
          {/* BGM ON/OFF */}
          <div className="audio-setting">
            <label>
              <input
                type="checkbox"
                checked={bgmEnabled}
                onChange={handleBGMToggle}
              />
              BGM {bgmEnabled ? 'ON' : 'OFF'}
            </label>
          </div>

          {/* BGM音量 */}
          <div className="audio-setting">
            <label>BGM音量</label>
            <input
              type="range"
              min="0"
              max="100"
              value={bgmVolume}
              onChange={handleBGMVolumeChange}
              disabled={!bgmEnabled}
            />
            <span>{bgmVolume}%</span>
          </div>

          {/* BGM選択 */}
          <div className="audio-setting">
            <label>雅楽選択</label>
            <div className="track-selector">
              {Object.entries(audioManager.bgmTracks).map(([key, track]) => (
                <button
                  key={key}
                  className={`track-btn ${currentTrack === key ? 'active' : ''}`}
                  onClick={() => handleTrackChange(key)}
                  disabled={!bgmEnabled}
                  title={track.description}
                >
                  {track.name}
                </button>
              ))}
            </div>
          </div>

          <div className="audio-divider"></div>

          {/* 効果音設定 */}
          <div className="audio-setting">
            <label>
              <input
                type="checkbox"
                checked={sfxEnabled}
                onChange={handleSFXToggle}
              />
              効果音 {sfxEnabled ? 'ON' : 'OFF'}
            </label>
          </div>

          {/* 効果音音量 */}
          <div className="audio-setting">
            <label>効果音音量</label>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVolume}
              onChange={handleSFXVolumeChange}
              disabled={!sfxEnabled}
            />
            <span>{sfxVolume}%</span>
          </div>

          {/* テスト音 */}
          <div className="audio-setting">
            <label>効果音テスト</label>
            <div className="sfx-test-buttons">
              <button onClick={() => audioManager.playSFX('bell')} disabled={!sfxEnabled}>
                🔔 鈴
              </button>
              <button onClick={() => audioManager.playSFX('gong')} disabled={!sfxEnabled}>
                🎯 鐘
              </button>
              <button onClick={() => audioManager.playSFX('drum')} disabled={!sfxEnabled}>
                🥁 太鼓
              </button>
            </div>
          </div>

          <div className="audio-info">
            <p>🎼 雅楽: {audioManager.bgmTracks[currentTrack].name}</p>
            <p className="audio-description">
              {audioManager.bgmTracks[currentTrack].description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioControls;