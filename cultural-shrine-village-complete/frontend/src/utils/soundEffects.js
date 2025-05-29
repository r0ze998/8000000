// Web Audio APIを使用したサウンドエフェクト
class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.volume = 0.5;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playSound(type) {
    if (!this.enabled || !this.audioContext) return;

    const sounds = {
      complete: () => this.playCompleteSound(),
      levelUp: () => this.playLevelUpSound(),
      treeGrow: () => this.playTreeGrowSound(),
      achievement: () => this.playAchievementSound(),
      click: () => this.playClickSound()
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

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export default new SoundEffects();