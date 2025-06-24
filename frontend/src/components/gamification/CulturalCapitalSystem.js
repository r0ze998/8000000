import React, { useState, useEffect } from 'react';
import './CulturalCapitalSystem.css';

function CulturalCapitalSystem({ userProfile, onKnowledgeGain, onSpecializationUnlock }) {
  const [culturalProfile, setCulturalProfile] = useState({
    totalCapital: 0,
    knowledgeAreas: {},
    specializations: [],
    achievements: [],
    contributions: [],
    reputation: 0,
    teachingRank: '初学者'
  });

  const [learningModules, setLearningModules] = useState([]);
  const [knowledgeMarketplace, setKnowledgeMarketplace] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showLearningModal, setShowLearningModal] = useState(false);

  // 文化分野の定義
  const culturalAreas = {
    history: {
      name: '神社史学',
      description: '神社の歴史、由来、変遷を学ぶ',
      icon: '📚',
      levels: ['古代', '中世', '近世', '近現代', '専門研究者'],
      maxLevel: 100
    },
    architecture: {
      name: '神社建築学',
      description: '神社建築の様式、技法、美術を理解する',
      icon: '🏗️',
      levels: ['基礎', '様式理解', '技法習得', '設計理論', '建築師'],
      maxLevel: 100
    },
    rituals: {
      name: '神道儀礼学',
      description: '神道の儀礼、作法、祭事を習得する',
      icon: '🎌',
      levels: ['見習い', '助手', '正式', '指導者', '大神主'],
      maxLevel: 100
    },
    culture: {
      name: '文化人類学',
      description: '地域文化、民俗、伝承を研究する',
      icon: '🌸',
      levels: ['観察者', '記録者', '研究者', '専門家', '文化保護者'],
      maxLevel: 100
    },
    arts: {
      name: '神社芸術学',
      description: '神楽、絵画、彫刻、工芸を理解する',
      icon: '🎭',
      levels: ['鑑賞者', '理解者', '実践者', '指導者', '芸術家'],
      maxLevel: 100
    },
    linguistics: {
      name: '古典文学',
      description: '祝詞、古事記、日本書紀等の古典を学ぶ',
      icon: '📜',
      levels: ['読み手', '理解者', '解釈者', '研究者', '古典学者'],
      maxLevel: 100
    }
  };

  useEffect(() => {
    // 学習モジュールの初期化
    initializeLearningModules();
    // 知識マーケットプレイスの初期化
    initializeKnowledgeMarketplace();
    // ユーザーの文化プロフィールを読み込み
    loadUserCulturalProfile();
  }, []);

  const initializeLearningModules = () => {
    setLearningModules([
      {
        id: 'intro_shinto',
        title: '神道入門',
        area: 'history',
        difficulty: 1,
        duration: '15分',
        rewards: { capital: 50, experience: 100 },
        content: {
          type: 'interactive',
          sections: [
            {
              title: '神道とは何か',
              content: '神道は日本古来の宗教で、自然現象や祖先を神として崇拝します。',
              quiz: {
                question: '神道の特徴として正しいものはどれですか？',
                options: ['自然崇拝', '偶像崇拝', '教典中心', '預言者崇拝'],
                correct: 0
              }
            },
            {
              title: '神社の成り立ち',
              content: '神社は神道の祭祀施設として発展し、地域コミュニティの中心となりました。',
              quiz: {
                question: '神社の主な役割は何ですか？',
                options: ['商業活動', '祭祀と信仰', '政治活動', '軍事活動'],
                correct: 1
              }
            }
          ]
        },
        prerequisites: [],
        completedBy: 12500
      },
      {
        id: 'shrine_architecture',
        title: '神社建築の基礎',
        area: 'architecture',
        difficulty: 2,
        duration: '25分',
        rewards: { capital: 80, experience: 150 },
        content: {
          type: 'visual',
          sections: [
            {
              title: '鳥居の種類と意味',
              content: '鳥居は神域と俗域を分ける結界の役割を持ちます。',
              images: ['torii_types.jpg'],
              quiz: {
                question: '最も一般的な鳥居の形式は？',
                options: ['神明鳥居', '明神鳥居', '両部鳥居', '三輪鳥居'],
                correct: 1
              }
            }
          ]
        },
        prerequisites: ['intro_shinto'],
        completedBy: 8200
      },
      {
        id: 'seasonal_festivals',
        title: '季節の祭事',
        area: 'rituals',
        difficulty: 2,
        duration: '20分',
        rewards: { capital: 70, experience: 120 },
        content: {
          type: 'seasonal',
          sections: [
            {
              title: '春の祭り',
              content: '春祭りは豊作を願い、新しい生命力を讃える祭事です。',
              quiz: {
                question: '春の代表的な祭りは？',
                options: ['花祭り', '夏祭り', '収穫祭', '火祭り'],
                correct: 0
              }
            }
          ]
        },
        prerequisites: ['intro_shinto'],
        completedBy: 6800
      }
    ]);
  };

  const initializeKnowledgeMarketplace = () => {
    setKnowledgeMarketplace([
      {
        id: 'expert_lecture_1',
        type: 'lecture',
        title: '國學院大學特別講義：古事記の神話世界',
        instructor: '田中教授（神道学博士）',
        price: 500,
        duration: '90分',
        rating: 4.8,
        participants: 250,
        area: 'linguistics',
        level: 'advanced',
        description: '古事記に記された神話の深層を現代的視点で解読する特別講義'
      },
      {
        id: 'master_class_1',
        type: 'masterclass',
        title: '宮大工による神社建築マスタークラス',
        instructor: '佐藤棟梁（文化財保護指定職人）',
        price: 1200,
        duration: '3時間',
        rating: 4.9,
        participants: 85,
        area: 'architecture',
        level: 'expert',
        description: '1300年続く宮大工の技術を実演と解説で学ぶ'
      },
      {
        id: 'peer_session_1',
        type: 'peer_learning',
        title: '神楽実践ワークショップ',
        instructor: 'コミュニティ有志',
        price: 200,
        duration: '2時間',
        rating: 4.3,
        participants: 15,
        area: 'arts',
        level: 'intermediate',
        description: '参加者同士で神楽の基本を学び合う実践セッション'
      }
    ]);
  };

  const loadUserCulturalProfile = () => {
    // 実際の実装では、ユーザーの保存データから読み込み
    setCulturalProfile({
      totalCapital: userProfile.culturalCapital || 0,
      knowledgeAreas: {
        history: 25,
        architecture: 15,
        rituals: 30,
        culture: 20,
        arts: 10,
        linguistics: 5
      },
      specializations: ['history', 'rituals'],
      achievements: [
        '神道入門修了',
        '地域文化研究者',
        '10神社参拝達成'
      ],
      contributions: [
        {
          type: 'knowledge_sharing',
          title: '明治神宮の歴史解説記事',
          impact: 150,
          date: '2024-01-15'
        }
      ],
      reputation: 750,
      teachingRank: '指導補助'
    });
  };

  // 学習モジュール完了処理
  const completeModule = async (module) => {
    try {
      // 知識レベル更新
      const newKnowledgeAreas = { ...culturalProfile.knowledgeAreas };
      newKnowledgeAreas[module.area] = Math.min(
        (newKnowledgeAreas[module.area] || 0) + (module.rewards.capital / 10),
        culturalAreas[module.area].maxLevel
      );

      // 特化分野の判定
      const newSpecializations = [...culturalProfile.specializations];
      if (newKnowledgeAreas[module.area] >= 50 && !newSpecializations.includes(module.area)) {
        newSpecializations.push(module.area);
        onSpecializationUnlock(culturalAreas[module.area]);
      }

      // 文化資本更新
      const newTotalCapital = culturalProfile.totalCapital + module.rewards.capital;

      setCulturalProfile(prev => ({
        ...prev,
        totalCapital: newTotalCapital,
        knowledgeAreas: newKnowledgeAreas,
        specializations: newSpecializations
      }));

      onKnowledgeGain({
        area: module.area,
        amount: module.rewards.capital,
        module: module.title
      });

      return true;
    } catch (error) {
      console.error('学習完了処理エラー:', error);
      return false;
    }
  };

  // 知識共有システム
  const shareKnowledge = (topic, content) => {
    const contribution = {
      id: Date.now().toString(),
      type: 'knowledge_sharing',
      topic,
      content,
      author: userProfile.name,
      timestamp: new Date().toISOString(),
      upvotes: 0,
      impact: 0
    };

    setCulturalProfile(prev => ({
      ...prev,
      contributions: [...prev.contributions, contribution]
    }));

    return contribution;
  };

  // 文化大使プログラム
  const applyForAmbassador = (area) => {
    const requirements = {
      knowledgeLevel: 70,
      contributions: 5,
      reputation: 1000
    };

    const userLevel = culturalProfile.knowledgeAreas[area] || 0;
    const userContributions = culturalProfile.contributions.length;
    const userReputation = culturalProfile.reputation;

    const qualified = 
      userLevel >= requirements.knowledgeLevel &&
      userContributions >= requirements.contributions &&
      userReputation >= requirements.reputation;

    return {
      qualified,
      requirements,
      current: {
        knowledgeLevel: userLevel,
        contributions: userContributions,
        reputation: userReputation
      }
    };
  };

  // 文化資本ランキング計算
  const calculateRank = () => {
    const totalCapital = culturalProfile.totalCapital;
    if (totalCapital >= 10000) return { rank: '文化マスター', color: '#FFD700' };
    if (totalCapital >= 5000) return { rank: '文化エキスパート', color: '#C0C0C0' };
    if (totalCapital >= 2000) return { rank: '文化愛好家', color: '#CD7F32' };
    if (totalCapital >= 500) return { rank: '文化学習者', color: '#4CAF50' };
    return { rank: '文化初心者', color: '#9E9E9E' };
  };

  const userRank = calculateRank();

  return (
    <div className="cultural-capital-system">
      <div className="system-header">
        <h2>📚 文化資本システム</h2>
        <p>あなたの文化的知識と貢献を見える化します</p>
      </div>

      {/* 文化プロフィールダッシュボード */}
      <div className="cultural-dashboard">
        <div className="profile-overview">
          <div className="capital-display">
            <div className="total-capital">
              <span className="capital-amount">{culturalProfile.totalCapital.toLocaleString()}</span>
              <span className="capital-label">総文化資本</span>
            </div>
            <div className="user-rank" style={{ color: userRank.color }}>
              <span className="rank-title">{userRank.rank}</span>
              <span className="rank-reputation">評価: {culturalProfile.reputation}</span>
            </div>
          </div>

          <div className="teaching-status">
            <span className="teaching-rank">指導レベル: {culturalProfile.teachingRank}</span>
          </div>
        </div>

        {/* 専門分野の可視化 */}
        <div className="knowledge-areas">
          <h3>🎯 専門分野</h3>
          <div className="areas-grid">
            {Object.entries(culturalAreas).map(([key, area]) => {
              const level = culturalProfile.knowledgeAreas[key] || 0;
              const isSpecialized = culturalProfile.specializations.includes(key);
              
              return (
                <div key={key} className={`area-card ${isSpecialized ? 'specialized' : ''}`}>
                  <div className="area-header">
                    <span className="area-icon">{area.icon}</span>
                    <span className="area-name">{area.name}</span>
                  </div>
                  
                  <div className="level-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(level / area.maxLevel) * 100}%` }}
                      />
                    </div>
                    <span className="level-text">Lv.{level}</span>
                  </div>
                  
                  <div className="level-title">
                    {area.levels[Math.min(Math.floor(level / 20), area.levels.length - 1)]}
                  </div>
                  
                  {isSpecialized && (
                    <div className="specialized-badge">⭐ 専門分野</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 実績・貢献 */}
        <div className="achievements-contributions">
          <div className="achievements">
            <h4>🏆 実績</h4>
            <div className="achievement-list">
              {culturalProfile.achievements.map((achievement, index) => (
                <div key={index} className="achievement-item">
                  <span className="achievement-icon">🎖️</span>
                  <span className="achievement-name">{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="contributions">
            <h4>✍️ 知識貢献</h4>
            <div className="contribution-list">
              {culturalProfile.contributions.map((contribution, index) => (
                <div key={index} className="contribution-item">
                  <span className="contribution-title">{contribution.title}</span>
                  <span className="contribution-impact">
                    影響度: {contribution.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 学習モジュール */}
      <div className="learning-modules">
        <h3>📖 学習モジュール</h3>
        <div className="modules-grid">
          {learningModules.map(module => {
            const canAccess = module.prerequisites.length === 0 || 
              module.prerequisites.every(prereq => 
                culturalProfile.achievements.some(ach => ach.includes(prereq))
              );

            return (
              <div key={module.id} className={`module-card ${!canAccess ? 'locked' : ''}`}>
                <div className="module-header">
                  <h4>{module.title}</h4>
                  <span className="module-area">
                    {culturalAreas[module.area]?.icon} {culturalAreas[module.area]?.name}
                  </span>
                </div>

                <div className="module-info">
                  <div className="module-stats">
                    <span className="difficulty">難易度: {'⭐'.repeat(module.difficulty)}</span>
                    <span className="duration">時間: {module.duration}</span>
                  </div>
                  
                  <div className="module-rewards">
                    <span className="capital-reward">+{module.rewards.capital} 文化資本</span>
                    <span className="exp-reward">+{module.rewards.experience} 経験値</span>
                  </div>

                  <div className="completion-stats">
                    {module.completedBy.toLocaleString()}人が修了
                  </div>
                </div>

                {canAccess ? (
                  <button 
                    className="start-module-btn"
                    onClick={() => {
                      setSelectedModule(module);
                      setShowLearningModal(true);
                    }}
                  >
                    学習開始
                  </button>
                ) : (
                  <div className="locked-message">
                    <span>🔒 前提条件未達成</span>
                    <div className="prerequisites">
                      必要: {module.prerequisites.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 知識マーケットプレイス */}
      <div className="knowledge-marketplace">
        <h3>🏪 知識マーケットプレイス</h3>
        <div className="marketplace-grid">
          {knowledgeMarketplace.map(item => (
            <div key={item.id} className="marketplace-item">
              <div className="item-header">
                <h4>{item.title}</h4>
                <span className="item-type">{item.type}</span>
              </div>

              <div className="instructor-info">
                <span className="instructor-name">{item.instructor}</span>
                <div className="item-rating">
                  ⭐ {item.rating} ({item.participants}人参加)
                </div>
              </div>

              <div className="item-details">
                <p>{item.description}</p>
                <div className="item-meta">
                  <span className="area-tag">
                    {culturalAreas[item.area]?.icon} {culturalAreas[item.area]?.name}
                  </span>
                  <span className="level-tag">{item.level}</span>
                  <span className="duration-tag">{item.duration}</span>
                </div>
              </div>

              <div className="item-price">
                <span className="price">{item.price} 文化資本</span>
                <button 
                  className="purchase-btn"
                  disabled={culturalProfile.totalCapital < item.price}
                >
                  参加申し込み
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 文化大使プログラム */}
      <div className="ambassador-program">
        <h3>🎌 文化大使プログラム</h3>
        <p>専門分野で他のユーザーを指導し、文化の継承者となろう</p>
        
        <div className="ambassador-areas">
          {Object.entries(culturalAreas).map(([key, area]) => {
            const application = applyForAmbassador(key);
            
            return (
              <div key={key} className="ambassador-card">
                <h4>{area.icon} {area.name} 大使</h4>
                
                <div className="requirements-check">
                  <div className={`requirement ${application.current.knowledgeLevel >= application.requirements.knowledgeLevel ? 'met' : 'unmet'}`}>
                    知識レベル: {application.current.knowledgeLevel}/{application.requirements.knowledgeLevel}
                  </div>
                  <div className={`requirement ${application.current.contributions >= application.requirements.contributions ? 'met' : 'unmet'}`}>
                    貢献数: {application.current.contributions}/{application.requirements.contributions}
                  </div>
                  <div className={`requirement ${application.current.reputation >= application.requirements.reputation ? 'met' : 'unmet'}`}>
                    評価: {application.current.reputation}/{application.requirements.reputation}
                  </div>
                </div>

                <button 
                  className="apply-ambassador-btn"
                  disabled={!application.qualified}
                >
                  {application.qualified ? '大使申請' : '要件不足'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 学習モーダル */}
      {showLearningModal && selectedModule && (
        <div className="learning-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedModule.title}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowLearningModal(false)}
              >
                ×
              </button>
            </div>

            <div className="learning-content">
              {selectedModule.content.sections.map((section, index) => (
                <div key={index} className="learning-section">
                  <h4>{section.title}</h4>
                  <p>{section.content}</p>
                  
                  {section.quiz && (
                    <div className="quiz-section">
                      <h5>理解度チェック:</h5>
                      <p>{section.quiz.question}</p>
                      <div className="quiz-options">
                        {section.quiz.options.map((option, optIndex) => (
                          <button 
                            key={optIndex}
                            className="quiz-option"
                            onClick={() => {
                              if (optIndex === section.quiz.correct) {
                                // 正解処理
                              }
                            }}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="module-actions">
              <button 
                className="complete-module-btn"
                onClick={() => {
                  completeModule(selectedModule);
                  setShowLearningModal(false);
                }}
              >
                学習完了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CulturalCapitalSystem;