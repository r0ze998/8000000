import { GOSHUIN_RARITIES, PRAYER_CARDS, REWARD_MULTIPLIERS } from '../constants/rewards';
import { SHRINES } from '../constants/shrines';

class RewardService {
  constructor() {
    this.rewards = this.loadRewards();
    this.inventory = this.loadInventory();
  }

  loadRewards() {
    try {
      const stored = localStorage.getItem('shrine_rewards');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load rewards:', error);
      return [];
    }
  }

  loadInventory() {
    try {
      const stored = localStorage.getItem('user_inventory');
      return stored ? JSON.parse(stored) : {
        goshuin: [],
        prayerCards: [],
        badges: [],
        titles: []
      };
    } catch (error) {
      console.error('Failed to load inventory:', error);
      return { goshuin: [], prayerCards: [], badges: [], titles: [] };
    }
  }

  saveRewards() {
    try {
      localStorage.setItem('shrine_rewards', JSON.stringify(this.rewards));
    } catch (error) {
      console.error('Failed to save rewards:', error);
    }
  }

  saveInventory() {
    try {
      localStorage.setItem('user_inventory', JSON.stringify(this.inventory));
    } catch (error) {
      console.error('Failed to save inventory:', error);
    }
  }

  async generateVariableReward({ visit, streak, totalVisits }) {
    const multiplier = this.calculateMultiplier(visit, streak);
    const rewards = [];

    // Always give a base goshuin
    const goshuin = this.generateGoshuin(visit, multiplier);
    rewards.push(goshuin);

    // Chance for prayer card based on streak
    if (this.rollForPrayerCard(streak, multiplier)) {
      const prayerCard = this.generatePrayerCard(visit);
      rewards.push(prayerCard);
    }

    // Special rewards for milestones
    const specialRewards = this.checkSpecialRewards(visit, streak, totalVisits);
    rewards.push(...specialRewards);

    // Save all rewards
    const rewardRecord = {
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      visitId: visit.id,
      userId: visit.userId,
      timestamp: new Date().toISOString(),
      rewards,
      multiplier
    };

    this.rewards.push(rewardRecord);
    this.saveRewards();

    // Add to inventory
    rewards.forEach(reward => {
      if (reward.type === 'goshuin') {
        this.inventory.goshuin.push(reward);
      } else if (reward.type === 'prayer_card') {
        this.inventory.prayerCards.push(reward);
      } else if (reward.type === 'badge') {
        this.inventory.badges.push(reward);
      } else if (reward.type === 'title') {
        this.inventory.titles.push(reward);
      }
    });
    this.saveInventory();

    return rewardRecord;
  }

  calculateMultiplier(visit, streak) {
    let multiplier = 1.0;

    // Streak bonus
    if (streak >= 7) multiplier *= REWARD_MULTIPLIERS.STREAK_7_DAYS;
    else if (streak >= 3) multiplier *= REWARD_MULTIPLIERS.STREAK_3_DAYS;

    // Time of day bonus
    if (visit.timeOfDay === 'dawn') {
      multiplier *= REWARD_MULTIPLIERS.DAWN_VISIT;
    } else if (visit.timeOfDay === 'dusk') {
      multiplier *= REWARD_MULTIPLIERS.DUSK_VISIT;
    }

    // Weather bonus
    if (visit.weather === 'rainy') {
      multiplier *= REWARD_MULTIPLIERS.RAINY_DAY;
    } else if (visit.weather === 'snowy') {
      multiplier *= REWARD_MULTIPLIERS.SNOWY_DAY;
    }

    // Full moon bonus
    if (visit.moonPhase === 'full') {
      multiplier *= REWARD_MULTIPLIERS.FULL_MOON;
    }

    // Perfect visit (all conditions met)
    if (multiplier >= 2.0) {
      multiplier *= REWARD_MULTIPLIERS.PERFECT_VISIT;
    }

    return Math.min(multiplier, 5.0); // Cap at 5x
  }

