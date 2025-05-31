import React, { useState } from 'react';
import './LearnTab.css';
import CulturalCapitalSystem from './CulturalCapitalSystem';

const LearnTab = ({
  userProfile,
  soundEffects,
  showTemporaryNotification,
  updatePlayerExperience,
  unlockAchievement
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCulturalSystem, setShowCulturalSystem] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const learningCategories = [
    { id: 'all', label: 'すべて', icon: '📚' },
    { id: 'history', label: '歴史', icon: '🏛️' },
    { id: 'culture', label: '文化', icon: '🎭' },
    { id: 'architecture', label: '建築', icon: '⛩️' },
    { id: 'rituals', label: '儀式', icon: '🙏' },
    { id: 'mythology', label: '神話', icon: '🐉' }
  ];

  const learningModules = [
    {
      id: 'shinto-basics',
      category: 'culture',
      title: '神道の基礎',
      description: '日本の伝統的な宗教である神道の基本概念を学ぶ',
      difficulty: 'beginner',
      duration: '15分',
      points: 100,
      icon: '⛩️'
    },
    {
      id: 'shrine-architecture',
      category: 'architecture',
      title: '神社建築の美',
      description: '鳥居から本殿まで、神社建築の構造と意味を探る',
      difficulty: 'intermediate',
      duration: '20分',
      points: 150,
      icon: '🏗️'
    },
    {
      id: 'festival-traditions',
      category: 'rituals',
      title: '祭りの伝統',
      description: '日本各地の祭りとその文化的意義を理解する',
      difficulty: 'beginner',
      duration: '25分',
      points: 120,
      icon: '🎆'
    },
    {
      id: 'mythology-stories',
      category: 'mythology',
      title: '日本神話入門',
      description: '古事記・日本書紀から学ぶ神々の物語',
      difficulty: 'advanced',
      duration: '30分',
      points: 200,
      icon: '📜'
    }
  ];

  const quickQuizzes = [
    {
      id: 'daily-quiz',
      title: '今日の神社クイズ',
      questions: 5,
      reward: 50,
      time: '5分'
    },
    {
      id: 'weekly-challenge',
      title: '週間チャレンジ',
      questions: 10,
      reward: 200,
      time: '15分'
    }
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    soundEffects.playSound('koto');
  };

  const handleModuleStart = (module) => {
    setShowCulturalSystem(true);
    showTemporaryNotification(`📚 ${module.title}の学習を開始します`);
    soundEffects.playSound('bell');
  };

  const handleQuizStart = (quiz) => {
    setCurrentQuiz(quiz);
    showTemporaryNotification(`🎯 ${quiz.title}を開始します！`);
    soundEffects.playSound('taiko');
  };

  const handleKnowledgeGain = (knowledge) => {
    updatePlayerExperience(knowledge.amount);
    showTemporaryNotification(`📚 ${knowledge.area}で${knowledge.amount}文化資本を獲得！`);
    soundEffects.playSound('koto');
  };

  const handleSpecializationUnlock = (area) => {
    unlockAchievement(`specialist-${area.name}`, `${area.name}専門家`);
    showTemporaryNotification(`🎓 ${area.name}の専門家になりました！`);
    soundEffects.playSound('gong');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'beginner';
      case 'intermediate': return 'intermediate';
      case 'advanced': return 'advanced';
      default: return '';
    }
  };

  const filteredModules = selectedCategory === 'all'
    ? learningModules
    : learningModules.filter(module => module.category === selectedCategory);

  return (
    <div className="learn-tab">
      {/* ヘッダー */}
      <div className="learn-header">
        <h2>📚 学びの道</h2>
        <p className="learn-description">
          神社文化を学び、文化資本を積み上げましょう
        </p>
      </div>

      {/* 学習進捗 */}
      <div className="learning-progress">
        <div className="progress-card">
          <div className="progress-icon">🎓</div>
          <div className="progress-content">
            <h3>あなたの学習レベル</h3>
            <div className="level-info">
              <span className="level">レベル {userProfile.level || 1}</span>
              <span className="exp">{userProfile.experience || 0} / {(userProfile.level || 1) * 1000} EXP</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((userProfile.experience || 0) % 1000) / 10}%` }}
              />
            </div>
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <span className="stat-value">{userProfile.culturalCapital || 0}</span>
            <span className="stat-label">文化資本</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{userProfile.lessonsCompleted || 0}</span>
            <span className="stat-label">完了レッスン</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{userProfile.streak || 0}日</span>
            <span className="stat-label">連続学習</span>
          </div>
        </div>
      </div>

      {/* カテゴリー選択 */}
      <div className="category-selector">
        <div className="category-pills">
          {learningCategories.map(category => (
            <button
              key={category.id}
              className={`category-pill ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* クイックチャレンジ */}
      <div className="quick-challenges">
        <h3>⚡ クイックチャレンジ</h3>
        <div className="challenge-cards">
          {quickQuizzes.map(quiz => (
            <div key={quiz.id} className="challenge-card">
              <div className="challenge-header">
                <h4>{quiz.title}</h4>
                <span className="reward">+{quiz.reward} 文化資本</span>
              </div>
              <div className="challenge-info">
                <span>❓ {quiz.questions}問</span>
                <span>⏱️ {quiz.time}</span>
              </div>
              <button
                className="challenge-btn"
                onClick={() => handleQuizStart(quiz)}
              >
                挑戦する
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 学習モジュール */}
      <div className="learning-modules">
        <h3>📖 学習コース</h3>
        <div className="modules-grid">
          {filteredModules.map(module => (
            <div key={module.id} className="module-card">
              <div className="module-icon">{module.icon}</div>
              <div className="module-content">
                <h4>{module.title}</h4>
                <p>{module.description}</p>
                <div className="module-meta">
                  <span className={`difficulty ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty === 'beginner' ? '初級' :
                     module.difficulty === 'intermediate' ? '中級' : '上級'}
                  </span>
                  <span className="duration">⏱️ {module.duration}</span>
                  <span className="points">💎 {module.points}</span>
                </div>
                <button
                  className="start-btn"
                  onClick={() => handleModuleStart(module)}
                >
                  学習を開始
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 専門分野 */}
      <div className="specializations">
        <h3>🏆 専門分野</h3>
        <div className="specialization-grid">
          <div className="specialization-card">
            <div className="spec-icon">🏛️</div>
            <h4>歴史専門家</h4>
            <p>神社の歴史と変遷を深く理解</p>
            <div className="spec-progress">
              <div className="spec-bar">
                <div className="spec-fill" style={{ width: '45%' }} />
              </div>
              <span>45%</span>
            </div>
          </div>
          <div className="specialization-card">
            <div className="spec-icon">⛩️</div>
            <h4>建築専門家</h4>
            <p>神社建築の構造と美を探求</p>
            <div className="spec-progress">
              <div className="spec-bar">
                <div className="spec-fill" style={{ width: '30%' }} />
              </div>
              <span>30%</span>
            </div>
          </div>
          <div className="specialization-card">
            <div className="spec-icon">🎭</div>
            <h4>文化専門家</h4>
            <p>祭りと伝統文化の継承者</p>
            <div className="spec-progress">
              <div className="spec-bar">
                <div className="spec-fill" style={{ width: '60%' }} />
              </div>
              <span>60%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 文化資本システム詳細 */}
      {showCulturalSystem && (
        <div className="cultural-overlay">
          <button
            className="close-btn"
            onClick={() => setShowCulturalSystem(false)}
          >
            ✕
          </button>
          <div className="cultural-content">
            <CulturalCapitalSystem
              userProfile={userProfile}
              onKnowledgeGain={handleKnowledgeGain}
              onSpecializationUnlock={handleSpecializationUnlock}
            />
          </div>
        </div>
      )}

      {/* 今日のヒント */}
      <div className="daily-tips">
        <h3>💡 今日の豆知識</h3>
        <div className="tip-card">
          <div className="tip-icon">🌸</div>
          <div className="tip-content">
            <h4>鳥居の色の意味</h4>
            <p>朱色の鳥居は魔除けの意味があり、生命力や太陽を象徴しています。特に稲荷神社でよく見られます。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnTab;