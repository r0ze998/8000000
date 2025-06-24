/**
 * BGM Management Custom Hook
 * BGM再生・管理のカスタムフック
 */

import { useState, useEffect } from 'react';
import { bgmTracks, defaultBGMSettings } from '../constants/bgmConfig';
import { playBGM, stopBGM } from '../utils/bgmUtils';
import { getStorageString, getStorageBoolean, setStorageString, setStorageBoolean } from '../utils/storageUtils';

export const useBGM = () => {
  const [currentBGM, setCurrentBGM] = useState(defaultBGMSettings.currentTrack);
  const [isBGMPlaying, setIsBGMPlaying] = useState(defaultBGMSettings.isPlaying);
  const [currentAudio, setCurrentAudio] = useState(null);

  // 初期化時にlocalStorageから設定を読み込み
  useEffect(() => {
    const savedBGM = getStorageString('currentBGM', defaultBGMSettings.currentTrack);
    const savedBGMPlaying = getStorageBoolean('isBGMPlaying', defaultBGMSettings.isPlaying);
    
    setCurrentBGM(savedBGM);
    setIsBGMPlaying(savedBGMPlaying);
    
    // 自動開始（保存されていた場合）
    if (savedBGMPlaying) {
      setTimeout(() => {
        const track = bgmTracks[savedBGM];
        if (track) {
          const audio = playBGM(track, setCurrentAudio);
          setCurrentAudio(audio);
        }
      }, 500); // コンポーネントマウント後に実行
    }
  }, []);

  /**
   * BGMの再生/停止を切り替え
   */
  const toggleBGM = () => {
    const newPlayingState = !isBGMPlaying;
    setIsBGMPlaying(newPlayingState);
    setStorageBoolean('isBGMPlaying', newPlayingState);

    if (newPlayingState) {
      const track = bgmTracks[currentBGM];
      if (track) {
        const audio = playBGM(track, setCurrentAudio);
        setCurrentAudio(audio);
      }
    } else {
      stopBGM();
      setCurrentAudio(null);
    }
  };

  /**
   * BGMトラックを変更
   * @param {string} bgmKey - BGMキー
   */
  const changeBGM = (bgmKey) => {
    if (!bgmTracks[bgmKey]) {
      console.warn(`BGM track "${bgmKey}" not found`);
      return;
    }

    setCurrentBGM(bgmKey);
    setStorageString('currentBGM', bgmKey);
    
    // 現在再生中の場合は新しいトラックで再開
    if (isBGMPlaying) {
      const track = bgmTracks[bgmKey];
      const audio = playBGM(track, setCurrentAudio);
      setCurrentAudio(audio);
    }
  };

  /**
   * BGMを完全停止
   */
  const stopAllBGM = () => {
    setIsBGMPlaying(false);
    setStorageBoolean('isBGMPlaying', false);
    stopBGM();
    setCurrentAudio(null);
  };

  return {
    currentBGM,
    isBGMPlaying,
    currentAudio,
    bgmTracks,
    toggleBGM,
    changeBGM,
    stopAllBGM
  };
};