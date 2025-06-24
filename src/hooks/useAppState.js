/**
 * App State Management Custom Hook
 * アプリケーション全体の状態管理カスタムフック
 */

import { useState, useEffect } from 'react';
import { initialMockData, defaultUserSettings } from '../constants/mockData';
import { getStorageItem, setStorageItem, getStorageBoolean, setStorageBoolean } from '../utils/storageUtils';

export const useAppState = () => {
  // UI状態
  const [activeTab, setActiveTab] = useState('home');
  const [showStoryCreation, setShowStoryCreation] = useState(false);
  const [showFullDashboard, setShowFullDashboard] = useState(false);
  const [hasNotification, setHasNotification] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ユーザーデータ
  const [mockData, setMockData] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(defaultUserSettings.currentStreak);
  const [todayVisited, setTodayVisited] = useState(defaultUserSettings.todayVisited);

  // 神社設定
  const [myShrineConfig, setMyShrineConfig] = useState({
    name: 'my神社',
    torii: 'basic',
    mainHall: 'basic',
    decorations: ['lanterns'],
    environment: 'forest',
    blessing: 'prosperity'
  });

  // 初期化処理
  useEffect(() => {
    // 保存された設定の読み込み
    const savedDarkMode = getStorageBoolean('isDarkMode', false);
    const savedShrineConfig = getStorageItem('myShrineConfig');
    
    setIsDarkMode(savedDarkMode);
    
    if (savedShrineConfig) {
      setMyShrineConfig(savedShrineConfig);
    }
    
    // モックデータの初期化
    setMockData(initialMockData);
  }, []);

  /**
   * ダークモードの切り替え
   */
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    setStorageBoolean('isDarkMode', newDarkMode);
  };

  /**
   * 神社設定の更新
   * @param {Object} newShrineConfig - 新しい神社設定
   */
  const handleShrineUpdate = (newShrineConfig) => {
    setMyShrineConfig(newShrineConfig);
    setStorageItem('myShrineConfig', newShrineConfig);
  };

  /**
   * 箱庭保存処理
   * @param {Object} hakoniwData - 箱庭データ
   */
  const handleHakoniwaSave = (hakoniwData) => {
    console.log('Hakoniwa saved:', hakoniwData);
    // 箱庭保存時にコレクションタブに通知追加
    setHasNotification(prev => ({ ...prev, collection: true }));
  };

  /**
   * ストーリー作成完了処理
   * @param {Object} result - 作成されたストーリー
   */
  const handleStoryComplete = (result) => {
    console.log('Story created:', result);
    
    // 今日の参拝をマークし、ストリークを増加
    if (!todayVisited) {
      setTodayVisited(true);
      setCurrentStreak(prev => prev + 1);
    }
    
    if (mockData) {
      const newNFT = {
        id: mockData.nfts.length + 1,
        type: 'omamori',
        title: result.title,
        shrine: result.shrine || '体験神社',
        rarity: result.rarity || 'common',
        story: result.story,
        date: new Date().toISOString().split('T')[0],
        culturalValue: result.culturalValue || 500
      };
      
      // 参拝記録の追加
      const newVisit = {
        id: mockData.visits.length + 1,
        shrineName: result.shrine || '体験神社',
        date: new Date().toISOString().split('T')[0],
        streakCount: currentStreak + 1
      };
      
      setMockData(prev => ({
        ...prev,
        visits: [newVisit, ...prev.visits],
        nfts: [...prev.nfts, newNFT],
        culturalScore: prev.culturalScore + (result.culturalValue || 500)
      }));
      
      // コレクションタブに通知追加
      setHasNotification(prev => ({ ...prev, collection: true }));
    }
    setShowStoryCreation(false);
  };

  /**
   * タブ切り替え時の通知クリア
   * @param {string} tabId - タブID
   */
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // タブアクセス時に通知をクリア
    if (hasNotification[tabId]) {
      setHasNotification(prev => ({ ...prev, [tabId]: false }));
    }
  };

  /**
   * 参拝体験記録の開始
   */
  const startVisitExperience = () => {
    setShowStoryCreation(true);
  };

  /**
   * ユーザーレベルの計算
   */
  const getUserLevel = () => Math.floor(currentStreak / 10) + 1;

  return {
    // UI状態
    activeTab,
    showStoryCreation,
    showFullDashboard,
    hasNotification,
    isDarkMode,
    
    // ユーザーデータ
    mockData,
    currentStreak,
    todayVisited,
    myShrineConfig,
    
    // アクション
    setActiveTab: handleTabChange,
    setShowStoryCreation,
    setShowFullDashboard,
    setHasNotification,
    toggleDarkMode,
    handleShrineUpdate,
    handleHakoniwaSave,
    handleStoryComplete,
    startVisitExperience,
    
    // 計算値
    userLevel: getUserLevel()
  };
};