import React from 'react';
import './App.css';

function Demo() {
  const mockHabits = [
    {
      id: 1,
      name: '毎日の瞑想',
      description: '10分間の朝の瞑想',
      current_streak: 7,
      best_streak: 14,
      total_completions: 28
    },
    {
      id: 2,
      name: '読書',
      description: '1日30分の読書時間',
      current_streak: 3,
      best_streak: 7,
      total_completions: 15
    }
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌳 Focus Tree - Starknet</h1>
        
        <div className="user-stats">
          <div className="stat">
            <span className="stat-icon">🌳</span>
            <span className="stat-value">4</span>
            <span className="stat-label">Trees</span>
          </div>
          <div className="stat">
            <span className="stat-icon">✅</span>
            <span className="stat-value">43</span>
            <span className="stat-label">Completions</span>
          </div>
        </div>

        <form className="habit-form">
          <h2>Create New Habit</h2>
          <input type="text" placeholder="Habit name" value="運動" readOnly />
          <input type="text" placeholder="Description" value="30分のジョギング" readOnly />
          <select value="1">
            <option value="1">Daily</option>
            <option value="7">Weekly</option>
            <option value="30">Monthly</option>
          </select>
          <button type="button">Create Habit</button>
        </form>

        <div className="habits-list">
          <h2>Your Habits</h2>
          {mockHabits.map((habit) => (
            <div key={habit.id} className="habit-card">
              <h3>{habit.name}</h3>
              <p>{habit.description}</p>
              <div className="habit-stats">
                <span>🔥 {habit.current_streak} day streak</span>
                <span>🏆 Best: {habit.best_streak}</span>
                <span>Total: {habit.total_completions}</span>
              </div>
              <button className="complete-btn">
                Complete Today
              </button>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default Demo;