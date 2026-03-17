import { useState, useEffect, useCallback, useRef } from 'react';
import { quizEngine } from '@/services/quizEngine';
import { gamificationEngine } from '@/services/gamificationEngine';
import { questionBank } from '@/services/questionBank';
import type { QuizSession } from '@/types/quiz';
import type { Question } from '@/types/question';
import type { GamificationEvent } from '@/types/gamification';

type QuizSessionState =
  | { phase: 'loading' }
  | { phase: 'error'; message: string }
  | {
      phase: 'active';
      session: QuizSession;
      questions: Question[];
      currentIndex: number;
      timeRemainingMs: number;
    }
  | { phase: 'submitting' }
  | { phase: 'complete'; session: QuizSession };

/** Orders questions to match the order in session.answers so indices align. */
function alignQuestions(questions: Question[], session: QuizSession): Question[] {
  const byId = new Map(questions.map((q) => [q.id, q]));
  return session.answers
    .map((a) => byId.get(a.questionId))
    .filter((q): q is Question => q !== undefined);
}

export function useQuizSession() {
  const [state, setState] = useState<QuizSessionState>({ phase: 'loading' });
  const [pendingEvents, setPendingEvents] = useState<GamificationEvent[]>([]);
  const timerRef = useRef<number | null>(null);
  const sessionRef = useRef<QuizSession | null>(null);

  const startTimer = useCallback((ms: number, sessionId: string) => {
    if (timerRef.current) clearInterval(timerRef.current);

    let remaining = ms;
    timerRef.current = setInterval(() => {
      remaining -= 1000;
      setState((prev) => {
        if (prev.phase !== 'active') return prev;
        return { ...prev, timeRemainingMs: remaining };
      });
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        void quizEngine.timeoutQuiz(sessionId).then((completed) => {
          setState({ phase: 'complete', session: completed });
        });
      }
    }, 1000) as unknown as number;
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const existing = await quizEngine.getInProgressQuiz();
        if (cancelled) return;

        if (existing) {
          const raw = await questionBank.getByIds(existing.answers.map((a) => a.questionId));
          const questions = alignQuestions(raw, existing);
          sessionRef.current = existing;

          const firstUnanswered = existing.answers.findIndex((a) => a.selectedIndex === null);
          if (firstUnanswered === -1) {
            // All questions already answered — auto-submit the stale session
            setState({ phase: 'submitting' });
            const completed = await quizEngine.submitQuiz(existing.id);
            if (!cancelled) {
              if (completed.passed) {
                const events = await gamificationEngine.recordQuizPassed();
                if (events.length > 0) setPendingEvents(events);
              }
              setState({ phase: 'complete', session: completed });
            }
          } else {
            setState({
              phase: 'active',
              session: existing,
              questions,
              currentIndex: firstUnanswered,
              timeRemainingMs: existing.timeRemainingMs,
            });
            startTimer(existing.timeRemainingMs, existing.id);
          }
        } else {
          const session = await quizEngine.generateQuiz();
          if (cancelled) return;
          const raw = await questionBank.getByIds(session.answers.map((a) => a.questionId));
          const questions = alignQuestions(raw, session);
          sessionRef.current = session;
          setState({
            phase: 'active',
            session,
            questions,
            currentIndex: 0,
            timeRemainingMs: session.timeRemainingMs,
          });
          startTimer(session.timeRemainingMs, session.id);
        }
      } catch {
        if (!cancelled) {
          setState({ phase: 'error', message: 'Kunde inte starta quiz. Försök igen.' });
        }
      }
    })();

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = useCallback(async (selectedIndex: number) => {
    if (state.phase !== 'active') return;
    const { session, currentIndex } = state;
    const questionId = session.answers[currentIndex]?.questionId;
    if (!questionId) return;

    await quizEngine.recordAnswer(session.id, questionId, selectedIndex);

    setState((prev) => {
      if (prev.phase !== 'active') return prev;
      const updatedAnswers = prev.session.answers.map((a, i) =>
        i === currentIndex ? { ...a, selectedIndex: selectedIndex as 0 | 1 | 2 | 3 } : a,
      );
      return {
        ...prev,
        session: { ...prev.session, answers: updatedAnswers },
        currentIndex: Math.min(currentIndex + 1, updatedAnswers.length - 1),
      };
    });
  }, [state]);

  const submit = useCallback(async () => {
    if (state.phase !== 'active') return;
    if (timerRef.current) clearInterval(timerRef.current);

    setState({ phase: 'submitting' });
    const completed = await quizEngine.submitQuiz(state.session.id);

    if (completed.passed) {
      const events = await gamificationEngine.recordQuizPassed();
      if (events.length > 0) setPendingEvents((e) => [...e, ...events]);
    }

    setState({ phase: 'complete', session: completed });
  }, [state]);

  const navigateTo = useCallback((index: number) => {
    setState((prev) => {
      if (prev.phase !== 'active') return prev;
      return { ...prev, currentIndex: index };
    });
  }, []);

  const dismissEvents = useCallback(() => setPendingEvents([]), []);

  return { state, answer, submit, navigateTo, pendingEvents, dismissEvents };
}
