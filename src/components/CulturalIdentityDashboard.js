import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CulturalIdentityDashboard.module.css';

const CulturalIdentityDashboard = ({ userAddress, culturalData, onNavigate }) => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedStory, setSelectedStory] = useState(null);
  
  // Calculate user's cultural journey progression
  const journeyData = useMemo(() => {
    if (!culturalData) return null;
    
    const { visits, nfts, sbts, poaps, culturalScore } = culturalData;
    
    return {
      // Phase 1: Action (行動)
      action: {
        totalVisits: visits?.length || 0,
        currentStreak: visits?.[0]?.streakCount || 0,
        omamoriNFTs: nfts?.filter(nft => nft.type === 'omamori')?.length || 0,
        progress: Math.min((visits?.length || 0) / 100, 1), // 100 visits = 100%
        status: getActionStatus(visits?.length || 0)
      },
      
      // Phase 2: Memory (記憶)
      memory: {
        shinkaiNFTs: nfts?.filter(nft => nft.type === 'shinkai')?.length || 0,
        specialMoments: nfts?.filter(nft => nft.rarity >= 'rare')?.length || 0,
        stories: nfts?.filter(nft => nft.story)?.length || 0,
        progress: Math.min((nfts?.filter(nft => nft.type === 'shinkai')?.length || 0) / 10, 1),
        status: getMemoryStatus(nfts?.filter(nft => nft.type === 'shinkai')?.length || 0)
      },
      
      // Phase 3: Social Role (社会的役割)
      socialRole: {
        sbtRoles: sbts?.length || 0,
        kannushiStatus: sbts?.some(sbt => sbt.roleType === 'kannushi'),
        densetsuStatus: sbts?.some(sbt => sbt.roleType === 'densetsu'),
        governanceWeight: sbts?.reduce((sum, sbt) => sum + (sbt.governanceWeight || 0), 0) || 0,
        progress: Math.min((sbts?.length || 0) / 3, 1), // Max 3 major roles
        status: getSocialRoleStatus(sbts?.length || 0)
      },
      
      // Phase 4: Community Impact (コミュニティ影響)
      community: {
        eventsOrganized: poaps?.filter(poap => poap.contributionLevel === 'organizer')?.length || 0,
        eventsAttended: poaps?.length || 0,
        shrinesManaged: sbts?.filter(sbt => sbt.roleType === 'kannushi')?.length || 0,
        culturalContribution: culturalScore || 0,
        progress: Math.min((culturalScore || 0) / 50000, 1), // 50k score = 100%
        status: getCommunityStatus(culturalScore || 0)
      }
    };
  }, [culturalData]);
  
  function getActionStatus(visits) {
    if (visits >= 365) return { level: 'Master', color: '#FF6B35', icon: '🌟' };
    if (visits >= 100) return { level: 'Adept', color: '#4A90E2', icon: '⭐' };
    if (visits >= 30) return { level: 'Practitioner', color: '#7ED321', icon: '🌱' };
    if (visits >= 7) return { level: 'Beginner', color: '#F5A623', icon: '🔰' };
    return { level: 'Newcomer', color: '#9B9B9B', icon: '👶' };
  }
  
  function getMemoryStatus(shinkaiCount) {
    if (shinkaiCount >= 20) return { level: 'Storyteller', color: '#9013FE', icon: '📚' };
    if (shinkaiCount >= 10) return { level: 'Chronicler', color: '#673AB7', icon: '📖' };
    if (shinkaiCount >= 5) return { level: 'Keeper', color: '#3F51B5', icon: '📜' };
    if (shinkaiCount >= 1) return { level: 'Collector', color: '#2196F3', icon: '🗂️' };
    return { level: 'Observer', color: '#9B9B9B', icon: '👁️' };
  }
  
  function getSocialRoleStatus(sbtCount) {
    if (sbtCount >= 3) return { level: 'Elder', color: '#E91E63', icon: '👑' };
    if (sbtCount >= 2) return { level: 'Leader', color: '#FF5722', icon: '🎖️' };
    if (sbtCount >= 1) return { level: 'Guardian', color: '#FF9800', icon: '🛡️' };
    return { level: 'Member', color: '#9B9B9B', icon: '👤' };
  }
  
  function getCommunityStatus(score) {
    if (score >= 50000) return { level: 'Cultural Pioneer', color: '#FFD700', icon: '🏆' };
    if (score >= 20000) return { level: 'Community Builder', color: '#FF6B35', icon: '🏗️' };
    if (score >= 10000) return { level: 'Active Contributor', color: '#4A90E2', icon: '🤝' };
    if (score >= 5000) return { level: 'Supporter', color: '#7ED321', icon: '💪' };
    return { level: 'Participant', color: '#9B9B9B', icon: '🙋' };
  }
  
  const renderOverview = () => (
    <div className={styles.culturalOverview}>
      <div className={styles.identityHeader}>
        <div className={styles.userAvatar}>
          <div className={styles.avatarRing} style={{ background: `conic-gradient(${journeyData.action.status.color} ${journeyData.action.progress * 100}%, #f0f0f0 0%)` }}>
            <div className={styles.avatarInner}>
              {journeyData.socialRole.status.icon}
            </div>
          </div>
        </div>
        <div className={styles.identitySummary}>
          <h2 className={styles.userTitle}>
            {journeyData.socialRole.kannushiStatus ? '神主' : 
             journeyData.socialRole.densetsuStatus ? '伝説' : 
             journeyData.socialRole.status.level}
          </h2>
          <div className={styles.culturalScore}>
            <span className={styles.scoreValue}>{journeyData.community.culturalContribution.toLocaleString()}</span>
            <span className={styles.scoreLabel}>文化貢献度</span>
          </div>
        </div>
      </div>
      
      <div className={styles.journeyPhases}>
        {[
          { key: 'action', title: '行動', subtitle: '日々の参拝', data: journeyData.action },
          { key: 'memory', title: '記憶', subtitle: '特別な瞬間', data: journeyData.memory },
          { key: 'socialRole', title: '社会的役割', subtitle: '文化継承', data: journeyData.socialRole },
          { key: 'community', title: 'コミュニティ', subtitle: '共同体への影響', data: journeyData.community }
        ].map((phase, index) => (
          <motion.div
            key={phase.key}
            className={styles.journeyPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setActiveView(phase.key)}
          >
            <div className={styles.phaseIcon} style={{ color: phase.data.status.color }}>
              {phase.data.status.icon}
            </div>
            <div className={styles.phaseContent}>
              <h3 className={styles.phaseTitle}>{phase.title}</h3>
              <p className={styles.phaseSubtitle}>{phase.subtitle}</p>
              <div className={styles.phaseStatus}>
                <span className={styles.statusLevel} style={{ color: phase.data.status.color }}>
                  {phase.data.status.level}
                </span>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ 
                      width: `${phase.data.progress * 100}%`,
                      background: phase.data.status.color 
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={styles.phaseArrow}>→</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
  
  const renderActionView = () => (
    <div className={styles.actionDetailView}>
      <div className={styles.sectionHeader}>
        <h2>🚶 行動の記録</h2>
        <p>毎日の参拝が文化的価値を創造します</p>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.primary}`}>
          <div className={styles.statIcon}>⛩️</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{journeyData.action.totalVisits}</div>
            <div className={styles.statLabel}>総参拝回数</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔥</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{journeyData.action.currentStreak}</div>
            <div className={styles.statLabel}>連続記録</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📿</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{journeyData.action.omamoriNFTs}</div>
            <div className={styles.statLabel}>お守りNFT</div>
          </div>
        </div>
      </div>
      
      <div className={styles.achievementPath}>
        <h3>達成への道のり</h3>
        <div className={styles.milestones}>
          {[
            { visits: 7, label: '一週間継続', achieved: journeyData.action.totalVisits >= 7 },
            { visits: 30, label: '一ヶ月継続', achieved: journeyData.action.totalVisits >= 30 },
            { visits: 100, label: '百日参り', achieved: journeyData.action.totalVisits >= 100 },
            { visits: 365, label: '一年継続', achieved: journeyData.action.totalVisits >= 365 },
          ].map((milestone, index) => (
            <div 
              key={index}
              className={`${styles.milestone} ${milestone.achieved ? styles.achieved : styles.pending}`}
            >
              <div className={styles.milestoneMarker}>
                {milestone.achieved ? '✅' : '⭕'}
              </div>
              <div className={styles.milestoneContent}>
                <div className={styles.milestoneVisits}>{milestone.visits}回</div>
                <div className={styles.milestoneLabel}>{milestone.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderMemoryView = () => (
    <div className={styles.memoryDetailView}>
      <div className={styles.sectionHeader}>
        <h2>💭 記憶の結晶化</h2>
        <p>特別な瞬間が永遠の思い出となります</p>
      </div>
      
      <div className={styles.memoryCollection}>
        {culturalData?.nfts?.filter(nft => nft.type === 'shinkai').map((nft, index) => (
          <motion.div
            key={nft.id}
            className={styles.memoryCard}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedStory(nft)}
          >
            <div className={styles.memoryImage}>
              <img src={nft.imageUrl || '/images/default-shinkai.jpg'} alt={nft.name} />
              <div className={styles.rarityBadge} data-rarity={nft.rarity}>
                {nft.rarity === 'legendary' ? '🌟' : 
                 nft.rarity === 'epic' ? '⭐' : 
                 nft.rarity === 'rare' ? '✨' : '💫'}
              </div>
            </div>
            <div className={styles.memoryContent}>
              <h4 className={styles.memoryTitle}>{nft.name}</h4>
              <p className={styles.memoryDate}>{new Date(nft.createdAt).toLocaleDateString()}</p>
              {nft.story && (
                <p className={styles.memoryStoryPreview}>
                  {nft.story.substring(0, 80)}...
                </p>
              )}
            </div>
          </motion.div>
        ))}
        
        {journeyData.memory.shinkaiNFTs === 0 && (
          <div className={styles.emptyMemoryState}>
            <div className={styles.emptyIcon}>📖</div>
            <h3>特別な瞬間を待っています</h3>
            <p>継続的な参拝で特別なNFTを獲得しましょう</p>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderSocialRoleView = () => (
    <div className={styles.socialRoleDetailView}>
      <div className={styles.sectionHeader}>
        <h2>👥 社会的役割</h2>
        <p>コミュニティでの地位と責任</p>
      </div>
      
      <div className={styles.roleProgression}>
        {culturalData?.sbts?.map((sbt, index) => (
          <div key={sbt.id} className={styles.roleCard}>
            <div className={styles.roleIcon}>
              {sbt.roleType === 'kannushi' ? '🏛️' : 
               sbt.roleType === 'densetsu' ? '📚' : '👤'}
            </div>
            <div className={styles.roleContent}>
              <h3 className={styles.roleTitle}>
                {sbt.roleType === 'kannushi' ? '神主' : 
                 sbt.roleType === 'densetsu' ? '伝説継承者' : sbt.roleType}
              </h3>
              <p className={styles.roleShrine}>{sbt.shrineName || '全体'}</p>
              <div className={styles.roleStats}>
                <div className={styles.roleStat}>
                  <span className={styles.statLabel}>ガバナンス重み</span>
                  <span className={styles.statValue}>{sbt.governanceWeight}</span>
                </div>
                <div className={styles.roleStat}>
                  <span className={styles.statLabel}>取得日</span>
                  <span className={styles.statValue}>{new Date(sbt.grantedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        )) || (
          <div className={styles.noRolesState}>
            <div className={styles.emptyIcon}>🏗️</div>
            <h3>役割を築いていこう</h3>
            <p>継続的な貢献でコミュニティでの役割を獲得</p>
            <div className={styles.roleRequirements}>
              <h4>神主になるには:</h4>
              <ul>
                <li>300回以上の参拝記録</li>
                <li>文化貢献度 10,000以上</li>
                <li>コミュニティ推薦</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderCommunityView = () => (
    <div className={styles.communityDetailView}>
      <div className={styles.sectionHeader}>
        <h2>🌸 コミュニティへの影響</h2>
        <p>共同体への貢献と文化創造</p>
      </div>
      
      <div className={styles.impactMetrics}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>🎪</div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{journeyData.community.eventsOrganized}</div>
            <div className={styles.metricLabel}>主催イベント</div>
          </div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>🎭</div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{journeyData.community.eventsAttended}</div>
            <div className={styles.metricLabel}>参加イベント</div>
          </div>
        </div>
        
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>⛩️</div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{journeyData.community.shrinesManaged}</div>
            <div className={styles.metricLabel}>管理神社</div>
          </div>
        </div>
      </div>
      
      <div className={styles.culturalImpactChart}>
        <h3>文化的影響力の成長</h3>
        <div className={styles.impactVisualization}>
          {/* Simple visualization of cultural growth */}
          <div className={styles.growthLine}>
            <div 
              className={styles.growthProgress} 
              style={{ width: `${journeyData.community.progress * 100}%` }}
            />
          </div>
          <div className={styles.growthMilestones}>
            {[0, 25, 50, 75, 100].map(milestone => (
              <div 
                key={milestone}
                className={`${styles.growthMilestone} ${journeyData.community.progress * 100 >= milestone ? styles.reached : ''}`}
                style={{ left: `${milestone}%` }}
              >
                <div className={styles.milestoneDot} />
                <div className={styles.milestoneLabel}>{milestone}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!journeyData) {
    return <div className={styles.loadingCulturalIdentity}>文化的アイデンティティを読み込み中...</div>;
  }
  
  return (
    <div className={styles.culturalIdentityDashboard}>
      <div className={styles.dashboardHeader}>
        <button 
          className={styles.backButton}
          onClick={() => onNavigate?.('profile')}
        >
          ← プロフィールに戻る
        </button>
        <h1>文化的アイデンティティ</h1>
      </div>
      
      <div className={styles.viewTabs}>
        {[
          { key: 'overview', label: '概要', icon: '🏛️' },
          { key: 'action', label: '行動', icon: '🚶' },
          { key: 'memory', label: '記憶', icon: '💭' },
          { key: 'socialRole', label: '役割', icon: '👥' },
          { key: 'community', label: 'コミュニティ', icon: '🌸' }
        ].map(tab => (
          <button
            key={tab.key}
            className={`${styles.viewTab} ${activeView === tab.key ? styles.active : ''}`}
            onClick={() => setActiveView(tab.key)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className={styles.dashboardContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'overview' && renderOverview()}
            {activeView === 'action' && renderActionView()}
            {activeView === 'memory' && renderMemoryView()}
            {activeView === 'socialRole' && renderSocialRoleView()}
            {activeView === 'community' && renderCommunityView()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Story Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            className={styles.storyModalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              className={styles.storyModal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                className={styles.closeStory}
                onClick={() => setSelectedStory(null)}
              >
                ✕
              </button>
              <div className={styles.storyContent}>
                <img src={selectedStory.imageUrl} alt={selectedStory.name} />
                <h3>{selectedStory.name}</h3>
                <p className={styles.storyDate}>
                  {new Date(selectedStory.createdAt).toLocaleDateString()}
                </p>
                <div className={styles.storyText}>
                  {selectedStory.story}
                </div>
                <div className={styles.storyMetadata}>
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>希少度:</span>
                    <span className={styles.value}>{selectedStory.rarity}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <span className={styles.label}>文化的価値:</span>
                    <span className={styles.value}>{selectedStory.culturalValue}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CulturalIdentityDashboard;