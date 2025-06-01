class NotificationService {
  constructor() {
    this.permission = this.checkPermission();
    this.scheduled = this.loadScheduled();
  }

  checkPermission() {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  }

  loadScheduled() {
    try {
      const stored = localStorage.getItem('scheduled_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load scheduled notifications:', error);
      return [];
    }
  }

  saveScheduled() {
    try {
      localStorage.setItem('scheduled_notifications', JSON.stringify(this.scheduled));
    } catch (error) {
      console.error('Failed to save scheduled notifications:', error);
    }
  }

  async requestPermission() {
    if (this.permission === 'unsupported') {
      console.warn('Notifications not supported');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const result = await Notification.requestPermission();
      this.permission = result;
      return result === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  async scheduleVisitReminder(userId, nextVisitTime) {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return false;
    }

    // Calculate reminder times
    const reminderTimes = [
      new Date(nextVisitTime.getTime() - 60 * 60 * 1000), // 1 hour before
      new Date(nextVisitTime.getTime()), // At the time
      new Date(nextVisitTime.getTime() + 30 * 60 * 1000) // 30 minutes after
    ];

    const notifications = reminderTimes.map((time, index) => ({
      id: `reminder_${userId}_${time.getTime()}_${index}`,
      userId,
      type: 'visit_reminder',
      scheduledFor: time.toISOString(),
      title: this.getReminderTitle(index),
      body: this.getReminderBody(index),
      icon: '/icons/shrine-icon.png',
      badge: '/icons/shrine-badge.png',
      tag: `visit_reminder_${userId}`,
      requireInteraction: index === 1, // Make the main reminder sticky
      data: {
        userId,
        reminderType: ['early', 'main', 'late'][index],
        url: '/#visit'
      }
    }));

    // Add to scheduled list
    this.scheduled.push(...notifications);
    this.saveScheduled();

    // Set up actual notifications (in a real app, this would use service workers)
    notifications.forEach(notification => {
      const delay = new Date(notification.scheduledFor) - new Date();
      if (delay > 0) {
        setTimeout(() => {
          this.showNotification(notification);
        }, delay);
      }
    });

    return true;
  }

  getReminderTitle(index) {
    const titles = [
      '🌅 朝の参拝まであと1時間',
      '⛩️ 参拝の時間です',
      '🌸 まだ間に合います'
    ];
    return titles[index];
  }

  getReminderBody(index) {
    const bodies = [
      '連続記録を続けましょう！今日も素晴らしい一日に。',
      'タップして今すぐ参拝。今日の御朱印が待っています。',
      '今日の参拝を逃さないで。連続記録を守りましょう！'
    ];
    return bodies[index];
  }

  async showNotification(notificationData) {
    if (this.permission !== 'granted') return;

    try {
      const notification = new Notification(notificationData.title, {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        tag: notificationData.tag,
        requireInteraction: notificationData.requireInteraction,
        data: notificationData.data
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = notificationData.data.url;
        notification.close();
      };

      // Remove from scheduled
      this.scheduled = this.scheduled.filter(n => n.id !== notificationData.id);
      this.saveScheduled();

    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  async sendRewardNotification(reward) {
    if (this.permission !== 'granted') return;

    let title = '🎉 報酬を獲得！';
    let body = '';

    if (reward.rewards.some(r => r.rarity === 'legendary')) {
      title = '🌟 レジェンド御朱印を獲得！！';
      body = '非常に貴重な御朱印です。おめでとうございます！';
    } else if (reward.rewards.some(r => r.type === 'prayer_card')) {
      title = '🎴 祈願カードを獲得！';
      const card = reward.rewards.find(r => r.type === 'prayer_card');
      body = `「${card.name}」を手に入れました`;
    } else {
      const goshuin = reward.rewards.find(r => r.type === 'goshuin');
      body = `${goshuin.shrineName}の御朱印を受け取りました`;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: '/icons/reward-icon.png',
        tag: 'reward_notification',
        requireInteraction: false
      });

      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.error('Failed to show reward notification:', error);
    }
  }

  async sendStreakNotification(streak) {
    if (this.permission !== 'granted') return;

    const milestones = [3, 7, 14, 30, 100];
    if (!milestones.includes(streak)) return;

    const titles = {
      3: '🔥 3日連続達成！',
      7: '🌟 1週間連続達成！',
      14: '💫 2週間連続達成！',
      30: '🏆 1ヶ月連続達成！',
      100: '👑 100日連続達成！'
    };

    try {
      const notification = new Notification(titles[streak], {
        body: '素晴らしい達成です！この調子で続けましょう。',
        icon: '/icons/streak-icon.png',
        tag: 'streak_notification',
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Failed to show streak notification:', error);
    }
  }

  clearScheduledReminders(userId) {
    this.scheduled = this.scheduled.filter(n => n.userId !== userId);
    this.saveScheduled();
  }

  getNextReminder(userId) {
    const userReminders = this.scheduled
      .filter(n => n.userId === userId && n.type === 'visit_reminder')
      .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));
    
    return userReminders[0] || null;
  }

  // Debug helper
  async testNotification() {
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) {
        console.log('Notification permission denied');
        return;
      }
    }

    this.showNotification({
      title: '⛩️ テスト通知',
      body: '通知が正常に動作しています',
      icon: '/icons/shrine-icon.png',
      tag: 'test_notification',
      requireInteraction: false,
      data: { url: '/' }
    });
  }
}

export default new NotificationService();