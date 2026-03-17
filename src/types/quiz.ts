import type { CategoryId, QuizAnswer } from './question';

export type QuizStatus = 'in-progress' | 'completed' | 'timed-out';

export interface QuizSession {
  id: string;
  startedAt: string;
  completedAt: string | null;
  status: QuizStatus;
  answers: QuizAnswer[];
  totalQuestions: 65;
  score: number | null;
  passed: boolean | null;
  categoryScores: Record<CategoryId, { correct: number; total: number }> | null;
  timeRemainingMs: number;
}
