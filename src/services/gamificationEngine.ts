import { storage } from './storage';
import { progressTracker } from './progressTracker';
import type { GamificationState, Badge, GamificationEvent } from '@/types/gamification';

const BADGES_DATA: Badge[] = [];

const DEFAULT_STATE: GamificationState = {
  totalXp: 0,
  level: 0,
  earnedBadgeIds: [],
  streakDays: 0,
  longestStreakDays: 0,
  lastActivityDate: null,
};

function calcLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100));
}

async function getOrCreateState(): Promise<GamificationState> {
  const stored = await storage.getGamificationState();
  return stored ?? { ...DEFAULT_STATE };
}

export const gamificationEngine = {
  async getState(): Promise<GamificationState> {
    return getOrCreateState();
  },

  async getAllBadges(): Promise<Badge[]> {
    if (BADGES_DATA.length === 0) {
      try {
        const mod = await import('@/data/gamification/badges.json');
        BADGES_DATA.push(...(mod.default as Badge[]));
      } catch {
        // badges.json not yet populated
      }
    }
    return BADGES_DATA;
  },

  async recordCorrectAnswer(
    _source: 'study' | 'quiz',
    isCorrect: boolean,
  ): Promise<GamificationEvent[]> {
    const state = await getOrCreateState();
    const events: GamificationEvent[] = [];

    if (!isCorrect) {
      await storage.saveGamificationState(state);
      return events;
    }

    const xpAmount = _source === 'study' ? 10 : 5;
    const newTotal = state.totalXp + xpAmount;
    const oldLevel = state.level;
    const newLevel = calcLevel(newTotal);

    events.push({ type: 'xp-earned', amount: xpAmount, newTotal });

    const newState: GamificationState = { ...state, totalXp: newTotal, level: newLevel };

    if (newLevel > oldLevel) {
      events.push({ type: 'level-up', newLevel });
    }

    await storage.saveGamificationState(newState);

    // Badge checks
    const badgeEvents = await gamificationEngine.checkBadges(newState);
    events.push(...badgeEvents);

    return events;
  },

  async recordQuizPassed(): Promise<GamificationEvent[]> {
    const state = await getOrCreateState();
    const events: GamificationEvent[] = [];

    const xpAmount = 50;
    const newTotal = state.totalXp + xpAmount;
    const oldLevel = state.level;
    const newLevel = calcLevel(newTotal);

    events.push({ type: 'xp-earned', amount: xpAmount, newTotal });

    const newState: GamificationState = { ...state, totalXp: newTotal, level: newLevel };

    if (newLevel > oldLevel) {
      events.push({ type: 'level-up', newLevel });
    }

    await storage.saveGamificationState(newState);

    const badgeEvents = await gamificationEngine.checkBadges(newState);
    events.push(...badgeEvents);

    return events;
  },

  async updateStreak(): Promise<GamificationEvent[]> {
    const state = await getOrCreateState();
    const events: GamificationEvent[] = [];
    const today = new Date().toISOString().slice(0, 10);

    if (state.lastActivityDate === today) return events;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const isConsecutive = state.lastActivityDate === yesterdayStr;
    const newStreak = isConsecutive ? state.streakDays + 1 : 1;
    const newLongest = Math.max(state.longestStreakDays, newStreak);

    const milestones = [3, 7, 14, 30, 60, 100];
    if (milestones.includes(newStreak)) {
      events.push({ type: 'streak-milestone', days: newStreak });
    }

    const newState: GamificationState = {
      ...state,
      streakDays: newStreak,
      longestStreakDays: newLongest,
      lastActivityDate: today,
    };

    await storage.saveGamificationState(newState);

    const badgeEvents = await gamificationEngine.checkBadges(newState);
    events.push(...badgeEvents);

    return events;
  },

  async checkBadges(state: GamificationState): Promise<GamificationEvent[]> {
    const badges = await gamificationEngine.getAllBadges();
    const events: GamificationEvent[] = [];

    // Lazily load progress counts only if any badge needs them
    const needsCounts = badges.some(
      (b) =>
        !state.earnedBadgeIds.includes(b.id) &&
        (b.condition.type === 'total-answers' || b.condition.type === 'quiz-passed'),
    );

    let totalAnswered = 0;
    let quizPassedCount = 0;

    if (needsCounts) {
      try {
        const progress = await progressTracker.getProgress();
        totalAnswered = progress.totalAnswered;
        quizPassedCount = progress.quizHistory.filter((h) => h.passed).length;
      } catch {
        // best-effort
      }
    }

    for (const badge of badges) {
      if (state.earnedBadgeIds.includes(badge.id)) continue;

      const { condition } = badge;
      let earned = false;

      if (condition.type === 'streak' && state.streakDays >= condition.days) {
        earned = true;
      } else if (condition.type === 'level-reached' && state.level >= condition.level) {
        earned = true;
      } else if (condition.type === 'total-answers' && totalAnswered >= condition.count) {
        earned = true;
      } else if (condition.type === 'quiz-passed' && quizPassedCount >= condition.count) {
        earned = true;
      }

      if (earned) {
        state.earnedBadgeIds = [...state.earnedBadgeIds, badge.id];
        events.push({ type: 'badge-earned', badge });
      }
    }

    if (events.length > 0) {
      await storage.saveGamificationState(state);
    }

    return events;
  },
};
