import React, { useEffect } from 'react';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

function IOSWrapper({ children }) {
  useEffect(() => {
    // iOS specific configurations
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
      // ステータスバーの設定
      StatusBar.setStyle({ style: 'dark' });
      StatusBar.setBackgroundColor({ color: '#1a1a2e' });
      
      // スプラッシュスクリーンを手動で非表示
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
      
      // Safe area対応
      document.documentElement.style.setProperty(
        '--safe-area-inset-top',
        'env(safe-area-inset-top)'
      );
      document.documentElement.style.setProperty(
        '--safe-area-inset-bottom',
        'env(safe-area-inset-bottom)'
      );
      
      // スクロールバウンス無効化
      document.body.style.overscrollBehavior = 'none';
      
      // タッチイベント最適化
      document.addEventListener('touchstart', () => {}, { passive: true });
      
      // 画面回転の制御
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.lock('portrait').catch(() => {
          // 画面回転ロックがサポートされていない場合は無視
        });
      }
    }
    
    // PWA用の設定
    if (window.matchMedia('(display-mode: standalone)').matches) {
      document.body.classList.add('pwa-mode');
    }
  }, []);
  
  return <>{children}</>;
}

export default IOSWrapper;