  generateGoshuin(visit, multiplier) {
    const shrine = SHRINES[visit.shrineId];
    const rarityRoll = Math.random() * multiplier;
    
    let rarity = 'common';
    if (rarityRoll > 2.5) {
      rarity = 'legendary';
    } else if (rarityRoll > 1.8) {
      rarity = 'epic';
    } else if (rarityRoll > 1.2) {
      rarity = 'rare';
    } else if (rarityRoll > 0.6) {
      rarity = 'uncommon';
    }

    const rarityData = GOSHUIN_RARITIES[rarity];
    
    // Special seasonal variant
    let variant = 'standard';
    if (visit.season === 'spring' && Math.random() < 0.3) variant = 'sakura';
    else if (visit.season === 'autumn' && Math.random() < 0.3) variant = 'momiji';
    else if (visit.moonPhase === 'full' && Math.random() < 0.2) variant = 'moon';

    return {
      type: 'goshuin',
      id: `goshuin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      shrineId: visit.shrineId,
      shrineName: shrine.name,
      rarity,
      variant,
      design: this.generateGoshuinDesign(shrine, rarity, variant, visit),
      timestamp: visit.timestamp,
      blessing: this.generateBlessing(shrine, rarity),
      nftMetadata: {
        name: `${shrine.name} Goshuin - ${rarityData.name}`,
        description: `A ${rarityData.name} goshuin received at ${shrine.name} on ${new Date(visit.timestamp).toLocaleDateString()}`,
        attributes: [
          { trait_type: 'Shrine', value: shrine.name },
          { trait_type: 'Rarity', value: rarityData.name },
          { trait_type: 'Variant', value: variant },
          { trait_type: 'Season', value: visit.season },
          { trait_type: 'Time', value: visit.timeOfDay },
          { trait_type: 'Weather', value: visit.weather },
          { trait_type: 'Moon Phase', value: visit.moonPhase }
        ]
      }
    };
  }

  generateGoshuinDesign(shrine, rarity, variant, visit) {
    // This would generate actual visual data for the goshuin
    // For now, returning design parameters
    return {
      background: this.getBackgroundStyle(rarity, variant),
      stamp: shrine.symbol,
      calligraphy: shrine.blessing,
      date: new Date(visit.timestamp).toLocaleDateString('ja-JP'),
      specialEffects: this.getSpecialEffects(rarity, variant, visit)
    };
  }

  getBackgroundStyle(rarity, variant) {
    const styles = {
      common: { color: '#FFF8DC', pattern: 'none' },
      uncommon: { color: '#E6E6FA', pattern: 'waves' },
      rare: { color: '#FFE4B5', pattern: 'clouds' },
      epic: { color: '#F0E68C', pattern: 'dragons' },
      legendary: { color: '#FFD700', pattern: 'phoenix' }
    };

    const style = styles[rarity];
    
    if (variant === 'sakura') {
      style.overlay = 'cherry_blossoms';
    } else if (variant === 'momiji') {
      style.overlay = 'maple_leaves';
    } else if (variant === 'moon') {
      style.overlay = 'moon_glow';
    }

    return style;
  }

  getSpecialEffects(rarity, variant, visit) {
    const effects = [];
    
    if (rarity === 'legendary') {
      effects.push('golden_shimmer');
    } else if (rarity === 'epic') {
      effects.push('silver_gleam');
    }

    if (variant === 'moon' && visit.moonPhase === 'full') {
      effects.push('moonlight_aura');
    }

    if (visit.weather === 'snowy') {
      effects.push('snow_particles');
    }

    return effects;
  }

  generateBlessing(shrine, rarity) {
    const blessings = {
      common: shrine.blessing,
      uncommon: `${shrine.blessing} - 特別な祝福`,
      rare: `${shrine.blessing} - ${shrine.guardianDeity}の加護`,
      epic: `${shrine.blessing} - 神聖なる守護`,
      legendary: `${shrine.blessing} - 永遠の恩恵`
    };

    return blessings[rarity];
  }

  rollForPrayerCard(streak, multiplier) {
    const baseChance = 0.1; // 10% base chance
    const streakBonus = Math.min(streak * 0.02, 0.3); // +2% per day, max 30%
    const totalChance = (baseChance + streakBonus) * multiplier;
    
    return Math.random() < totalChance;
  }

  generatePrayerCard(visit) {
    const cards = Object.values(PRAYER_CARDS);
    const weights = cards.map(card => 1 / card.rarity);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    
    let random = Math.random() * totalWeight;
    let selectedCard = null;
    
    for (let i = 0; i < cards.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedCard = cards[i];
        break;
      }
    }

    return {
      type: 'prayer_card',
      id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cardId: selectedCard.id,
      name: selectedCard.name,
      description: selectedCard.description,
      effect: selectedCard.effect,
      rarity: selectedCard.rarity,
      element: selectedCard.element,
      power: selectedCard.power,
      receivedAt: visit.shrineId,
      timestamp: visit.timestamp
    };
  }

  checkSpecialRewards(visit, streak, totalVisits) {
    const rewards = [];

    // First visit badge
    if (totalVisits === 1) {
      rewards.push({
        type: 'badge',
        id: 'badge_first_visit',
        name: '初詣',
        description: 'Your first shrine visit',
        icon: '🌅'
      });
    }

    // Streak badges
    const streakBadges = {
      3: { name: '三日参り', icon: '📿' },
      7: { name: '週間達成', icon: '🗓️' },
      30: { name: '月間達成', icon: '🌙' },
      100: { name: '百日参り', icon: '💯' }
    };

    if (streakBadges[streak]) {
      rewards.push({
        type: 'badge',
        id: `badge_streak_${streak}`,
        name: streakBadges[streak].name,
        description: `${streak} day visit streak`,
        icon: streakBadges[streak].icon
      });
    }

    // Seasonal titles
    if (visit.season === 'spring' && totalVisits % 10 === 0) {
      rewards.push({
        type: 'title',
        id: 'title_spring_visitor',
        name: '桜の巡礼者',
        description: 'Spring shrine visitor'
      });
    }

    // Perfect condition bonus
    if (visit.timeOfDay === 'dawn' && visit.weather === 'clear' && visit.moonPhase === 'full') {
      rewards.push({
        type: 'special',
        id: 'bonus_perfect_conditions',
        name: '完璧な瞬間',
        description: 'Visit under perfect conditions',
        bonusPoints: 1000
      });
    }

    return rewards;
  }

  getInventoryStats(userId) {
    const userRewards = this.rewards.filter(r => r.userId === userId);
    const goshuinByRarity = {};
    
    Object.keys(GOSHUIN_RARITIES).forEach(rarity => {
      goshuinByRarity[rarity] = this.inventory.goshuin.filter(g => g.rarity === rarity).length;
    });

    return {
      totalRewards: userRewards.length,
      totalGoshuin: this.inventory.goshuin.length,
      goshuinByRarity,
      totalPrayerCards: this.inventory.prayerCards.length,
      uniquePrayerCards: new Set(this.inventory.prayerCards.map(c => c.cardId)).size,
      totalBadges: this.inventory.badges.length,
      totalTitles: this.inventory.titles.length
    };
  }

  getRecentRewards(userId, limit = 10) {
    return this.rewards
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
}

export default new RewardService();