// 雅楽BGMと音響効果の管理

class AudioManager {
  constructor() {
    this.bgmEnabled = true;
    this.sfxEnabled = true;
    this.bgmVolume = 0.3;
    this.sfxVolume = 0.5;
    this.currentBGM = null;
    this.audioContext = null;
    this.bgmAudio = null;
    this.sfxAudios = {};
    
    // 雅楽BGMトラック
    this.bgmTracks = {
      main: {
        name: '越天楽',
        description: '最も有名な雅楽の曲。荘厳で神聖な雰囲気',
        file: '/audio/etenraku.mp3',
        fallbackUrl: 'https://www.youtube.com/watch?v=3jPPZKsVhIs' // 越天楽の例
      },
      shrine: {
        name: '平調音取',
        description: '神社参拝時の静かな雅楽',
        file: '/audio/heicho.mp3',
        fallbackUrl: 'https://www.youtube.com/watch?v=kEj6IQz4qYc'
      },
      festival: {
        name: '陵王',
        description: '祭りの雰囲気に合う活発な雅楽',
        file: '/audio/ryoou.mp3',
        fallbackUrl: 'https://www.youtube.com/watch?v=fGPQ9CpWz74'
      },
      meditation: {
        name: '黄鐘調',
        description: '瞑想的で穏やかな雅楽',
        file: '/audio/oshikicho.mp3',
        fallbackUrl: 'https://www.youtube.com/watch?v=YI0Dk3Cav5U'
      }
    };
    
    // 効果音ファイル
    this.sfxFiles = {
      bell: '/audio/suzu.mp3',
      gong: '/audio/kane.mp3',
      drum: '/audio/taiko.mp3',
      chime: '/audio/fue.mp3'
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

  // Audio要素の初期化
  async initAudio() {
    // BGM用Audio要素
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio();
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmVolume;
    }
    
    // 効果音用Audio要素をプリロード
    Object.entries(this.sfxFiles).forEach(([name, file]) => {
      if (!this.sfxAudios[name]) {
        this.sfxAudios[name] = new Audio(file);
        this.sfxAudios[name].volume = this.sfxVolume;
      }
    });
  }

  // 音源ファイルの存在確認
  async checkAudioFile(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  
  // フォールバック用の合成音を生成（音源ファイルがない場合）
  createSynthesizedGagaku(trackName) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // シンプルな雅楽風の音を生成
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = trackName === 'shrine' ? 220 : 440;
    gainNode.gain.value = 0.1;
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    
    // 1分後に停止
    setTimeout(() => {
      oscillator.stop();
    }, 60000);
    
    return oscillator;
  }

  // BGMを再生
  async playBGM(trackName = 'main') {
    if (!this.bgmEnabled) return;
    
    await this.initAudio();
    this.stopBGM();

    const track = this.bgmTracks[trackName];
    if (!track) return;

    this.currentBGM = trackName;
    
    // 音源ファイルの存在確認
    const fileExists = await this.checkAudioFile(track.file);
    
    if (fileExists) {
      // 実際の音源ファイルを再生
      this.bgmAudio.src = track.file;
      this.bgmAudio.play().catch(error => {
        console.log('BGM再生エラー:', error);
        // エラー時は合成音にフォールバック
        this.createSynthesizedGagaku(trackName);
      });
    } else {
      // 音源ファイルがない場合は案内を表示
      console.log(`BGM音源ファイルが見つかりません: ${track.file}`);
      console.log(`YouTube参考音源: ${track.fallbackUrl}`);
      
      // 合成音を再生
      this.createSynthesizedGagaku(trackName);
    }
  }

  // BGMを停止
  stopBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
    
    // 合成音も停止
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.currentBGM = null;
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
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmVolume;
    }
    this.saveSettings();
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    Object.values(this.sfxAudios).forEach(audio => {
      audio.volume = this.sfxVolume;
    });
    this.saveSettings();
  }

  // 効果音を再生
  async playSFX(soundName, options = {}) {
    if (!this.sfxEnabled) return;
    
    await this.initAudio();

    const audio = this.sfxAudios[soundName];
    if (audio) {
      // 音源ファイルが存在する場合
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.log('効果音再生エラー:', error);
        // エラー時は合成音を再生
        this.playSynthesizedSFX(soundName);
      });
    } else {
      // 音源ファイルがない場合は合成音を再生
      this.playSynthesizedSFX(soundName);
    }
  }
  
  // 合成効果音を再生（フォールバック用）
  playSynthesizedSFX(soundName) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
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
    gainNode.connect(this.audioContext.destination);

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
    
    // Audio要素をクリア
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio = null;
    }
    
    Object.values(this.sfxAudios).forEach(audio => {
      audio.pause();
    });
    this.sfxAudios = {};
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// シングルトンインスタンス
const audioManager = new AudioManager();

export default audioManager;