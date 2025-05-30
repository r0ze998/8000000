// Web Audio APIを使用した和風サウンドエフェクト
class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.volume = 0.5;
    this.reverb = null;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.createReverb();
    }
  }

  // リバーブ効果を作成（神社の雰囲気）
  createReverb() {
    const convolver = this.audioContext.createConvolver();
    const length = this.audioContext.sampleRate * 2;
    const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      }
    }
    
    convolver.buffer = impulse;
    this.reverb = convolver;
  }

  playSound(type) {
    if (!this.enabled || !this.audioContext) return;

    const sounds = {
      complete: () => this.playCompleteSound(),
      levelUp: () => this.playLevelUpSound(),
      treeGrow: () => this.playTreeGrowSound(),
      achievement: () => this.playAchievementSound(),
      click: () => this.playClickSound(),
      // 新しい和風サウンド
      bell: () => this.playBellSound(),
      gong: () => this.playGongSound(),
      shakuhachi: () => this.playShakuhachiSound(),
      koto: () => this.playKotoSound(),
      taiko: () => this.playTaikoSound()
    };

    if (sounds[type]) {
      sounds[type]();
    }
  }

  playCompleteSound() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, this.audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, this.audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, this.audioContext.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  playLevelUpSound() {
    const notes = [261.63, 329.63, 392, 523.25]; // C4, E4, G4, C5
    
    notes.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.1);
      gainNode.gain.setValueAtTime(this.volume * 0.8, this.audioContext.currentTime + index * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.1 + 0.5);
      
      oscillator.start(this.audioContext.currentTime + index * 0.1);
      oscillator.stop(this.audioContext.currentTime + index * 0.1 + 0.5);
    });
  }

  playTreeGrowSound() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 1);
    
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 1);
    
    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 1);
  }

  playAchievementSound() {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.15);
      
      gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime + index * 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + index * 0.15 + 0.3);
      
      oscillator.start(this.audioContext.currentTime + index * 0.15);
      oscillator.stop(this.audioContext.currentTime + index * 0.15 + 0.3);
    });
  }

  playClickSound() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  // 鈴の音
  playBellSound() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // リバーブ接続
    if (this.reverb) {
      gainNode.connect(this.reverb);
      this.reverb.connect(this.audioContext.destination);
    }
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(2400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.3);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    filter.Q.setValueAtTime(10, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 1);
    
    // 倍音を追加
    for (let i = 1; i <= 3; i++) {
      const harmonic = this.audioContext.createOscillator();
      const harmonicGain = this.audioContext.createGain();
      
      harmonic.connect(harmonicGain);
      harmonicGain.connect(this.audioContext.destination);
      
      harmonic.frequency.setValueAtTime(2400 * (i + 1), this.audioContext.currentTime);
      harmonicGain.gain.setValueAtTime(this.volume * 0.1 / i, this.audioContext.currentTime);
      harmonicGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
      
      harmonic.start(this.audioContext.currentTime);
      harmonic.stop(this.audioContext.currentTime + 0.5);
    }
  }

  // 銅鑼の音
  playGongSound() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 2);
    
    gainNode.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 3);
    
    // 衝撃音
    const noise = this.audioContext.createBufferSource();
    const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.05, this.audioContext.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() - 0.5) * 2;
    }
    noise.buffer = noiseBuffer;
    
    const noiseGain = this.audioContext.createGain();
    noise.connect(noiseGain);
    noiseGain.connect(this.audioContext.destination);
    
    noiseGain.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
    
    noise.start(this.audioContext.currentTime);
  }

  // 尺八の音
  playShakuhachiSound() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(466, this.audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime + 0.4);
    
    // ビブラート
    const vibrato = this.audioContext.createOscillator();
    const vibratoGain = this.audioContext.createGain();
    vibrato.connect(vibratoGain);
    vibratoGain.connect(oscillator.frequency);
    
    vibrato.frequency.setValueAtTime(5, this.audioContext.currentTime);
    vibratoGain.gain.setValueAtTime(10, this.audioContext.currentTime);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
    filter.Q.setValueAtTime(2, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
    
    oscillator.start(this.audioContext.currentTime);
    vibrato.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.8);
    vibrato.stop(this.audioContext.currentTime + 0.8);
  }

  // 琴の音
  playKotoSound() {
    const fundamentalFreq = 220;
    const pluckDuration = 1.5;
    
    for (let string = 0; string < 3; string++) {
      const freq = fundamentalFreq * Math.pow(2, string / 12);
      const delay = string * 0.05;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + delay);
      
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(freq * 0.5, this.audioContext.currentTime + delay);
      
      gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime + delay);
      gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime + delay + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + delay + pluckDuration);
      
      oscillator.start(this.audioContext.currentTime + delay);
      oscillator.stop(this.audioContext.currentTime + delay + pluckDuration);
    }
  }

  // 太鼓の音
  playTaikoSound() {
    // 低音部分
    const lowOsc = this.audioContext.createOscillator();
    const lowGain = this.audioContext.createGain();
    
    lowOsc.connect(lowGain);
    lowGain.connect(this.audioContext.destination);
    
    lowOsc.type = 'sine';
    lowOsc.frequency.setValueAtTime(60, this.audioContext.currentTime);
    lowOsc.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.1);
    
    lowGain.gain.setValueAtTime(this.volume * 0.8, this.audioContext.currentTime);
    lowGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    lowOsc.start(this.audioContext.currentTime);
    lowOsc.stop(this.audioContext.currentTime + 0.3);
    
    // 打撃音
    const noise = this.audioContext.createBufferSource();
    const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() - 0.5) * Math.exp(-i / data.length * 10);
    }
    
    noise.buffer = noiseBuffer;
    
    const noiseFilter = this.audioContext.createBiquadFilter();
    const noiseGain = this.audioContext.createGain();
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.audioContext.destination);
    
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(200, this.audioContext.currentTime);
    
    noiseGain.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    noise.start(this.audioContext.currentTime);
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export default new SoundEffects();