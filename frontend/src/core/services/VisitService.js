import { SHRINES } from '../constants/shrines';

class VisitService {
  constructor() {
    this.visits = this.loadVisits();
  }

  loadVisits() {
    try {
      const stored = localStorage.getItem('shrine_visits');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load visits:', error);
      return [];
    }
  }

  saveVisits() {
    try {
      localStorage.setItem('shrine_visits', JSON.stringify(this.visits));
    } catch (error) {
      console.error('Failed to save visits:', error);
    }
  }

  async recordVisit({ shrineId, userId, location, verificationMethod }) {
    const shrine = SHRINES[shrineId];
    if (!shrine) {
      throw new Error('Invalid shrine ID');
    }

    // Verify location if using GPS
    if (verificationMethod === 'location' && location) {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        shrine.location.lat,
        shrine.location.lng
      );
      
      if (distance > 100) { // 100 meters threshold
        throw new Error('Too far from shrine');
      }
    }

    const visit = {
      id: `visit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      shrineId,
      userId,
      timestamp: new Date().toISOString(),
      verificationMethod,
      location: location ? {
        lat: location.latitude,
        lng: location.longitude
      } : null,
      season: this.getCurrentSeason(),
      timeOfDay: this.getTimeOfDay(),
      weather: await this.getWeather(location),
      moonPhase: this.getMoonPhase()
    };

    this.visits.push(visit);
    this.saveVisits();

    // Update streak
    const streak = this.calculateStreak(userId);
    
    // Check for milestones
    const milestones = this.checkMilestones(userId, this.visits.length);

    return {
      visit,
      streak,
      milestones,
      totalVisits: this.visits.filter(v => v.userId === userId).length
    };
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  calculateStreak(userId) {
    const userVisits = this.visits
      .filter(v => v.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (userVisits.length === 0) return 0;

    let streak = 1;
    let currentDate = new Date(userVisits[0].timestamp);
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 1; i < userVisits.length; i++) {
      const visitDate = new Date(userVisits[i].timestamp);
      visitDate.setHours(0, 0, 0, 0);
      
      const dayDiff = Math.floor((currentDate - visitDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
        currentDate = visitDate;
      } else if (dayDiff > 1) {
        break;
      }
    }

    return streak;
  }

  getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'dusk';
    return 'night';
  }

  getMoonPhase() {
    // Simplified moon phase calculation
    const lunations = 29.53058867;
    const newMoon = new Date('2000-01-06T18:14:00Z');
    const daysSinceNew = (Date.now() - newMoon.getTime()) / (1000 * 60 * 60 * 24);
    const phase = (daysSinceNew % lunations) / lunations;
    
    if (phase < 0.0625) return 'new';
    if (phase < 0.1875) return 'waxing_crescent';
    if (phase < 0.3125) return 'first_quarter';
    if (phase < 0.4375) return 'waxing_gibbous';
    if (phase < 0.5625) return 'full';
    if (phase < 0.6875) return 'waning_gibbous';
    if (phase < 0.8125) return 'last_quarter';
    if (phase < 0.9375) return 'waning_crescent';
    return 'new';
  }

  async getWeather(location) {
    // Placeholder - would integrate with weather API
    const conditions = ['clear', 'cloudy', 'rainy', 'snowy', 'foggy'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  checkMilestones(userId, totalVisits) {
    const milestones = [];
    const milestoneThresholds = [1, 7, 30, 100, 365, 1000];
    
    for (const threshold of milestoneThresholds) {
      if (totalVisits === threshold) {
        milestones.push({
          type: 'total_visits',
          value: threshold,
          unlocked: true
        });
      }
    }

    const streak = this.calculateStreak(userId);
    const streakThresholds = [3, 7, 14, 30, 100];
    
    for (const threshold of streakThresholds) {
      if (streak === threshold) {
        milestones.push({
          type: 'streak',
          value: threshold,
          unlocked: true
        });
      }
    }

    return milestones;
  }

  getVisitHistory(userId, limit = 50) {
    return this.visits
      .filter(v => v.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  getLastVisit(userId) {
    const userVisits = this.visits
      .filter(v => v.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return userVisits[0] || null;
  }

  getTodayVisit(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.visits.find(v => 
      v.userId === userId &&
      new Date(v.timestamp) >= today &&
      new Date(v.timestamp) < tomorrow
    );
  }
}

export default new VisitService();