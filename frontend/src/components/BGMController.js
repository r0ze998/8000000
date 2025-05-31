import React, { useState, useEffect } from 'react';
import bgmPlayer from '../utils/bgmPlayer';
import './BGMController.css';

function BGMController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    // 状態を定期的に更新
    const interval = setInterval(() => {
      updateStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = () => {
    const status = bgmPlayer.getStatus();
    setIsPlaying(status.isPlaying);
    setCurrentTrack(status.currentTrack);
    setVolume(status.volume);
  };

  const handleTogglePlay = async () => {
    if (isPlaying) {
      bgmPlayer.pause();
    } else {
      bgmPlayer.resume();
    }
    updateStatus();
  };

  const handleVolumeChange = (newVolume) => {
    bgmPlayer.setVolume(newVolume);
    setVolume(newVolume);
  };

  const handleStop = async () => {
    await bgmPlayer.stop();
    updateStatus();
  };

  return (
    <div className="bgm-controller">
      <div className="bgm-header">
        <span className="bgm-title">🎵 BGM</span>
      </div>
      
      <div className="bgm-controls">
        <button
          className={`bgm-play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={handleTogglePlay}
          title={isPlaying ? '一時停止' : '再生'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <button
          className="bgm-stop-btn"
          onClick={handleStop}
          title="停止"
        >
          ⏹️
        </button>
      </div>

      <div className="bgm-volume-control">
        <span className="volume-label">🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="volume-slider"
        />
        <span className="volume-value">{Math.round(volume * 100)}%</span>
      </div>

      {currentTrack && (
        <div className="bgm-current-track">
          <span className="track-info">再生中: {getTrackDisplayName(currentTrack)}</span>
        </div>
      )}
    </div>
  );
}

function getTrackDisplayName(trackName) {
  const displayNames = {
    home: '神社の環境音',
    visit: '伝統音楽',
    explore: '森の音',
    learn: '瞑想音楽',
    profile: '瞑想音楽'
  };
  return displayNames[trackName] || trackName;
}

export default BGMController;