import React, { useState, useEffect } from 'react';
import { useAccount, useContract, useContractWrite, useContractRead, useConnect } from '@starknet-react/core';
import ForestView from './ForestView';
import AchievementBadges from './AchievementBadges';
import './App.css';

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

const ABI = [
  {
    "name": "create_habit",
    "type": "function",
    "inputs": [
      {"name": "name", "type": "felt"},
      {"name": "description", "type": "felt"},
      {"name": "frequency", "type": "felt"}
    ],
    "outputs": [{"type": "felt"}]
  },
  {
    "name": "complete_habit",
    "type": "function",
    "inputs": [{"name": "habit_id", "type": "felt"}],
    "outputs": []
  },
  {
    "name": "get_user_habits",
    "type": "function",
    "inputs": [],
    "outputs": [{"type": "felt*"}],
    "stateMutability": "view"
  },
  {
    "name": "get_user_stats",
    "type": "function",
    "inputs": [],
    "outputs": [{"type": "(felt, felt)"}],
    "stateMutability": "view"
  },
  {
    "name": "get_user_game_stats",
    "type": "function",
    "inputs": [],
    "outputs": [{"type": "(felt, felt, felt)"}],
    "stateMutability": "view"
  }
];

function App() {
  const { account, address, status } = useAccount();
  const { connect, connectors } = useConnect();
  const [habits, setHabits] = useState([]);
  const [userStats, setUserStats] = useState({ trees: 0, completions: 0 });
  const [gameStats, setGameStats] = useState({ level: 1, experience: 0, forestSize: 25 });
  const [specialTrees, setSpecialTrees] = useState({ golden: 0, mystical: 0 });
  const [newHabit, setNewHabit] = useState({ name: '', description: '', frequency: 1 });
  const [showNotification, setShowNotification] = useState(null);

  const { contract } = useContract({
    abi: ABI,
    address: CONTRACT_ADDRESS,
  });

  const { writeAsync: createHabit } = useContractWrite({
    calls: contract && [{
      contractAddress: CONTRACT_ADDRESS,
      entrypoint: 'create_habit',
      calldata: [newHabit.name, newHabit.description, newHabit.frequency]
    }]
  });

  const { writeAsync: completeHabit } = useContractWrite({
    calls: contract && [{
      contractAddress: CONTRACT_ADDRESS,
      entrypoint: 'complete_habit',
      calldata: []
    }]
  });

  const loadUserData = async () => {
    if (!contract || !address) return;

    try {
      const userHabits = await contract.get_user_habits();
      const stats = await contract.get_user_stats();
      const gameData = await contract.get_user_game_stats();
      
      setHabits(userHabits);
      setUserStats({ trees: stats[0], completions: stats[1] });
      setGameStats({
        level: gameData[0] || 1,
        experience: gameData[1] || 0,
        forestSize: gameData[2] || 25
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  useEffect(() => {
    if (status === 'connected') {
      loadUserData();
    }
  }, [status, address]);

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    try {
      await createHabit();
      setNewHabit({ name: '', description: '', frequency: 1 });
      loadUserData();
      showTemporaryNotification('🎉 新しい習慣を作成しました！');
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  const handleCompleteHabit = async (habitId) => {
    try {
      await completeHabit({ calldata: [habitId] });
      loadUserData();
      showTemporaryNotification('✅ 習慣を完了しました！');
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  const showTemporaryNotification = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 3000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌳 Focus Tree - Starknet</h1>
        
        {showNotification && (
          <div className="notification">
            {showNotification}
          </div>
        )}
        
        {status === 'disconnected' ? (
          <div className="connect-prompt">
            <p>Connect your wallet to start tracking habits!</p>
            <div className="wallet-buttons">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  className="wallet-btn"
                >
                  Connect {connector.id === 'argentX' ? 'ArgentX' : 'Braavos'}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
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

            <ForestView 
              trees={userStats.trees}
              level={gameStats.level}
              forestSize={gameStats.forestSize}
              specialTrees={specialTrees}
            />

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
              {habits.length === 0 ? (
                <p>No habits yet. Create your first habit!</p>
              ) : (
                habits.map((habit, index) => (
                  <div key={index} className="habit-card">
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
                ))
              )}
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;