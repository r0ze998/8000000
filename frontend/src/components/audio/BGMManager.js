import { useEffect } from 'react';
import audioManager from '../services/audioManager';

function BGMManager({ activeTab }) {
  useEffect(() => {
    // audioManagerは既にトラックが定義されているので、初期化は不要
    console.log('BGMManager: 初期化完了');
  }, []);

  useEffect(() => {
    // タブが変更されたときにBGMを切り替え
    const switchBGM = async () => {
      let trackName = 'main'; // デフォルト

      switch (activeTab) {
        case 'home':
          trackName = 'main';
          break;
        case 'visit':
          trackName = 'shrine';
          break;
        case 'explore':
          trackName = 'festival';
          break;
        case 'learn':
          trackName = 'meditation';
          break;
        case 'profile':
          trackName = 'meditation';
          break;
        default:
          trackName = 'main';
      }

      console.log(`BGMManager: タブ "${activeTab}" に切り替え、BGM "${trackName}" を再生`);
      
      try {
        if (audioManager.bgmEnabled) {
          await audioManager.playBGM(trackName);
        }
      } catch (error) {
        console.error('BGM切り替えエラー:', error);
      }
    };

    if (activeTab) {
      switchBGM();
    }
  }, [activeTab]);

  // このコンポーネントは何もレンダリングしない
  return null;
}

export default BGMManager;