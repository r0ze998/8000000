// 実際の雅楽演奏音源を使用したオーディオマネージャー

class GagakuAudioManager {
  constructor() {
    this.isEnabled = this.loadSetting();
    this.audio = null;
    this.isInitialized = false;
  }

  // 設定の読み込み
  loadSetting() {
    const saved = localStorage.getItem('gagakuEnabled');
    return saved === null ? true : saved === 'true';
  }

  // 設定の保存
  saveSetting() {
    localStorage.setItem('gagakuEnabled', this.isEnabled.toString());
  }

  // 初期化
  async init() {
    if (this.isInitialized) return;

    try {
      // iframe内で実際の雅楽音源を再生
      this.setupIframePlayer();
    } catch (error) {
      console.error('雅楽プレーヤーの初期化に失敗:', error);
      // フォールバックとして直接Audio要素を使用
      this.setupDirectAudio();
    }
  }

  // iframeプレーヤーのセットアップ
  setupIframePlayer() {
    const iframe = document.createElement('iframe');
    iframe.src = '/gagaku-player.html';
    iframe.style.display = 'none';
    iframe.id = 'gagaku-iframe';
    document.body.appendChild(iframe);

    // iframeからのメッセージを待つ
    window.addEventListener('message', (event) => {
      if (event.data.ready) {
        this.iframe = iframe;
        this.isInitialized = true;
        console.log('雅楽プレーヤーを初期化しました');
      }
    });
  }

  // 直接Audio要素を使用（フォールバック）
  async setupDirectAudio() {
    this.audio = new Audio();
    
    // 実際の雅楽演奏音源
    const audioSources = [
      '/audio/gagaku-etenraku.mp3',
      'https://ia801309.us.archive.org/7/items/gagaku-etenraku/etenraku.mp3'
    ];

    for (const source of audioSources) {
      try {
        this.audio.src = source;
        this.audio.loop = true;
        this.audio.volume = 0.3;
        
        await new Promise((resolve, reject) => {
          this.audio.addEventListener('canplay', resolve, { once: true });
          this.audio.addEventListener('error', reject, { once: true });
          this.audio.load();
        });
        
        console.log('雅楽音源を読み込みました:', source);
        this.isInitialized = true;
        break;
      } catch (error) {
        console.log('音源の読み込みに失敗:', source);
      }
    }
  }


  // 再生/停止
  async play() {
    if (!this.isEnabled) return;
    
    await this.init();

    try {
      if (this.iframe) {
        this.iframe.contentWindow.postMessage({ action: 'play' }, '*');
      } else if (this.audio) {
        await this.audio.play();
      }
    } catch (error) {
      console.log('音声の再生に失敗しました:', error);
    }
  }

  stop() {
    if (this.iframe) {
      this.iframe.contentWindow.postMessage({ action: 'stop' }, '*');
    } else if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  // オン/オフ切り替え
  toggle() {
    this.isEnabled = !this.isEnabled;
    this.saveSetting();

    if (this.isEnabled) {
      this.play();
    } else {
      this.stop();
    }

    return this.isEnabled;
  }

  // 現在の状態を取得
  getState() {
    return this.isEnabled;
  }

  // クリーンアップ
  destroy() {
    this.stop();
    
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
    }
    
    if (this.audio) {
      this.audio = null;
    }
    
    this.isInitialized = false;
  }
}

// シングルトンインスタンス
const gagakuAudio = new GagakuAudioManager();

export default gagakuAudio;