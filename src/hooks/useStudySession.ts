import { useState, useEffect, useCallback } from 'react';
import type { Question, CategoryId } from '@/types/question';
import { questionBank } from '@/services/questionBank';
import { progressTracker } from '@/services/progressTracker';
import { gamificationEngine } from '@/services/gamificationEngine';
import type { GamificationEvent } from '@/types/gamification';

interface StudySummary {
  total: number;
  correct: number;
  incorrect: number;
}

type StudySessionState =
  | { phase: 'loading' }
  | { phase: 'error'; message: string }
  | { phase: 'answering'; question: Question; index: number; total: number }
  | { phase: 'answered'; question: Question; selectedIndex: number; isCorrect: boolean; index: number; total: number }
  | { phase: 'complete'; summary: StudySummary };

export function useStudySession(categoryId: CategoryId | 'bookmarked', questionIds?: string[]) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [pendingEvents, setPendingEvents] = useState<GamificationEvent[]>([]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    async function load() {
      try {
        let loaded: Question[];
        if (categoryId === 'bookmarked' && questionIds) {
          loaded = await questionBank.getByIds(questionIds);
        } else if (categoryId !== 'bookmarked') {
          loaded = await questionBank.getByCategory(categoryId);
        } else {
          loaded = [];
        }
        if (!cancelled) {
          setQuestions(loaded);
          setCurrentIndex(0);
          setSelectedIndex(null);
          setCorrect(0);
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError('Kunde inte ladda frågorna. Försök igen.');
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => { cancelled = true; };
  }, [categoryId, questionIds?.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = useCallback(
    async (index: number) => {
      if (selectedIndex !== null) return;
      const question = questions[currentIndex];
      if (!question) return;

      const isCorrect = index === question.correctIndex;
      setSelectedIndex(index);
      if (isCorrect) setCorrect((c) => c + 1);

      await progressTracker.recordStudyAnswer({
        questionId: question.id,
        category: question.category,
        selectedIndex: index as 0 | 1 | 2 | 3,
        isCorrect,
      });

      const events = await gamificationEngine.recordCorrectAnswer('study', isCorrect);
      if (events.length > 0) setPendingEvents((e) => [...e, ...events]);
    },
    [questions, currentIndex, selectedIndex],
  );

  const next = useCallback(() => {
    setSelectedIndex(null);
    setCurrentIndex((i) => i + 1);
  }, []);

  const dismissEvents = useCallback(() => setPendingEvents([]), []);

  const state: StudySessionState = (() => {
    if (isLoading) return { phase: 'loading' };
    if (error) return { phase: 'error', message: error };
    if (currentIndex >= questions.length && questions.length > 0) {
      return {
        phase: 'complete',
        summary: { total: questions.length, correct, incorrect: questions.length - correct },
      };
    }
    const question = questions[currentIndex];
    if (!question) return { phase: 'loading' };

    if (selectedIndex !== null) {
      return {
        phase: 'answered',
        question,
        selectedIndex,
        isCorrect: selectedIndex === question.correctIndex,
        index: currentIndex + 1,
        total: questions.length,
      };
    }
    return { phase: 'answering', question, index: currentIndex + 1, total: questions.length };
  })();

  return { state, answer, next, pendingEvents, dismissEvents };
}
