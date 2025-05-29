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

    // 直接Audio要素を使用
    this.setupDirectAudio();
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
    
    // フリーの和風BGM音源
    const audioSources = [
      'https://dova-s.jp/_contents/audio/mp3/11843.mp3', // DOVA-SYNDROMEの和風BGM
      'https://pocket-se.info/wp-content/uploads/2022/08/kokyuu.mp3', // ポケットサウンドの和風
      '/audio/gagaku-etenraku.mp3' // ローカルファイル
    ];

    // 最初に利用可能な音源を使用
    this.audio.src = audioSources[0];
    this.audio.loop = true;
    this.audio.volume = 0.3;
    this.isInitialized = true;
    
    // エラーハンドリング
    this.audio.addEventListener('error', () => {
      console.log('音源の読み込みエラー、代替音源を試します');
      const currentIndex = audioSources.indexOf(this.audio.src);
      if (currentIndex < audioSources.length - 1) {
        this.audio.src = audioSources[currentIndex + 1];
      }
    });
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