// 雅楽BGMと音響効果の管理

class AudioManager {
  constructor() {
    this.bgmEnabled = true;
    this.sfxEnabled = true;
    this.bgmVolume = 0.3;
    this.sfxVolume = 0.5;
    this.currentBGM = null;
    this.audioContext = null;
    this.gainNodes = {};
    
    // 雅楽BGMトラック
    this.bgmTracks = {
      main: {
        name: '越天楽',
        description: '最も有名な雅楽の曲。荘厳で神聖な雰囲気',
        // Web Audio APIで生成される雅楽風の音
        tempo: 60,
        instruments: ['sho', 'hichiriki', 'ryuteki', 'biwa', 'koto']
      },
      shrine: {
        name: '平調音取',
        description: '神社参拝時の静かな雅楽',
        tempo: 50,
        instruments: ['sho', 'ryuteki']
      },
      festival: {
        name: '陵王',
        description: '祭りの雰囲気に合う活発な雅楽',
        tempo: 80,
        instruments: ['taiko', 'hichiriki', 'sho']
      },
      meditation: {
        name: '黄鐘調',
        description: '瞑想的で穏やかな雅楽',
        tempo: 40,
        instruments: ['sho', 'koto']
      }
    };

    // 初期化
    this.loadSettings();
  }

  // 設定の読み込み
  loadSettings() {
    const settings = localStorage.getItem('audioSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      this.bgmEnabled = parsed.bgmEnabled ?? true;
      this.sfxEnabled = parsed.sfxEnabled ?? true;
      this.bgmVolume = parsed.bgmVolume ?? 0.3;
      this.sfxVolume = parsed.sfxVolume ?? 0.5;
    }
  }

  // 設定の保存
  saveSettings() {
    localStorage.setItem('audioSettings', JSON.stringify({
      bgmEnabled: this.bgmEnabled,
      sfxEnabled: this.sfxEnabled,
      bgmVolume: this.bgmVolume,
      sfxVolume: this.sfxVolume
    }));
  }

  // Web Audio APIの初期化
  async initAudioContext() {
    if (this.audioContext) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // マスターゲインノード
      this.gainNodes.master = this.audioContext.createGain();
      this.gainNodes.master.connect(this.audioContext.destination);
      
      // BGM用ゲインノード
      this.gainNodes.bgm = this.audioContext.createGain();
      this.gainNodes.bgm.gain.value = this.bgmVolume;
      this.gainNodes.bgm.connect(this.gainNodes.master);
      
      // SFX用ゲインノード
      this.gainNodes.sfx = this.audioContext.createGain();
      this.gainNodes.sfx.gain.value = this.sfxVolume;
      this.gainNodes.sfx.connect(this.gainNodes.master);
      
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  // 雅楽風の音を生成
  createGagakuSound(instrumentType, frequency, duration) {
    if (!this.audioContext) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // 楽器ごとの設定
    switch (instrumentType) {
      case 'sho': // 笙
        oscillator.type = 'sine';
        filter.type = 'bandpass';
        filter.frequency.value = frequency;
        filter.Q.value = 10;
        // 和音を追加
        const harmonic = this.audioContext.createOscillator();
        harmonic.type = 'sine';
        harmonic.frequency.value = frequency * 1.5;
        harmonic.connect(gainNode);
        harmonic.start();
        harmonic.stop(this.audioContext.currentTime + duration);
        break;
        
      case 'hichiriki': // 篳篥
        oscillator.type = 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        filter.Q.value = 5;
        break;
        
      case 'ryuteki': // 龍笛
        oscillator.type = 'triangle';
        filter.type = 'highpass';
        filter.frequency.value = 800;
        break;
        
      case 'biwa': // 琵琶
        oscillator.type = 'triangle';
        filter.type = 'lowpass';
        filter.frequency.value = 1500;
        // 弦楽器のアタック
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        break;
        
      case 'koto': // 琴
        oscillator.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.value = 3000;
        // 琴のアタック
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        break;
        
      case 'taiko': // 太鼓
        oscillator.type = 'sine';
        oscillator.frequency.value = 60;
        filter.type = 'lowpass';
        filter.frequency.value = 150;
        // 太鼓のアタック
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        break;
    }

    oscillator.frequency.value = frequency;
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.gainNodes.bgm);

    // フェードイン・フェードアウト
    if (instrumentType !== 'biwa' && instrumentType !== 'koto' && instrumentType !== 'taiko') {
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + duration - 0.1);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
    }

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);

    return { oscillator, gainNode, filter };
  }

  // BGMを再生
  async playBGM(trackName = 'main') {
    if (!this.bgmEnabled) return;
    
    await this.initAudioContext();
    this.stopBGM();

    const track = this.bgmTracks[trackName];
    if (!track) return;

    this.currentBGM = {
      name: trackName,
      instruments: [],
      intervalId: null
    };

    // 雅楽の音階（平調）
    const gagakuScale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
    
    // リズムパターンを生成
    const playPattern = () => {
      track.instruments.forEach((instrument, index) => {
        setTimeout(() => {
          const note = gagakuScale[Math.floor(Math.random() * gagakuScale.length)];
          const duration = instrument === 'taiko' ? 0.3 : 2 + Math.random() * 2;
          this.createGagakuSound(instrument, note, duration);
        }, index * 200);
      });
    };

    // 初回再生
    playPattern();

    // ループ再生
    this.currentBGM.intervalId = setInterval(() => {
      playPattern();
    }, (60 / track.tempo) * 4 * 1000); // 4拍子
  }

  // BGMを停止
  stopBGM() {
    if (this.currentBGM && this.currentBGM.intervalId) {
      clearInterval(this.currentBGM.intervalId);
      this.currentBGM = null;
    }
  }

  // BGMを一時停止/再開
  toggleBGM() {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled && !this.currentBGM) {
      this.playBGM();
    } else if (!this.bgmEnabled) {
      this.stopBGM();
    }
    this.saveSettings();
  }

  // 音量設定
  setBGMVolume(volume) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.gainNodes.bgm) {
      this.gainNodes.bgm.gain.value = this.bgmVolume;
    }
    this.saveSettings();
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.gainNodes.sfx) {
      this.gainNodes.sfx.gain.value = this.sfxVolume;
    }
    this.saveSettings();
  }

  // 効果音を再生
  async playSFX(soundName, options = {}) {
    if (!this.sfxEnabled) return;
    
    await this.initAudioContext();

    // 効果音の定義
    const sfxDefinitions = {
      bell: { frequency: 800, duration: 1.5, type: 'triangle' },
      gong: { frequency: 150, duration: 3, type: 'sine' },
      chime: { frequency: 1200, duration: 0.8, type: 'sine' },
      drum: { frequency: 80, duration: 0.3, type: 'sine' }
    };

    const sfx = sfxDefinitions[soundName];
    if (!sfx) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = sfx.type;
    oscillator.frequency.value = sfx.frequency;
    oscillator.connect(gainNode);
    gainNode.connect(this.gainNodes.sfx);

    // エンベロープ
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sfx.duration);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + sfx.duration);
  }

  // クリーンアップ
  destroy() {
    this.stopBGM();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// シングルトンインスタンス
const audioManager = new AudioManager();

export default audioManager;