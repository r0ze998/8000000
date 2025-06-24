import { useState, useEffect, useCallback } from 'react';
import { useLocation } from './useLocation';
import VisitService from '../services/VisitService';
import RewardService from '../services/RewardService';
import { SHRINES } from '../constants/shrines';

export const useHabitLoop = () => {
  const [state, setState] = useState({
    canVisit: false,
    nearbyShrine: null,
    lastVisit: null,
    streak: 0,
    isVisiting: false,
    todayVisited: false
  });
  
  const { currentLocation, checkNearbyShrine } = useLocation();
  
  // 初期化とトリガー設定
  useEffect(() => {
    initializeHabitLoop();
    checkVisitStatus();
  }, []);
  
  // 位置情報が更新されたら近くの神社をチェック
  useEffect(() => {
    if (currentLocation) {
      checkForNearbyShrine();
    }
  }, [currentLocation]);
  
  // 習慣化ループの初期化
  const initializeHabitLoop = async () => {
    try {
      // ローカルストレージから前回の訪問情報を取得
      const lastVisit = typeof window !== 'undefined' ? localStorage.getItem('lastVisit') : null;
      const streak = typeof window !== 'undefined' ? parseInt(localStorage.getItem('streak') || '0') : 0;
      
      // 今日既に訪問したかチェック
      const todayVisited = checkIfVisitedToday(lastVisit);
      
      setState(prev => ({
        ...prev,
        lastVisit: lastVisit ? new Date(lastVisit) : null,
        streak: todayVisited ? streak : calculateStreak(lastVisit, streak),
        todayVisited
      }));
      
      // 朝の通知をスケジュール
      scheduleMorningNotification();
    } catch (error) {
      console.error('Failed to initialize habit loop:', error);
    }
  };
  
  // 近くの神社をチェック
  const checkForNearbyShrine = async () => {
    try {
      const nearbyShrine = await checkNearbyShrine(currentLocation);
      
      setState(prev => ({
        ...prev,
        nearbyShrine,
        canVisit: !prev.todayVisited && nearbyShrine !== null
      }));
      
      // 近くに神社があったら通知
      if (nearbyShrine && !state.todayVisited) {
        showNearbyNotification(nearbyShrine);
      }
    } catch (error) {
      console.error('Failed to check nearby shrine:', error);
    }
  };
  
  // 参拝実行（メインアクション）
  const triggerVisit = useCallback(async () => {
    if (!state.canVisit || state.isVisiting) return null;
    
    setState(prev => ({ ...prev, isVisiting: true }));
    
    try {
      // 1. 参拝を記録
      const visit = await VisitService.recordVisit({
        shrineId: state.nearbyShrine.id,
        location: currentLocation,
        timestamp: new Date().toISOString()
      });
      
      // 2. 可変報酬を生成
      const reward = await RewardService.generateVariableReward({
        shrine: state.nearbyShrine,
        streak: state.streak + 1,
        season: getCurrentSeason(),
        timeOfDay: getTimeOfDay()
      });
      
      // 3. 状態を更新
      const newStreak = state.streak + 1;
      
      setState(prev => ({
        ...prev,
        lastVisit: new Date(),
        streak: newStreak,
        todayVisited: true,
        canVisit: false,
        isVisiting: false
      }));
      
      // 4. ローカルストレージに保存
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastVisit', new Date().toISOString());
        localStorage.setItem('streak', newStreak.toString());
      }
      
      // 5. 次の参拝を促すトリガーをセット
      scheduleNextDayReminder();
      
      return { visit, reward };
    } catch (error) {
      console.error('Visit failed:', error);
      setState(prev => ({ ...prev, isVisiting: false }));
      throw error;
    }
  }, [state, currentLocation]);
  
  // 今日訪問済みかチェック
  const checkIfVisitedToday = (lastVisit) => {
    if (!lastVisit) return false;
    
    const last = new Date(lastVisit);
    const today = new Date();
    
    return (
      last.getFullYear() === today.getFullYear() &&
      last.getMonth() === today.getMonth() &&
      last.getDate() === today.getDate()
    );
  };
  
  // ストリーク計算
  const calculateStreak = (lastVisit, currentStreak) => {
    if (!lastVisit) return 0;
    
    const last = new Date(lastVisit);
    const today = new Date();
    const diffTime = Math.abs(today - last);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 昨日訪問していればストリーク継続
    if (diffDays === 1) {
      return currentStreak;
    }
    // 2日以上空いたらリセット
    return 0;
  };
  
  // 現在の季節を取得
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };
  
  // 時間帯を取得
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 9) return 'early_morning';
    if (hour >= 9 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  };
  
  // 通知関連のダミー関数（実装は別途）
  const scheduleMorningNotification = () => {
    // 朝6時と7時に通知をスケジュール
    console.log('Morning notification scheduled');
  };
  
  const showNearbyNotification = (shrine) => {
    // 近くの神社通知を表示
    console.log(`Near ${shrine.name}`);
  };
  
  const scheduleNextDayReminder = () => {
    // 翌日のリマインダーをセット
    console.log('Next day reminder scheduled');
  };
  
  const checkVisitStatus = () => {
    // 0時にリセットチェック
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    
    const timeUntilMidnight = midnight - now;
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        todayVisited: false,
        canVisit: prev.nearbyShrine !== null
      }));
      
      // 翌日も同じ時間にチェック
      setInterval(() => {
        setState(prev => ({
          ...prev,
          todayVisited: false,
          canVisit: prev.nearbyShrine !== null
        }));
      }, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
  };
  
  return {
    ...state,
    triggerVisit
  };
};