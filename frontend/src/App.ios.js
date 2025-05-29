// iOS用のアプリエントリーポイント
import React, { useEffect } from 'react';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import ShrineVillageApp from './ShrineVillageApp';

function AppIOS() {
  useEffect(() => {
    // iOS固有の初期化
    const initializeApp = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // ステータスバーの設定
          await StatusBar.setStyle({ style: 'dark' });
          await StatusBar.setBackgroundColor({ color: '#d32f2f' });
          
          // スプラッシュスクリーンを非表示
          await SplashScreen.hide();
        } catch (error) {
          console.error('ネイティブ初期化エラー:', error);
        }
      }
    };

    initializeApp();
  }, []);

  return <ShrineVillageApp />;
}

export default AppIOS;