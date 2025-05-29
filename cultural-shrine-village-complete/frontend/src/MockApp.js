import React, { useState, useEffect } from 'react';
import ForestView from './ForestView';
import AchievementBadges from './AchievementBadges';
import Leaderboard from './components/Leaderboard';
import SeasonalEvent from './components/SeasonalEvent';
import Challenges from './components/Challenges';
import soundEffects from './utils/soundEffects';
import './App.css';
import './App-responsive.css';

function MockApp() {
  const [habits, setHabits] = useState([
    {
      id: 1,
      name: '毎日の瞑想',
      description: '10分間の朝の瞑想',
      current_streak: 7,
      best_streak: 14,
      total_completions: 28,
      frequency: 1
    },
    {
      id: 2,
      name: '読書',
      description: '1日30分の読書時間',
      current_streak: 3,
      best_streak: 7,
      total_completions: 15,
      frequency: 1
    }
  ]);
  
  const [userStats, setUserStats] = useState({ trees: 4, completions: 43 });
  const [gameStats, setGameStats] = useState({ level: 3, experience: 280, forestSize: 35 });
  const [specialTrees, setSpecialTrees] = useState({ golden: 1, mystical: 0 });
  const [newHabit, setNewHabit] = useState({ name: '', description: '', frequency: 1 });
  const [showNotification, setShowNotification] = useState(null);
  const [nextHabitId, setNextHabitId] = useState(3);
  const [currentTheme, setCurrentTheme] = useState('spring');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // サウンドエフェクトの初期化
  useEffect(() => {
    soundEffects.init();
  }, []);

  const playSound = (type) => {
    if (soundEnabled) {
      soundEffects.playSound(type);
    }
  };

  const showTemporaryNotification = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleCreateHabit = (e) => {
    e.preventDefault();
    const newHabitData = {
      id: nextHabitId,
      name: newHabit.name,
      description: newHabit.description,
      frequency: parseInt(newHabit.frequency),
      current_streak: 0,
      best_streak: 0,
      total_completions: 0
    };
    
    setHabits([...habits, newHabitData]);
    setNextHabitId(nextHabitId + 1);
    setNewHabit({ name: '', description: '', frequency: 1 });
    showTemporaryNotification('🎉 新しい習慣を作成しました！');
    playSound('click');
  };

  const handleCompleteHabit = (habitId) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newStreak = habit.current_streak + 1;
        const newBest = Math.max(newStreak, habit.best_streak);
        
        // 7日ごとに木を獲得
        if (newStreak % 7 === 0) {
          setUserStats(prev => ({ ...prev, trees: prev.trees + 1 }));
          showTemporaryNotification('🌳 新しい木を獲得しました！');
          playSound('treeGrow');
        }
        
        // 30日で特別な木
        if (newStreak === 30) {
          setSpecialTrees(prev => ({ ...prev, golden: prev.golden + 1 }));
          showTemporaryNotification('🌟 黄金の木を獲得しました！');
          playSound('achievement');
        }
        
        return {
          ...habit,
          current_streak: newStreak,
          best_streak: newBest,
          total_completions: habit.total_completions + 1
        };
      }
      return habit;
    }));
    
    // 統計を更新
    setUserStats(prev => ({ ...prev, completions: prev.completions + 1 }));
    
    // 経験値を追加
    setGameStats(prev => {
      const newExp = prev.experience + 10;
      const newLevel = Math.floor(newExp / 100) + 1;
      const newForestSize = 25 + (newLevel - 1) * 10;
      
      if (newLevel > prev.level) {
        showTemporaryNotification('🎊 レベルアップ！');
        playSound('levelUp');
      }
      
      return {
        level: newLevel,
        experience: newExp,
        forestSize: newForestSize
      };
    });
    
    showTemporaryNotification('✅ 習慣を完了しました！');
    playSound('complete');
  };

  const handleChallengeComplete = (challenge) => {
    showTemporaryNotification(`🎁 ${challenge.reward}を獲得しました！`);
    playSound('achievement');
    // ここに報酬付与のロジックを追加
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
    // テーマに応じて背景を変更するロジックを追加可能
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1200px' }}>
          <h1>🌳 Focus Tree - Starknet (デモモード)</h1>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '10px',
              padding: '0.5rem 1rem',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
            title={soundEnabled ? 'サウンドOFF' : 'サウンドON'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
        
        {showNotification && (
          <div className="notification">
            {showNotification}
          </div>
        )}
        
        <div className="game-header">
          <div className="user-level">
            <span className="level-badge">Lv.{gameStats.level}</span>
            <span className="exp-text">{gameStats.experience} EXP</span>
          </div>
          <div className="user-stats">
            <div className="stat">
              <span className="stat-icon">🌳</span>
              <span className="stat-value">{userStats.trees}</span>
              <span className="stat-label">Trees</span>
            </div>
            <div className="stat">
              <span className="stat-icon">✅</span>
              <span className="stat-value">{userStats.completions}</span>
              <span className="stat-label">Completions</span>
            </div>
          </div>
        </div>

        <SeasonalEvent onThemeChange={handleThemeChange} />

        <ForestView 
          trees={userStats.trees}
          level={gameStats.level}
          forestSize={gameStats.forestSize}
          specialTrees={specialTrees}
        />

        <div className="challenges-leaderboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Challenges onChallengeComplete={handleChallengeComplete} />
          <Leaderboard />
        </div>

        <AchievementBadges 
          unlockedIds={[1, 2, 3]}
        />

        <form onSubmit={handleCreateHabit} className="habit-form">
          <h2>Create New Habit</h2>
          <input
            type="text"
            placeholder="Habit name"
            value={newHabit.name}
            onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={newHabit.description}
            onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
            required
          />
          <select
            value={newHabit.frequency}
            onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value})}
          >
            <option value="1">Daily</option>
            <option value="7">Weekly</option>
            <option value="30">Monthly</option>
          </select>
          <button type="submit">Create Habit</button>
        </form>

        <div className="habits-list">
          <h2>Your Habits</h2>
          {habits.map((habit) => (
            <div key={habit.id} className="habit-card">
              <h3>{habit.name}</h3>
              <p>{habit.description}</p>
              <div className="habit-stats">
                <span>🔥 {habit.current_streak} day streak</span>
                <span>🏆 Best: {habit.best_streak}</span>
                <span>Total: {habit.total_completions}</span>
              </div>
              <button 
                onClick={() => handleCompleteHabit(habit.id)}
                className="complete-btn"
              >
                Complete Today
              </button>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
          <p style={{ opacity: 0.8 }}>
            ⚠️ デモモード - ブロックチェーンに接続されていません
          </p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            ETHを取得したら、実際のブロックチェーンにデプロイできます
          </p>
        </div>
      </header>
    </div>
  );
}

export default MockApp;