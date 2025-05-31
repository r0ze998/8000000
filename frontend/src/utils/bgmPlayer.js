// BGM再生システム
class BGMPlayer {
  constructor() {
    this.audio = null;
    this.isPlaying = false;
    this.volume = 0.3;
    this.currentTrack = null;
    this.tracks = {};
    this.fadeInterval = null;
  }

  // MP3ファイルを登録
  addTrack(name, url) {
    this.tracks[name] = url;
  }

  // BGMを再生
  async play(trackName, force = false) {
    if (this.currentTrack === trackName && this.isPlaying && !force) {
      return;
    }

    // 現在の曲をフェードアウト
    if (this.isPlaying) {
      await this.fadeOut();
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }
    }

    if (!this.tracks[trackName]) {
      console.warn(`BGMトラック "${trackName}" が見つかりません`);
      return;
    }

    try {
      this.audio = new Audio(this.tracks[trackName]);
      this.audio.volume = 0;
      this.audio.loop = true;
      this.currentTrack = trackName;
      
      // エラーハンドリングを改善
      this.audio.addEventListener('error', (e) => {
        console.error('BGM読み込みエラー:', e);
      });

      this.audio.addEventListener('loadeddata', () => {
        console.log(`BGM "${trackName}" が読み込まれました`);
      });
      
      // 再生開始
      const playPromise = this.audio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isPlaying = true;
          this.fadeIn();
          console.log(`BGM "${trackName}" が再生開始されました`);
        }).catch(error => {
          console.warn('BGM自動再生が制限されています:', error.message);
          // ユーザー操作後に再生できるよう準備
          this.setupUserInteractionPlay();
        });
      }

    } catch (error) {
      console.error('BGM再生エラー:', error);
    }
  }

  // ユーザー操作後に再生開始
  setupUserInteractionPlay() {
    const startPlay = () => {
      if (this.audio && !this.isPlaying) {
        this.audio.play().then(() => {
          this.isPlaying = true;
          this.fadeIn();
          // イベントリスナーを削除
          document.removeEventListener('click', startPlay);
          document.removeEventListener('touchstart', startPlay);
        });
      }
    };

    document.addEventListener('click', startPlay, { once: true });
    document.addEventListener('touchstart', startPlay, { once: true });
  }

  // BGMを停止
  async stop() {
    if (this.isPlaying) {
      await this.fadeOut();
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }
      this.isPlaying = false;
      this.currentTrack = null;
    }
  }

  // 一時停止
  pause() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  // 再開
  resume() {
    if (this.audio && !this.isPlaying) {
      this.audio.play().then(() => {
        this.isPlaying = true;
      }).catch(error => {
        console.warn('BGM再開エラー:', error);
      });
    }
  }

  // フェードイン
  fadeIn(duration = 1000) {
    if (!this.audio) return;

    this.clearFade();
    const startVolume = 0;
    const targetVolume = this.volume;
    const steps = 50;
    const stepTime = duration / steps;
    const volumeStep = (targetVolume - startVolume) / steps;

    let currentStep = 0;
    this.audio.volume = startVolume;

    this.fadeInterval = setInterval(() => {
      currentStep++;
      const newVolume = startVolume + (volumeStep * currentStep);
      this.audio.volume = Math.min(newVolume, targetVolume);

      if (currentStep >= steps) {
        this.clearFade();
      }
    }, stepTime);
  }

  // フェードアウト
  fadeOut(duration = 1000) {
    return new Promise((resolve) => {
      if (!this.audio) {
        resolve();
        return;
      }

      this.clearFade();
      const startVolume = this.audio.volume;
      const steps = 50;
      const stepTime = duration / steps;
      const volumeStep = startVolume / steps;

      let currentStep = 0;

      this.fadeInterval = setInterval(() => {
        currentStep++;
        const newVolume = startVolume - (volumeStep * currentStep);
        this.audio.volume = Math.max(newVolume, 0);

        if (currentStep >= steps) {
          this.clearFade();
          resolve();
        }
      }, stepTime);
    });
  }

  // フェード処理をクリア
  clearFade() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
  }

  // 音量設定
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  // 現在の状態を取得
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
      volume: this.volume,
      availableTracks: Object.keys(this.tracks)
    };
  }

  // トラックを切り替え
  async switchTrack(trackName) {
    if (this.currentTrack !== trackName) {
      await this.play(trackName);
    }
  }
}

const bgmPlayerInstance = new BGMPlayer();
export default bgmPlayerInstance;