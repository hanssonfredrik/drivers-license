import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizSession } from '@/hooks/useQuizSession';
import { QuestionCard } from '@/components/question/QuestionCard';
import { QuizProgress } from '@/components/quiz/QuizProgress';
import { Timer } from '@/components/common/Timer';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

export default function QuizPage() {
  const { state, answer, submit, navigateTo } = useQuizSession();
  const navigate = useNavigate();
  const [showConfirmQuit, setShowConfirmQuit] = useState(false);

  // Navigate to result page when quiz completes (avoids calling navigate during render)
  useEffect(() => {
    if (state.phase === 'complete') {
      void navigate(`/quiz/${state.session.id}/result`, {
        replace: true,
        state: { session: state.session },
      });
    }
  }, [state, navigate]);

  if (state.phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-brand-500/30 border-t-brand-400 animate-spin" />
        <p className="text-sm text-gray-400">Förbereder quiz...</p>
      </div>
    );
  }

  if (state.phase === 'error') {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <Card>
          <p className="text-danger-400 mb-4">{state.message}</p>
          <Button onClick={() => { void navigate('/'); }} variant="secondary">
            Gå till startsidan
          </Button>
        </Card>
      </div>
    );
  }

  if (state.phase === 'submitting' || state.phase === 'complete') {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-brand-500/30 border-t-brand-400 animate-spin" />
        <p className="text-sm text-gray-400">Räknar poäng...</p>
      </div>
    );
  }

  const { session, questions, currentIndex, timeRemainingMs } = state;
  const currentQuestion = questions[currentIndex];
  const answeredCount = session.answers.filter((a) => a.selectedIndex !== null).length;

  if (!currentQuestion) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-4">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirmQuit(true)}
        >
          ✕ Avsluta
        </Button>
        <Timer
          initialMs={timeRemainingMs}
          onTimeout={() => void submit()}
          paused={showConfirmQuit}
        />
      </div>

      {/* Progress */}
      <div className="mb-4">
        <QuizProgress
          current={currentIndex + 1}
          total={session.totalQuestions}
          answeredCount={answeredCount}
        />
      </div>

      {/* Question — no feedback in quiz mode */}
      <Card className="mb-4">
        <QuestionCard
          question={currentQuestion}
          selectedIndex={session.answers[currentIndex]?.selectedIndex ?? null}
          isAnswered={false}
          onAnswer={(i) => void answer(i)}
          questionNumber={currentIndex + 1}
          totalQuestions={session.totalQuestions}
        />
      </Card>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentIndex === 0}
          onClick={() => navigateTo(currentIndex - 1)}
          className="flex-1"
        >
          ← Föregående
        </Button>
        {currentIndex < session.totalQuestions - 1 ? (
          <Button
            size="sm"
            onClick={() => navigateTo(currentIndex + 1)}
            className="flex-1"
          >
            Nästa →
          </Button>
        ) : (
          <Button
            variant="success"
            size="sm"
            onClick={() => void submit()}
            className="flex-1"
          >
            Lämna in ✓
          </Button>
        )}
      </div>

      {/* Confirm quit dialog */}
      {showConfirmQuit && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm text-center py-6">
            <p className="text-base font-semibold text-white mb-2">Avsluta quiz?</p>
            <p className="text-sm text-gray-400 mb-6">
              Dina svar sparas och du kan se resultatet. Du kan inte återuppta detta quiz.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowConfirmQuit(false)}
              >
                Fortsätt
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => void submit()}
              >
                Lämna in
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
