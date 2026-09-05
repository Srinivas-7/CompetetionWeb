import { PANDHALS_DATA } from '../data/pandhals';

const STORAGE_PREFIX = 'bappatrail_progress_';

// Level rank definitions
export const DEVOTEE_LEVELS = [
  { level: 1, title: 'Trail Seeker', minPoints: 0, maxPoints: 100, icon: '🪔', color: '#8C2222' },
  { level: 2, title: 'Bappa Bhakta', minPoints: 100, maxPoints: 250, icon: '🌸', color: '#B45309' },
  { level: 3, title: 'Gajotsava Pilgrim', minPoints: 250, maxPoints: 450, icon: '🐘', color: '#C89D47' },
  { level: 4, title: 'Trail Master', minPoints: 450, maxPoints: 700, icon: '⭐', color: '#16A34A' },
  { level: 5, title: 'Maha Parikrama Acharya', minPoints: 700, maxPoints: 1200, icon: '👑', color: '#6B1414' },
];

class ProgressService {
  constructor() {
    this.listeners = new Set();
  }

  /**
   * Subscribe to progress changes
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach((callback) => {
      try {
        callback();
      } catch (err) {
        console.warn('[ProgressService] listener error:', err);
      }
    });
  }

  /**
   * Gets raw stored data for a specific user
   */
  getRawData(uid) {
    if (!uid || typeof window === 'undefined') {
      return {
        visitedPandhalIds: [],
        checkinDates: [],
        hasShared: false,
        shareCount: 0,
        claimedBonuses: {},
      };
    }

    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${uid}`);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          visitedPandhalIds: Array.isArray(parsed.visitedPandhalIds) ? parsed.visitedPandhalIds : [],
          checkinDates: Array.isArray(parsed.checkinDates) ? parsed.checkinDates : [],
          hasShared: Boolean(parsed.hasShared),
          shareCount: typeof parsed.shareCount === 'number' ? parsed.shareCount : (parsed.hasShared ? 1 : 0),
          claimedBonuses: parsed.claimedBonuses || {},
          createdAt: parsed.createdAt || new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('[ProgressService] Failed to read localStorage:', err);
    }

    return {
      visitedPandhalIds: [],
      checkinDates: [],
      hasShared: false,
      shareCount: 0,
      claimedBonuses: {},
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Saves updated raw data for user
   */
  saveRawData(uid, data) {
    if (!uid || typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${uid}`, JSON.stringify(data));
      this.notify();
    } catch (err) {
      console.warn('[ProgressService] Failed to save to localStorage:', err);
    }
  }

  /**
   * Records a pandhal 4K photo view / darshan visit
   */
  recordPandhalVisit(uid, pandhalId) {
    if (!uid || !pandhalId) return;
    const raw = this.getRawData(uid);
    if (!raw.visitedPandhalIds.includes(pandhalId)) {
      raw.visitedPandhalIds.push(pandhalId);
      this.saveRawData(uid, raw);
    }
  }

  /**
   * Records daily check-in (once per calendar day)
   */
  recordDailyCheckin(uid) {
    if (!uid) return { success: false, message: 'Please sign in first.' };
    const raw = this.getRawData(uid);
    const today = new Date().toISOString().split('T')[0];

    if (raw.checkinDates.includes(today)) {
      return { success: false, message: "You've already claimed today's Darshan points! Come back tomorrow." };
    }

    raw.checkinDates.push(today);
    this.saveRawData(uid, raw);
    return { success: true, message: "Daily Darshan claimed! +20 Points added to your karma." };
  }

  /**
   * Records sharing action
   */
  recordShare(uid) {
    if (!uid) return { success: false, message: 'Please sign in first.' };
    const raw = this.getRawData(uid);
    raw.hasShared = true;
    raw.shareCount = (raw.shareCount || 0) + 1;
    this.saveRawData(uid, raw);
    return { success: true, message: "Thank you for spreading the trail! +30 Points added." };
  }

  /**
   * Checks if user already checked in today
   */
  isCheckedInToday(uid) {
    if (!uid) return false;
    const raw = this.getRawData(uid);
    const today = new Date().toISOString().split('T')[0];
    return raw.checkinDates.includes(today);
  }

  /**
   * Computes full progress details, total points, points ledger breakdown, and badges
   * 
   * @param {string} uid - Firebase Auth User ID
   * @param {object|null} myVote - Active vote record from Firebase
   * @returns {object} Full progress summary
   */
  computeProgress(uid, myVote = null) {
    const raw = this.getRawData(uid);
    const ledger = [];
    let totalPoints = 0;

    // 1. Google Account Onboarding Welcome Bonus
    if (uid) {
      const welcomePts = 50;
      totalPoints += welcomePts;
      ledger.push({
        id: 'welcome-bonus',
        title: 'Devotee Sign-in & Welcome Gift',
        category: 'Account',
        points: welcomePts,
        icon: '🌟',
        description: 'Verified with Google account for the Chaturthi 2026 Trail',
        timestamp: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Welcome Bonus',
        status: 'Earned'
      });
    }

    // 2. Official Community Vote
    if (myVote && myVote.pandhalId) {
      const votePts = 100;
      totalPoints += votePts;
      ledger.push({
        id: `vote-${myVote.pandhalId}`,
        title: `Sacred Vote Locked: ${myVote.pandhalName}`,
        category: 'Sacred Voting',
        points: votePts,
        icon: '🗳️',
        description: `Cast verified community ballot for ${myVote.pandhalName}`,
        timestamp: myVote.votedAt ? (new Date(myVote.votedAt?.seconds ? myVote.votedAt.seconds * 1000 : myVote.votedAt)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Active Ballot',
        status: 'Earned'
      });
    }

    // 3. Unique Pandhal Darshans (10 pts each)
    const visitedList = raw.visitedPandhalIds || [];
    visitedList.forEach((pid) => {
      const pandhal = PANDHALS_DATA.find((p) => p.id === pid);
      const name = pandhal ? pandhal.name : `Pandhal #${pid}`;
      const darshanPts = 10;
      totalPoints += darshanPts;
      ledger.push({
        id: `darshan-${pid}`,
        title: `4K Darshan & Exploration: ${name}`,
        category: 'Darshan',
        points: darshanPts,
        icon: '🛕',
        description: `Viewed high-resolution photos, themes & artisan stories`,
        timestamp: 'Darshan Completed',
        status: 'Earned'
      });
    });

    // 4. Daily Darshan Check-ins (20 pts each)
    const checkins = raw.checkinDates || [];
    checkins.forEach((dateStr, idx) => {
      const checkinPts = 20;
      totalPoints += checkinPts;
      ledger.push({
        id: `checkin-${dateStr}`,
        title: `Daily Darshan Check-in (Day ${idx + 1})`,
        category: 'Daily Quest',
        points: checkinPts,
        icon: '🪔',
        description: `Attended daily festival darshan on ${dateStr}`,
        timestamp: dateStr,
        status: 'Earned'
      });
    });

    // 5. Spread the Trail / Community Share (30 pts)
    if (raw.hasShared) {
      const sharePts = 30;
      totalPoints += sharePts;
      ledger.push({
        id: 'trail-share',
        title: 'Community Bappa Trail Share',
        category: 'Social Blessing',
        points: sharePts,
        icon: '🤝',
        description: 'Shared the official Chaturthi 2026 Trail with devotees',
        timestamp: 'Shared Bonus',
        status: 'Earned'
      });
    }

    // 6. Milestones & Achievements
    const visitedCount = visitedList.length;

    // Milestone: First Darshan (1+ pandhals)
    const hasFirstDarshan = visitedCount >= 1;
    if (hasFirstDarshan) {
      const pts = 25;
      totalPoints += pts;
      ledger.push({
        id: 'milestone-first-darshan',
        title: 'Milestone: First Darshan Badge',
        category: 'Milestone',
        points: pts,
        icon: '🥉',
        description: 'Began the sacred pilgrimage by exploring your 1st Pandhal',
        timestamp: 'Unlocked',
        status: 'Earned'
      });
    }

    // Milestone: Eco Pilgrim (5+ pandhals)
    const hasEcoPilgrim = visitedCount >= 5;
    if (hasEcoPilgrim) {
      const pts = 50;
      totalPoints += pts;
      ledger.push({
        id: 'milestone-eco-pilgrim',
        title: 'Milestone: Eco Pilgrim Badge',
        category: 'Milestone',
        points: pts,
        icon: '🥈',
        description: 'Explored 5 or more pandhals across the city',
        timestamp: 'Unlocked',
        status: 'Earned'
      });
    }

    // Milestone: Trail Master (10+ pandhals)
    const hasTrailMaster = visitedCount >= 10;
    if (hasTrailMaster) {
      const pts = 100;
      totalPoints += pts;
      ledger.push({
        id: 'milestone-trail-master',
        title: 'Milestone: Trail Master Badge',
        category: 'Milestone',
        points: pts,
        icon: '🥇',
        description: 'Explored 10 or more pandhals across the city',
        timestamp: 'Unlocked',
        status: 'Earned'
      });
    }

    // Milestone: Maha Parikrama (all 21 pandhals)
    const hasMahaParikrama = visitedCount >= PANDHALS_DATA.length;
    if (hasMahaParikrama) {
      const pts = 250;
      totalPoints += pts;
      ledger.push({
        id: 'milestone-maha-parikrama',
        title: 'Milestone: 21-Pandhal Maha Parikrama',
        category: 'Milestone',
        points: pts,
        icon: '👑',
        description: 'Completed darshan at all 21 grand pandhals of the city!',
        timestamp: 'Unlocked',
        status: 'Earned'
      });
    }

    // Milestone: Sacred Voter Bonus (50 pts)
    const hasVoted = Boolean(myVote && myVote.pandhalId);
    if (hasVoted) {
      const pts = 50;
      totalPoints += pts;
      ledger.push({
        id: 'milestone-sacred-voter',
        title: 'Milestone: Verified Devotee Voter',
        category: 'Milestone',
        points: pts,
        icon: '🛡️',
        description: 'Locked your official vote and supported your favorite Mandal',
        timestamp: 'Unlocked',
        status: 'Earned'
      });
    }

    // Compute Level
    let currentLevel = DEVOTEE_LEVELS[0];
    let nextLevel = DEVOTEE_LEVELS[1];

    for (let i = DEVOTEE_LEVELS.length - 1; i >= 0; i--) {
      if (totalPoints >= DEVOTEE_LEVELS[i].minPoints) {
        currentLevel = DEVOTEE_LEVELS[i];
        nextLevel = DEVOTEE_LEVELS[i + 1] || null;
        break;
      }
    }

    const levelMin = currentLevel.minPoints;
    const levelMax = nextLevel ? nextLevel.minPoints : currentLevel.maxPoints;
    const progressInLevel = totalPoints - levelMin;
    const rangeInLevel = levelMax - levelMin;
    const progressPercent = nextLevel 
      ? Math.min(100, Math.max(0, Math.round((progressInLevel / rangeInLevel) * 100))) 
      : 100;

    // Badges array
    const badges = [
      {
        id: 'badge-welcome',
        name: 'Devotee Initiate',
        icon: '🌟',
        unlocked: Boolean(uid),
        description: 'Joined the official 2026 Trail with Google account',
        reward: '+50 pts'
      },
      {
        id: 'badge-vote',
        name: 'Sacred Voter',
        icon: '🗳️',
        unlocked: hasVoted,
        description: 'Cast verified community vote for a pandhal',
        reward: '+150 pts total'
      },
      {
        id: 'badge-first-darshan',
        name: 'First Darshan',
        icon: '🪔',
        unlocked: hasFirstDarshan,
        description: 'Explored your first 4K Pandhal Gallery',
        reward: '+35 pts total'
      },
      {
        id: 'badge-eco-pilgrim',
        name: 'Eco Pilgrim',
        icon: '🌱',
        unlocked: hasEcoPilgrim,
        description: `Explored 5 pandhals (${Math.min(5, visitedCount)}/5)`,
        reward: '+50 pts bonus'
      },
      {
        id: 'badge-trail-master',
        name: 'Trail Explorer',
        icon: '🧭',
        unlocked: hasTrailMaster,
        description: `Explored 10 pandhals (${Math.min(10, visitedCount)}/10)`,
        reward: '+100 pts bonus'
      },
      {
        id: 'badge-share',
        name: 'Trail Ambassador',
        icon: '🤝',
        unlocked: Boolean(raw.hasShared),
        description: 'Shared the Bappa Trail with family & friends',
        reward: '+30 pts'
      },
      {
        id: 'badge-maha-parikrama',
        name: 'Maha Parikrama',
        icon: '👑',
        unlocked: hasMahaParikrama,
        description: `Completed darshan at all 21 Pandhals (${visitedCount}/21)`,
        reward: '+250 pts bonus'
      }
    ];

    return {
      totalPoints,
      currentLevel,
      nextLevel,
      progressPercent,
      pointsToNextLevel: nextLevel ? Math.max(0, nextLevel.minPoints - totalPoints) : 0,
      visitedCount,
      visitedPandhalIds: visitedList,
      totalPandhals: PANDHALS_DATA.length,
      hasVoted,
      votedPandhalName: myVote?.pandhalName || null,
      isCheckedInToday: this.isCheckedInToday(uid),
      checkinCount: checkins.length,
      hasShared: Boolean(raw.hasShared),
      ledger: ledger.reverse(), // most recent / highest priority first
      badges
    };
  }
}

export const progressService = new ProgressService();
