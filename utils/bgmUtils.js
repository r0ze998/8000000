/**
 * BGM Management Utilities
 * 音楽再生とオーディオ管理のユーティリティ関数
 */

/**
 * 指定されたBGMトラックを再生
 * @param {Object} track - BGMトラック情報
 * @param {Function} setCurrentAudio - オーディオインスタンス設定関数
 * @returns {Audio|null} オーディオインスタンス
 */
export const playBGM = (track, setCurrentAudio = null) => {
  // 既存のオーディオを停止
  if (window.currentAppAudio) {
    window.currentAppAudio.pause();
    window.currentAppAudio.currentTime = 0;
  }

  // 新しいオーディオ要素を作成
  const audio = new Audio(track.file);
  audio.loop = true;
  audio.volume = 0.3;
  
  // エラーハンドリング
  audio.addEventListener('error', (e) => {
    console.log(`BGM file not found: ${track.file}. Using fallback silence.`);
    createFallbackAudio(track);
  });

  audio.addEventListener('canplaythrough', () => {
    audio.play().catch(e => {
      console.log('Autoplay prevented. BGM will start on next user interaction.');
    });
  });

  // グローバルに保存
  window.currentAppAudio = audio;
  
  if (setCurrentAudio) {
    setCurrentAudio(audio);
  }

  return audio;
};

/**
 * BGMを停止
 */
export const stopBGM = () => {
  if (window.currentAppAudio) {
    window.currentAppAudio.pause();
    window.currentAppAudio.currentTime = 0;
    window.currentAppAudio = null;
  }
};

/**
 * フォールバック音声（Web Audio API使用）
 * @param {Object} track - BGMトラック情報
 */
export const createFallbackAudio = (track) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // BGMタイプ別の周波数設定
    const frequencies = {
      forest: 220,   // A3
      temple: 174,   // F3
      rain: 1000,    // High frequency
      wind: 80,      // Low frequency
      meditation: 528 // Solfeggio frequency
    };
    
    oscillator.frequency.setValueAtTime(
      frequencies[track.name] || frequencies.forest, 
      audioContext.currentTime
    );
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    
    // 10秒後に停止（フォールバック用）
    setTimeout(() => {
      try {
        oscillator.stop();
        audioContext.close();
      } catch (e) {
        console.log('Fallback audio cleanup error:', e);
      }
    }, 10000);
    
  } catch (e) {
    console.log('Web Audio API not supported:', e);
  }
};