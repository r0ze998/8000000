import React, { useState, useEffect } from 'react';
import './TourismIntegration.css';

function TourismIntegration({ userLocation, userProfile, onRouteOptimized, onEconomicImpact }) {
  const [tourismData, setTourismData] = useState({});
  const [optimizedRoutes, setOptimizedRoutes] = useState([]);
  const [economicImpact, setEconomicImpact] = useState({});
  const [culturalHeritage, setCulturalHeritage] = useState([]);
  const [languageSettings, setLanguageSettings] = useState('ja');
  const [regionalInsights, setRegionalInsights] = useState({});

  // 多言語対応
  const translations = {
    ja: {
      title: '🌍 文化観光統合システム',
      subtitle: '日本の文化遺産を世界に発信し、持続可能な観光を促進',
      economicImpact: '経済効果',
      routes: '推奨ルート',
      heritage: '文化遺産',
      businesses: '連携事業者'
    },
    en: {
      title: '🌍 Cultural Tourism Integration',
      subtitle: 'Promoting sustainable tourism through Japanese cultural heritage',
      economicImpact: 'Economic Impact',
      routes: 'Recommended Routes',
      heritage: 'Cultural Heritage',
      businesses: 'Partner Businesses'
    },
    ko: {
      title: '🌍 문화 관광 통합 시스템',
      subtitle: '일본 문화유산을 통한 지속 가능한 관광 촉진',
      economicImpact: '경제 효과',
      routes: '추천 루트',
      heritage: '문화유산',
      businesses: '협력 사업체'
    },
    zh: {
      title: '🌍 文化旅游整合系统',
      subtitle: '通过日本文化遗产促进可持续旅游',
      economicImpact: '经济影响',
      routes: '推荐路线',
      heritage: '文化遗产',
      businesses: '合作企业'
    }
  };

  const t = translations[languageSettings] || translations.ja;

  useEffect(() => {
    initializeTourismData();
    calculateEconomicImpact();
    generateOptimizedRoutes();
    loadCulturalHeritage();
    generateRegionalInsights();
  }, [userLocation, userProfile]);

  const initializeTourismData = () => {
    setTourismData({
      totalVisitors: 2547000,
      internationalVisitors: 1253000,
      domesticVisitors: 1294000,
      averageStay: 3.2,
      totalSpending: 45600000000, // 456億円
      regions: {
        kanto: {
          name: '関東地方',
          visitors: 1245000,
          spending: 18200000000,
          topShrines: ['明治神宮', '浅草寺', '川越氷川神社'],
          seasonalTrends: {
            spring: 1.3,
            summer: 0.9,
            autumn: 1.2,
            winter: 0.8
          }
        },
        kansai: {
          name: '関西地方',
          visitors: 896000,
          spending: 13400000000,
          topShrines: ['伏見稲荷大社', '春日大社', '住吉大社'],
          seasonalTrends: {
            spring: 1.4,
            summer: 1.0,
            autumn: 1.3,
            winter: 0.7
          }
        },
        chubu: {
          name: '中部地方',
          visitors: 406000,
          spending: 7800000000,
          topShrines: ['熱田神宮', '諏訪大社', '白山比咩神社'],
          seasonalTrends: {
            spring: 1.1,
            summer: 1.2,
            autumn: 1.0,
            winter: 0.9
          }
        }
      },
      trends: {
        monthlyGrowth: 12.5,
        culturalInterest: 89.3,
        sustainabilityScore: 7.6,
        satisfactionRate: 92.1
      }
    });
  };

  const calculateEconomicImpact = () => {
    const impact = {
      directRevenue: {
        shrineOfferings: 2300000000, // 23億円
        accommodation: 15600000000, // 156億円
        dining: 12800000000, // 128億円
        transportation: 8900000000, // 89億円
        shopping: 6000000000 // 60億円
      },
      indirectRevenue: {
        localServices: 3200000000,
        culturalProducts: 1800000000,
        guidingServices: 450000000
      },
      jobCreation: {
        direct: 45600,
        indirect: 23400,
        total: 69000
      },
      taxRevenue: {
        local: 1200000000,
        prefectural: 800000000,
        national: 2100000000,
        total: 4100000000
      },
      culturalPreservation: {
        restorationFunds: 890000000,
        digitizationProjects: 340000000,
        educationPrograms: 220000000
      }
    };

    setEconomicImpact(impact);
    onEconomicImpact(impact);
  };

  const generateOptimizedRoutes = () => {
    const routes = [
      {
        id: 'tokyo_heritage',
        name: '東京文化遺産ルート',
        duration: '2-3日',
        difficulty: '初級',
        type: '都市型文化観光',
        shrines: [
          {
            name: '明治神宮',
            duration: '2時間',
            highlight: '明治天皇・昭憲皇太后を祀る東京の象徴',
            culturalPoints: 150,
            nearbyAttractions: ['原宿', '表参道', '代々木公園']
          },
          {
            name: '神田明神',
            duration: '1.5時間',
            highlight: '江戸総鎮守として1300年の歴史',
            culturalPoints: 120,
            nearbyAttractions: ['秋葉原', '湯島聖堂', '神田古書街']
          },
          {
            name: '亀戸天神社',
            duration: '1時間',
            highlight: '藤の花と学問の神様で有名',
            culturalPoints: 100,
            nearbyAttractions: ['東京スカイツリー', '亀戸餃子', '錦糸公園']
          }
        ],
        accommodations: [
          {
            name: 'パークハイアット東京',
            type: 'ラグジュアリー',
            price: 45000,
            culturalProgram: '茶道体験、神社参拝ガイド付き'
          },
          {
            name: '浅草ビューホテル',
            type: 'ビジネス',
            price: 12000,
            culturalProgram: '朝の散歩参拝ツアー'
          }
        ],
        dining: [
          {
            name: '神宮前 くろ屋',
            cuisine: '懐石料理',
            price: 8000,
            culturalElement: '季節の神饌料理'
          },
          {
            name: '明治神宮外苑 精養軒',
            cuisine: '洋食',
            price: 3500,
            culturalElement: '明治時代の洋食文化'
          }
        ],
        transportation: {
          publicTransport: '都営・JR一日乗車券 800円',
          taxi: '1日チャーター 25000円',
          walkingDistance: '総距離8.5km'
        },
        totalCost: {
          budget: 15000,
          standard: 35000,
          luxury: 85000
        },
        bestSeason: '春（桜）・秋（紅葉）',
        estimatedCrowds: 'やや混雑',
        culturalLearning: [
          '明治維新と神道の近代化',
          '江戸時代の信仰文化',
          '現代都市と伝統の共存'
        ]
      },
      {
        id: 'kyoto_classical',
        name: '京都古典文化ルート',
        duration: '3-4日',
        difficulty: '中級',
        type: '伝統文化深堀り',
        shrines: [
          {
            name: '伏見稲荷大社',
            duration: '3時間',
            highlight: '千本鳥居と稲荷信仰の総本宮',
            culturalPoints: 200,
            nearbyAttractions: ['伏見酒蔵地区', '寺田屋', '黄桜カッパカントリー']
          },
          {
            name: '春日大社',
            duration: '2.5時間',
            highlight: '藤原氏の氏神、3000基の灯籠',
            culturalPoints: 180,
            nearbyAttractions: ['奈良公園', '東大寺', '興福寺']
          }
        ],
        accommodations: [
          {
            name: '京都吉兆嵐山本店',
            type: '旅館',
            price: 80000,
            culturalProgram: '茶道、華道、神社参拝作法指導'
          }
        ],
        culturalLearning: [
          '平安時代の宮廷文化',
          '神仏習合の歴史',
          '伝統工芸と神社の関係'
        ]
      },
      {
        id: 'rural_heritage',
        name: '地方文化発見ルート',
        duration: '4-5日',
        difficulty: '上級',
        type: '地域文化探訪',
        shrines: [
          {
            name: '出雲大社',
            duration: '半日',
            highlight: '縁結びの神様、古代出雲文化',
            culturalPoints: 250,
            nearbyAttractions: ['島根県立古代出雲歴史博物館', '出雲そば', '松江城']
          },
          {
            name: '厳島神社',
            duration: '半日',
            highlight: '海上鳥居、平清盛と平家物語',
            culturalPoints: 230,
            nearbyAttractions: ['宮島水族館', '紅葉谷公園', 'もみじ饅頭本店']
          }
        ],
        specialExperiences: [
          '地元漁師による海上参拝',
          '神楽実演見学',
          '伝統工芸職人工房訪問'
        ],
        culturalLearning: [
          '古代日本の信仰形態',
          '地域固有の祭祀文化',
          '自然信仰と生活文化'
        ]
      }
    ];

    setOptimizedRoutes(routes);
    onRouteOptimized(routes);
  };

  const loadCulturalHeritage = () => {
    setCulturalHeritage([
      {
        id: 'unesco_1',
        name: '厳島神社',
        type: 'UNESCO世界文化遺産',
        registrationYear: 1996,
        significance: '平安時代の寝殿造りと神道建築の傑作',
        conservationStatus: '良好',
        threats: ['海水による腐食', '観光圧力', '気候変動'],
        preservationEfforts: [
          '定期的な修復作業',
          '観光客数制限',
          '海水対策工事'
        ],
        digitalPreservation: {
          'threeDScanning': '完了',
          vrExperience: '開発中',
          historicalDocuments: '80%デジタル化済み'
        }
      },
      {
        id: 'intangible_1',
        name: '神楽',
        type: 'UNESCO無形文化遺産',
        registrationYear: 2009,
        significance: '神道の祭祀舞踊、地域コミュニティの絆',
        conservationStatus: '継承者減少の危機',
        threats: ['後継者不足', '都市化', '伝統知識の消失'],
        preservationEfforts: [
          '若手育成プログラム',
          '学校教育への導入',
          '国際交流による普及'
        ],
        digitalPreservation: {
          videoArchive: '500演目記録済み',
          motionCapture: '主要演目完了',
          onlineLearning: 'プラットフォーム構築中'
        }
      },
      {
        id: 'national_treasure_1',
        name: '春日大社本殿',
        type: '国宝',
        designation: '1952年',
        significance: '春日造りの代表例、藤原氏の氏神',
        conservationStatus: '定期修復中',
        threats: ['木材の老朽化', '白蟻被害', '地震リスク'],
        preservationEfforts: [
          '20年ごとの式年造替',
          '伝統技術の継承',
          '科学的保存処理'
        ],
        digitalPreservation: {
          detailedMeasurement: '完了',
          constructionTechniques: '動画記録済み',
          materialAnalysis: '継続中'
        }
      }
    ]);
  };

  const generateRegionalInsights = () => {
    setRegionalInsights({
      popularityTrends: {
        rising: [
          { name: '山形県・出羽三山', growth: '+45%', reason: 'スピリチュアルブーム' },
          { name: '沖縄県・琉球王国遺跡', growth: '+38%', reason: '独特な文化への関心' },
          { name: '青森県・岩木山神社', growth: '+32%', reason: 'パワースポットとして注目' }
        ],
        declining: [
          { name: '一部の都市部神社', decline: '-12%', reason: '過度な商業化への反発' }
        ]
      },
      demographicInsights: {
        age: {
          '20-30代': { domestic: '35%', international: '45%', growth: '+15%' },
          '30-40代': { domestic: '28%', international: '30%', growth: '+8%' },
          '50-60代': { domestic: '25%', international: '20%', growth: '+3%' },
          '60代以上': { domestic: '12%', international: '5%', growth: '-2%' }
        },
        interests: [
          { category: '歴史・文化学習', percentage: 78 },
          { category: '写真撮影', percentage: 65 },
          { category: 'スピリチュアル体験', percentage: 52 },
          { category: '建築鑑賞', percentage: 41 },
          { category: '地域グルメ', percentage: 73 }
        ]
      },
      sustainabilityMetrics: {
        environmentalImpact: {
          carbonFootprint: '前年比-15%改善',
          wasteReduction: '前年比-22%削減',
          energyEfficiency: '前年比+18%向上'
        },
        socialImpact: {
          localEmployment: '+12%増加',
          communityInvolvement: '85%の地域住民が観光に肯定的',
          culturalEducation: '年間15万人が文化学習プログラムに参加'
        },
        economicSustainability: {
          localRevenue: '観光収入の68%が地域に還元',
          seasonalBalance: '閑散期の収入が25%向上',
          priceStability: 'インフレ率を下回る価格上昇'
        }
      }
    });
  };

  // AI powered route optimization
  const optimizeRoute = (preferences) => {
    const { interests, budget, duration, groupSize, mobility } = preferences;
    
    // AI algorithm for personalized route optimization
    const weightedScoring = (shrine, userPrefs) => {
      let score = 0;
      
      // Interest matching
      if (userPrefs.interests.includes('history') && shrine.historicalSignificance > 80) score += 30;
      if (userPrefs.interests.includes('architecture') && shrine.architecturalValue > 70) score += 25;
      if (userPrefs.interests.includes('nature') && shrine.naturalSetting > 60) score += 20;
      
      // Budget consideration
      const totalCost = shrine.entranceFee + shrine.nearbyDiningCost + shrine.transportCost;
      if (totalCost <= userPrefs.budget * 0.3) score += 15;
      
      // Accessibility
      if (userPrefs.mobility === 'limited' && shrine.accessibilityRating > 80) score += 20;
      
      // Crowd factor
      const currentSeason = new Date().getMonth();
      const crowdLevel = shrine.seasonalCrowds[currentSeason];
      if (crowdLevel < 50) score += 10;
      
      return score;
    };

    // Return optimized route based on scoring
    return optimizedRoutes.sort((a, b) => 
      weightedScoring(b, preferences) - weightedScoring(a, preferences)
    );
  };

  // Government collaboration features
  const generateGovernmentReport = () => {
    return {
      culturalPreservationImpact: {
        documentsDigitized: 15420,
        artifactsRestored: 342,
        traditionsPracticed: 156,
        educationParticipants: 48500
      },
      economicContribution: {
        taxRevenue: economicImpact.taxRevenue.total,
        jobsCreated: economicImpact.jobCreation.total,
        localBusinessGrowth: '+23%',
        internationalRecognition: 'UNESCO commendation for digital preservation'
      },
      softPowerIndex: {
        culturalAttractiveness: 8.7,
        internationalPartnerships: 23,
        culturalExports: '+45% growth',
        diplomacyThroughCulture: '12 cultural exchange programs initiated'
      },
      recommendations: [
        '地方神社へのデジタルインフラ投資拡大',
        '多言語対応の強化',
        '持続可能な観光政策の全国展開',
        '文化遺産保護予算の増額',
        '国際的な文化交流プログラムの拡充'
      ]
    };
  };

  return (
    <div className="tourism-integration">
      <div className="integration-header">
        <div className="language-selector">
          <select 
            value={languageSettings} 
            onChange={(e) => setLanguageSettings(e.target.value)}
          >
            <option value="ja">🇯🇵 日本語</option>
            <option value="en">🇺🇸 English</option>
            <option value="ko">🇰🇷 한국어</option>
            <option value="zh">🇨🇳 中文</option>
          </select>
        </div>
        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>
      </div>

      {/* 経済効果ダッシュボード */}
      <div className="economic-dashboard">
        <h3>💰 {t.economicImpact}</h3>
        <div className="impact-metrics">
          <div className="metric-card">
            <span className="metric-value">¥{(economicImpact.directRevenue?.shrineOfferings / 100000000).toFixed(1)}億</span>
            <span className="metric-label">神社関連収入</span>
            <span className="metric-trend">+12.5%</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{(economicImpact.jobCreation?.total / 1000).toFixed(0)}千人</span>
            <span className="metric-label">雇用創出</span>
            <span className="metric-trend">+8.3%</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">¥{(economicImpact.taxRevenue?.total / 100000000).toFixed(1)}億</span>
            <span className="metric-label">税収貢献</span>
            <span className="metric-trend">+15.2%</span>
          </div>
          <div className="metric-card">
            <span className="metric-value">{tourismData.internationalVisitors?.toLocaleString()}</span>
            <span className="metric-label">国際観光客</span>
            <span className="metric-trend">+18.7%</span>
          </div>
        </div>
      </div>

      {/* 最適化ルート */}
      <div className="optimized-routes">
        <h3>🗺️ {t.routes}</h3>
        <div className="routes-grid">
          {optimizedRoutes.map(route => (
            <div key={route.id} className="route-card">
              <div className="route-header">
                <h4>{route.name}</h4>
                <div className="route-meta">
                  <span className="duration">{route.duration}</span>
                  <span className="difficulty">{route.difficulty}</span>
                  <span className="type">{route.type}</span>
                </div>
              </div>

              <div className="route-shrines">
                <h5>主要神社:</h5>
                {route.shrines.map((shrine, index) => (
                  <div key={index} className="shrine-stop">
                    <span className="shrine-name">{shrine.name}</span>
                    <span className="cultural-points">+{shrine.culturalPoints}pt</span>
                    <p className="shrine-highlight">{shrine.highlight}</p>
                  </div>
                ))}
              </div>

              <div className="route-costs">
                <h5>予算目安:</h5>
                <div className="cost-options">
                  <span className="budget">エコノミー: ¥{route.totalCost?.budget.toLocaleString()}</span>
                  <span className="standard">スタンダード: ¥{route.totalCost?.standard.toLocaleString()}</span>
                  <span className="luxury">ラグジュアリー: ¥{route.totalCost?.luxury.toLocaleString()}</span>
                </div>
              </div>

              <div className="cultural-learning">
                <h5>学習テーマ:</h5>
                <ul>
                  {route.culturalLearning?.map((theme, index) => (
                    <li key={index}>{theme}</li>
                  ))}
                </ul>
              </div>

              <button className="select-route-btn">
                このルートを選択
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 文化遺産保護状況 */}
      <div className="heritage-preservation">
        <h3>🏛️ {t.heritage}</h3>
        <div className="heritage-grid">
          {culturalHeritage.map(heritage => (
            <div key={heritage.id} className="heritage-card">
              <div className="heritage-header">
                <h4>{heritage.name}</h4>
                <span className="heritage-type">{heritage.type}</span>
              </div>

              <div className="heritage-info">
                <p><strong>登録年:</strong> {heritage.registrationYear}</p>
                <p><strong>重要性:</strong> {heritage.significance}</p>
                <p><strong>保存状態:</strong> 
                  <span className={`status ${heritage.conservationStatus === '良好' ? 'good' : 'concerning'}`}>
                    {heritage.conservationStatus}
                  </span>
                </p>
              </div>

              <div className="preservation-efforts">
                <h5>保護活動:</h5>
                <ul>
                  {heritage.preservationEfforts.map((effort, index) => (
                    <li key={index}>{effort}</li>
                  ))}
                </ul>
              </div>

              <div className="digital-preservation">
                <h5>デジタル保存:</h5>
                <div className="preservation-status">
                  <div className="status-item">
                    <span className="status-label">3Dスキャン:</span>
                    <span className="status-value">{heritage.digitalPreservation['3dScanning']}</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">VR体験:</span>
                    <span className="status-value">{heritage.digitalPreservation.vrExperience}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 地域別分析 */}
      <div className="regional-insights">
        <h3>📊 地域別観光分析</h3>
        
        <div className="popularity-trends">
          <h4>人気上昇エリア</h4>
          <div className="trends-list">
            {regionalInsights.popularityTrends?.rising.map((trend, index) => (
              <div key={index} className="trend-item rising">
                <span className="trend-name">{trend.name}</span>
                <span className="trend-growth">+{trend.growth.replace('+', '')}</span>
                <span className="trend-reason">{trend.reason}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sustainability-metrics">
          <h4>持続可能性指標</h4>
          <div className="metrics-grid">
            <div className="metric-category">
              <h5>環境影響</h5>
              <ul>
                <li>炭素排出量: {regionalInsights.sustainabilityMetrics?.environmentalImpact.carbonFootprint}</li>
                <li>廃棄物削減: {regionalInsights.sustainabilityMetrics?.environmentalImpact.wasteReduction}</li>
                <li>エネルギー効率: {regionalInsights.sustainabilityMetrics?.environmentalImpact.energyEfficiency}</li>
              </ul>
            </div>
            <div className="metric-category">
              <h5>社会的影響</h5>
              <ul>
                <li>地域雇用: {regionalInsights.sustainabilityMetrics?.socialImpact.localEmployment}</li>
                <li>地域住民満足度: {regionalInsights.sustainabilityMetrics?.socialImpact.communityInvolvement}</li>
                <li>文化教育参加: {regionalInsights.sustainabilityMetrics?.socialImpact.culturalEducation}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 政府向けレポート生成 */}
      <div className="government-collaboration">
        <h3>🏛️ 政府連携機能</h3>
        <div className="collaboration-tools">
          <button 
            className="generate-report-btn"
            onClick={() => {
              const report = generateGovernmentReport();
              console.log('Government Report Generated:', report);
            }}
          >
            📊 政府向けレポート生成
          </button>
          <button className="cultural-policy-btn">
            📋 文化政策提案書作成
          </button>
          <button className="international-data-btn">
            🌐 国際機関向けデータ提供
          </button>
        </div>

        <div className="policy-recommendations">
          <h4>政策提言</h4>
          <ul>
            <li>🏗️ 地方神社デジタルインフラ整備予算の確保</li>
            <li>🌍 多言語対応システムの全国展開</li>
            <li>🤝 地域経済循環促進のための税制優遇</li>
            <li>📚 文化教育プログラムの義務教育への組み込み</li>
            <li>🔬 AI・IoT技術活用による文化遺産保護高度化</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TourismIntegration;