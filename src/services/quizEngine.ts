import { questionBank } from './questionBank';
import { storage } from './storage';
import type { QuizSession } from '@/types/quiz';
import type { QuizAnswer } from '@/types/question';
import { QUIZ_WEIGHTS } from '@/types/question';
import type { CategoryId } from '@/types/question';

const QUIZ_DURATION_MS = 50 * 60 * 1000; // 50 minutes

function generateId(): string {
  return `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function buildEmptyScores(): QuizSession['categoryScores'] {
  const categories: CategoryId[] = [
    'trafikregler',
    'trafiksakerhet',
    'fordonskannedom',
    'miljo',
    'personliga',
  ];
  return Object.fromEntries(
    categories.map((cat) => [cat, { correct: 0, total: 0 }]),
  ) as QuizSession['categoryScores'];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const quizEngine = {
  async generateQuiz(): Promise<QuizSession> {
    // Load all categories in parallel
    const categories = Object.entries(QUIZ_WEIGHTS) as [CategoryId, number][];
    const categoryQuestions = await Promise.all(
      categories.map(async ([cat, count]) => {
        const questions = await questionBank.getByCategory(cat);
        const shuffled = shuffle(questions);
        return shuffled.slice(0, count);
      }),
    );

    const allSelected = shuffle(categoryQuestions.flat());

    const answers: QuizAnswer[] = allSelected.map((q) => ({
      questionId: q.id,
      selectedIndex: null,
      isCorrect: null,
    }));

    const session: QuizSession = {
      id: generateId(),
      startedAt: new Date().toISOString(),
      completedAt: null,
      status: 'in-progress',
      answers,
      totalQuestions: allSelected.length,
      score: null,
      passed: null,
      categoryScores: null,
      timeRemainingMs: QUIZ_DURATION_MS,
    };

    await storage.saveQuizSession(session);
    return session;
  },

  async recordAnswer(
    sessionId: string,
    questionId: string,
    selectedIndex: number,
  ): Promise<void> {
    const session = await storage.getQuizSession(sessionId);
    if (!session || session.status !== 'in-progress') return;

    const updated = {
      ...session,
      answers: session.answers.map((a) =>
        a.questionId === questionId
          ? { ...a, selectedIndex: selectedIndex as 0 | 1 | 2 | 3 }
          : a,
      ),
    };
    await storage.saveQuizSession(updated);
  },

  async submitQuiz(sessionId: string): Promise<QuizSession> {
    const session = await storage.getQuizSession(sessionId);
    if (!session) throw new Error(`Quiz session ${sessionId} not found`);
    if (session.status !== 'in-progress') return session;

    // Load all questions to check correct answers
    const ids = session.answers.map((a) => a.questionId);
    const questions = await questionBank.getByIds(ids);
    const qMap = new Map(questions.map((q) => [q.id, q]));

    const categoryScores = buildEmptyScores()!;
    let score = 0;

    const scoredAnswers: QuizAnswer[] = session.answers.map((ans) => {
      const q = qMap.get(ans.questionId);
      if (!q) return ans;

      const isCorrect =
        ans.selectedIndex !== null && ans.selectedIndex === q.correctIndex;

      if (isCorrect) {
        score++;
        categoryScores[q.category].correct++;
      }
      categoryScores[q.category].total++;

      return { ...ans, isCorrect };
    });

    const completed: QuizSession = {
      ...session,
      answers: scoredAnswers,
      status: 'completed',
      completedAt: new Date().toISOString(),
      score,
      passed: score >= 52,
      categoryScores,
      timeRemainingMs: session.timeRemainingMs,
    };

    await storage.saveQuizSession(completed);
    return completed;
  },

  async timeoutQuiz(sessionId: string): Promise<QuizSession> {
    const session = await storage.getQuizSession(sessionId);
    if (!session || session.status !== 'in-progress') {
      return session ?? { id: sessionId } as QuizSession;
    }

    // Same scoring as submitQuiz but with status 'timed-out'
    const ids = session.answers.map((a) => a.questionId);
    const questions = await questionBank.getByIds(ids);
    const qMap = new Map(questions.map((q) => [q.id, q]));

    const categoryScores = buildEmptyScores()!;
    let score = 0;

    const scoredAnswers: QuizAnswer[] = session.answers.map((ans) => {
      const q = qMap.get(ans.questionId);
      if (!q) return ans;
      const isCorrect =
        ans.selectedIndex !== null && ans.selectedIndex === q.correctIndex;
      if (isCorrect) {
        score++;
        categoryScores[q.category].correct++;
      }
      categoryScores[q.category].total++;
      return { ...ans, isCorrect };
    });

    const completed: QuizSession = {
      ...session,
      answers: scoredAnswers,
      status: 'timed-out',
      completedAt: new Date().toISOString(),
      score,
      passed: score >= 52,
      categoryScores,
      timeRemainingMs: 0,
    };

    await storage.saveQuizSession(completed);
    return completed;
  },

  async getInProgressQuiz(): Promise<QuizSession | null> {
    const sessions = await storage.getQuizSessions({ status: 'in-progress' });
    return sessions[0] ?? null;
  },

  async getCompletedQuiz(sessionId: string): Promise<QuizSession | null> {
    const session = await storage.getQuizSession(sessionId);
    if (session?.status === 'in-progress') return null;
    return session;
  },
};
