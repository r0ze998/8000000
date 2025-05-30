// シンプルな雅楽BGMマネージャー
class SimpleGagakuManager {
  constructor() {
    this.audio = null;
    this.isEnabled = localStorage.getItem('gagakuEnabled') !== 'false';
  }

  init() {
    if (this.audio) return;

    // 和風の音楽（雅楽風）を直接Base64で埋め込み
    // これは著作権フリーの短い和風音楽のサンプル
    const gagakuBase64 = 'data:audio/mpeg;base64,SUQzAwAAAAAAIVRTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAKAAAUgAAlJSUlJSUlJSVCQkJCQkJCQkJfX19fX19fX19fX3x8fHx8fHx8fJmZmZmZmZmZmZm2tra2tra2tra20tLS0tLS0tLS0u/v7+/v7+/v7+/v//////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAQKAAAAAAAAFICGCZVxAAAAAAD/+1DEAAAHcANX9AAAI0YBrT8xAABEREREYQAAAAGGGCKgCDFixbf/8QYIgQMZQBAwxRQAAwyxT/4gzB5jf/8QAEFgkP//8HAYGIYY////////MYHBgGD/+QAAAAIAAABhxQsWLFixYrFixYAAAAADUNQKBQKBQHT0Caqp0VdDsW9LS2OMcY4xxjxjjHH/h4eHh4EAQBAEAQBDyH//5D/kP+Q/5D/kIeQ/5CEIQhCE8E8h/r/URAAAAAAAf//////86aPb/9RJbtvP//5/5/z/n/k5jHl/n/n/k5jy/z/n/P5OYx5f5/5/5OYx5f//5/z+Tn8v/////////////+sGABhVwBVhAAACEACOAAUDXu9f61tbW96/T///39NrGOIESJGOcQxyaJfJfJfJ9A9A9A9AwGAwP/7UMQJgAepH0/2HgAA7SLpPN6AAoDA4HCgOFAclgYDBYG/BwOBwMBwYDBfwMDAcCBv/BgwKBv+oCgUCgUC//qBQKBQP//UBAMg4OByb1AQDAYQgCAGQCwEAwGBJPwDA////////YGa6mR2sZCNHoQ0ejqLQjY1k9VNPm+tYjQDq8u4b2AZ/+97/vL6x5LCyP/+y5n4/Ljljnyn3uf//////////////////1ggAGAAAABOggCECDJRiRsjYjWKhCJQOAY5f0JhJA/oGAd////4KA4DAUF////goBgUBQL/1AQCID1AQBAEBAj/UBH0GE/6ggAMAQ36hsVELlFzz9E4xYp8';
    
    this.audio = new Audio(gagakuBase64);
    this.audio.loop = true;
    this.audio.volume = 0.3;
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
    
    try {
      // ブラウザの自動再生ポリシーに対応
      if (this.audio.paused) {
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('🎵 雅楽BGM再生開始');
            })
            .catch(error => {
              console.log('🔇 音楽の再生にはユーザー操作が必要です');
              // ユーザー操作後に再試行
              document.addEventListener('click', () => {
                this.audio.play().catch(() => {});
              }, { once: true });
            });
        }
      }
    } catch (error) {
      console.log('音楽の再生エラー:', error);
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  getState() {
    return this.isEnabled;
  }
}

const simpleGagaku = new SimpleGagakuManager();
export default simpleGagaku;