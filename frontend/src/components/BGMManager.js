import { useEffect } from 'react';
import bgmPlayer from '../utils/bgmPlayer';

function BGMManager({ activeTab }) {
  useEffect(() => {
    // BGMトラックを初期化
    bgmPlayer.addTrack('home', '/audio/bgm/shrine-ambient.mp3');
    bgmPlayer.addTrack('visit', '/audio/bgm/traditional-japanese.mp3');
    bgmPlayer.addTrack('explore', '/audio/bgm/forest-sounds.mp3');
    bgmPlayer.addTrack('learn', '/audio/bgm/meditation.mp3');
    bgmPlayer.addTrack('profile', '/audio/bgm/meditation.mp3');

    console.log('BGMManager: BGMトラックが初期化されました');
  }, []);

  useEffect(() => {
    // タブが変更されたときにBGMを切り替え
    const switchBGM = async () => {
      let trackName = 'home'; // デフォルト

      switch (activeTab) {
        case 'home':
          trackName = 'home';
          break;
        case 'visit':
          trackName = 'visit';
          break;
        case 'explore':
          trackName = 'explore';
          break;
        case 'learn':
          trackName = 'learn';
          break;
        case 'profile':
          trackName = 'profile';
          break;
        default:
          trackName = 'home';
      }

      console.log(`BGMManager: タブ "${activeTab}" に切り替え、BGM "${trackName}" を再生`);
      
      try {
        await bgmPlayer.play(trackName);
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