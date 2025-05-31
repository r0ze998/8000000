import React, { createContext, useContext, useState, useCallback } from 'react';
import soundEffects from '../utils/soundEffects';
import { useNotification } from '../hooks/useNotification';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const { showNotification } = useNotification();
  
  // プレイヤープロファイル
  const [playerProfile, setPlayerProfile] = useState({
    name: '文化探求者',
    level: 1,
    experience: 0,
    nextLevelExp: 100,
    title: '初詣参拝者',
    rank: '白帯',
    culturalCapital: 100,
    beltColor: '#FFFFFF',
    stats: {
      totalVisits: 0,
      consecutiveDays: 0,
      uniqueShrines: 0
    }
  });

  // プレイヤー統計
  const [playerStats, setPlayerStats] = useState({
    consecutiveVisits: 0,
    fullMoonVisits: 0,
    legendaryShrineSVisits: 0,
    eventsJoined: 0
  });

  // 実績
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [achievements] = useState({});

  // おみくじ履歴
  const [drawnOmikuji, setDrawnOmikuji] = useState([]);

  // クエスト
  const [activeQuests, setActiveQuests] = useState([
    {
      id: 'beginner-1',
      title: '初めての参拝',
      description: '神社を1箇所訪れて参拝しましょう',
      progress: 0,
      target: 1,
      reward: { experience: 100, culturalCapital: 50 },
      completed: false
    },
    {
      id: 'explorer-1',
      title: '神社探検家',
      description: '3つの異なる神社を訪れましょう',
      progress: 0,
      target: 3,
      reward: { experience: 300, culturalCapital: 150 },
      completed: false
    }
  ]);

  // 経験値更新
  const updatePlayerExperience = useCallback((exp) => {
    setPlayerProfile(prev => {
      const newExp = prev.experience + exp;
      const newLevel = Math.floor(newExp / 100) + 1;
      
      if (newLevel > prev.level) {
        showNotification(`🎉 レベルアップ！レベル ${newLevel} に到達しました！`);
        soundEffects.playSound('levelUp');
      }
      
      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        nextLevelExp: newLevel * 100
      };
    });
  }, [showNotification]);

  // 統計更新
  const updatePlayerStats = useCallback((statKey, value = 1) => {
    setPlayerStats(prev => ({
      ...prev,
      [statKey]: (prev[statKey] || 0) + value
    }));
  }, []);

  // 実績解除
  const unlockAchievement = useCallback((achievementId, achievementName) => {
    if (!unlockedAchievements.includes(achievementId)) {
      setUnlockedAchievements(prev => [...prev, achievementId]);
      showNotification(`🏆 実績解除: ${achievementName}`);
      soundEffects.playSound('achievement');
    }
  }, [unlockedAchievements, showNotification]);

  // おみくじ追加
  const addOmikuji = useCallback((omikuji) => {
    setDrawnOmikuji(prev => [...prev, {
      ...omikuji,
      timestamp: new Date().toISOString()
    }]);
  }, []);

  // クエスト更新
  const updateQuest = useCallback((questId, progress) => {
    setActiveQuests(prev => prev.map(quest => {
      if (quest.id === questId) {
        const newProgress = Math.min(progress, quest.target);
        const completed = newProgress >= quest.target;
        
        if (completed && !quest.completed) {
          showNotification(`🎯 クエスト完了: ${quest.title}！`);
          soundEffects.playSound('complete');
        }
        
        return { ...quest, progress: newProgress, completed };
      }
      return quest;
    }));
  }, [showNotification]);

  const value = {
    playerProfile,
    setPlayerProfile,
    playerStats,
    unlockedAchievements,
    achievements,
    drawnOmikuji,
    activeQuests,
    updatePlayerExperience,
    updatePlayerStats,
    unlockAchievement,
    addOmikuji,
    updateQuest
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};