// Web Audio APIを使用した雅楽風BGM生成
class WebAudioGagaku {
  constructor() {
    this.isEnabled = localStorage.getItem('gagakuEnabled') !== 'false';
    this.audioContext = null;
    this.oscillators = [];
    this.gainNode = null;
    this.isPlaying = false;
  }

  init() {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 0.1; // 音量を小さめに
      this.gainNode.connect(this.audioContext.destination);
      
      console.log('🎵 Web Audio API 初期化完了');
    } catch (error) {
      console.error('Web Audio API 初期化エラー:', error);
    }
  }

  createGagakuTone() {
    if (!this.audioContext || this.isPlaying) return;

    // 雅楽の音階（平調の基本音）
    const frequencies = [
      293.66, // D4 - 呂
      329.63, // E4 - 律
      392.00, // G4 - 宮
      440.00, // A4 - 商
      493.88  // B4 - 角
    ];

    // 各音に対してオシレーターを作成
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // 音色を笛のような音にする
      oscillator.type = index % 2 === 0 ? 'sine' : 'triangle';
      oscillator.frequency.value = freq;
      
      // 音量エンベロープ（ゆっくりフェードイン・アウト）
      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.5);
      
      // 接続
      oscillator.connect(gainNode);
      gainNode.connect(this.gainNode);
      
      // 開始
      oscillator.start();
      
      this.oscillators.push({ oscillator, gainNode });
    });

    this.isPlaying = true;
    this.animateGagaku();
  }

  animateGagaku() {
    if (!this.isPlaying) return;

    // ゆらぎを作る
    this.oscillators.forEach((osc, index) => {
      const time = this.audioContext.currentTime;
      const vibrato = Math.sin(time * (0.5 + index * 0.1)) * 2;
      osc.oscillator.frequency.setValueAtTime(
        osc.oscillator.frequency.value + vibrato,
        time
      );
      
      // 音量の揺らぎ
      const volumeWave = Math.sin(time * 0.2 + index) * 0.02 + 0.03;
      osc.gainNode.gain.setValueAtTime(volumeWave, time);
    });

    requestAnimationFrame(() => this.animateGagaku());
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('gagakuEnabled', this.isEnabled);

    if (this.isEnabled) {
      this.play();
    } else {
      this.stop();
    }

    return this.isEnabled;
  }

  async play() {
    if (!this.isEnabled) return;
    
    this.init();
    
    // ユーザー操作後にAudioContextを再開
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('🎵 AudioContext再開');
      } catch (error) {
        console.error('AudioContext再開エラー:', error);
      }
    }
    
    this.createGagakuTone();
  }

  stop() {
    if (this.oscillators.length > 0) {
      this.oscillators.forEach(({ oscillator, gainNode }) => {
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
        oscillator.stop(this.audioContext.currentTime + 0.5);
      });
      this.oscillators = [];
    }
    this.isPlaying = false;
  }

  getState() {
    return this.isEnabled;
  }
}

const webAudioGagaku = new WebAudioGagaku();
export default webAudioGagaku;