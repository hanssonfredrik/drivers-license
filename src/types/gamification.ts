import type { CategoryId } from './question';

export interface GamificationState {
  totalXp: number;
  level: number;
  earnedBadgeIds: string[];
  streakDays: number;
  longestStreakDays: number;
  lastActivityDate: string | null;
}

export type BadgeCondition =
  | { type: 'total-answers'; count: number }
  | { type: 'quiz-passed'; count: number }
  | { type: 'streak'; days: number }
  | { type: 'category-mastery'; category: CategoryId; accuracy: number; minAnswers: number }
  | { type: 'level-reached'; level: number };

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: BadgeCondition;
}

export type GamificationEvent =
  | { type: 'xp-earned'; amount: number; newTotal: number }
  | { type: 'level-up'; newLevel: number }
  | { type: 'badge-earned'; badge: Badge }
  | { type: 'streak-milestone'; days: number };
