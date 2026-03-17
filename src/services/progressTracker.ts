import { storage } from './storage';
import type { StudyAnswer, CategoryId } from '@/types/question';
import type { UserProgress, CategoryAccuracy } from '@/types/progress';

const CATEGORIES: CategoryId[] = [
  'trafikregler',
  'trafiksakerhet',
  'fordonskannedom',
  'miljo',
  'personliga',
];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function calcStreak(dates: string[]): { current: number; longest: number } {
  if (dates.length === 0) return { current: 0, longest: 0 };

  const sortedUnique = [...new Set(dates.filter(Boolean))].sort().reverse();
  const today = todayIso();

  let current = 0;
  let longest = 0;
  let streak = 0;
  let expected = today;

  for (const date of sortedUnique) {
    if (date === expected) {
      streak++;
      const d = new Date(expected);
      d.setDate(d.getDate() - 1);
      expected = d.toISOString().slice(0, 10);
    } else if (date < expected) {
      if (current === 0) current = streak;
      streak = 1;
      const d = new Date(date);
      d.setDate(d.getDate() - 1);
      expected = d.toISOString().slice(0, 10);
    }
    if (streak > longest) longest = streak;
  }
  if (current === 0) current = streak;

  return { current, longest };
}

export const progressTracker = {
  async recordStudyAnswer(answer: Omit<StudyAnswer, 'answeredAt'>): Promise<void> {
    await storage.addStudyAnswer({
      ...answer,
      answeredAt: new Date().toISOString(),
    });
  },

  async getProgress(): Promise<UserProgress> {
    const [studyAnswers, quizSessions] = await Promise.all([
      storage.getStudyAnswers(),
      storage.getQuizSessions(),
    ]);

    const categoryAccuracy = Object.fromEntries(
      CATEGORIES.map((cat) => {
        const catAnswers = studyAnswers.filter((a) => a.category === cat);
        const correct = catAnswers.filter((a) => a.isCorrect).length;
        return [cat, { correct, total: catAnswers.length } as CategoryAccuracy];
      }),
    ) as Record<CategoryId, CategoryAccuracy>;

    const completedQuizzes = quizSessions
      .filter((s) => s.status === 'completed' || s.status === 'timed-out')
      .sort((a, b) => a.startedAt.localeCompare(b.startedAt));

    const quizHistory = completedQuizzes.map((s) => ({
      date: s.startedAt,
      score: s.score ?? 0,
      passed: s.passed ?? false,
    }));

    const activityDates = studyAnswers
      .map((a) => a.answeredAt.slice(0, 10))
      .concat(completedQuizzes.map((s) => s.startedAt.slice(0, 10)));

    const { current: currentStreak, longest: longestStreak } = calcStreak(activityDates);

    const lastActiveDate =
      activityDates.length > 0 ? activityDates.sort().reverse()[0] : null;

    return {
      totalAnswered: studyAnswers.length,
      categoryAccuracy,
      quizHistory,
      currentStreak,
      longestStreak,
      lastActiveDate,
    };
  },

  async getQuizHistory() {
    const sessions = await storage.getQuizSessions();
    return sessions
      .filter((s) => s.status === 'completed' || s.status === 'timed-out')
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  },

  async getTodayAnswerCount(): Promise<number> {
    const today = todayIso();
    const answers = await storage.getStudyAnswers({ since: today + 'T00:00:00.000Z' });
    return answers.length;
  },
};
