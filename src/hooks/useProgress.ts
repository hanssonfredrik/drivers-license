import { useState, useEffect, useCallback } from 'react';
import { progressTracker } from '@/services/progressTracker';
import type { UserProgress } from '@/types/progress';
import type { QuizSession } from '@/types/quiz';

interface UseProgressResult {
  progress: UserProgress | null;
  quizHistory: QuizSession[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const DEFAULT_PROGRESS: UserProgress = {
  totalAnswered: 0,
  categoryAccuracy: {
    trafikregler: { correct: 0, total: 0 },
    trafiksakerhet: { correct: 0, total: 0 },
    fordonskannedom: { correct: 0, total: 0 },
    miljo: { correct: 0, total: 0 },
    personliga: { correct: 0, total: 0 },
  },
  quizHistory: [],
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
};

export function useProgress(): UseProgressResult {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [quizHistory, setQuizHistory] = useState<QuizSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([progressTracker.getProgress(), progressTracker.getQuizHistory()])
      .then(([p, qh]) => {
        if (cancelled) return;
        setProgress(p);
        setQuizHistory(qh);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setProgress(DEFAULT_PROGRESS);
        setError('Kunde inte ladda statistik.');
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [tick]);

  return { progress, quizHistory, isLoading, error, refresh };
}
