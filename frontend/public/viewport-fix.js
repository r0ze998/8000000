// iOSでのビューポート固定スクリプト
(function() {
  // ビューポートメタタグを動的に設定
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
  }

  // タッチイベントでの横スクロール防止
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    if (!e.touches || e.touches.length !== 1) return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const diffX = Math.abs(touchStartX - touchEndX);
    const diffY = Math.abs(touchStartY - touchEndY);

    // 横スワイプが縦スワイプより大きい場合、デフォルト動作を防ぐ
    if (diffX > diffY && diffX > 10) {
      e.preventDefault();
    }
  }, { passive: false });

  // ウィンドウのリサイズ時にビューポートを再設定
  function handleResize() {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--app-width', `${window.innerWidth}px`);
  }

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  handleResize();
})();