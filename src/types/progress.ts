import type { CategoryId } from './question';

export interface CategoryAccuracy {
  correct: number;
  total: number;
}

export interface QuizHistoryEntry {
  date: string;
  score: number;
  passed: boolean;
}

export interface UserProgress {
  totalAnswered: number;
  categoryAccuracy: Record<CategoryId, CategoryAccuracy>;
  quizHistory: QuizHistoryEntry[];
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}
