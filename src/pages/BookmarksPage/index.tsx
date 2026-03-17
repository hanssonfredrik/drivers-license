import { useState } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useStudySession } from '@/hooks/useStudySession';
import { QuestionCard } from '@/components/question/QuestionCard';
import { Explanation } from '@/components/question/Explanation';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';

function EmptyBookmarks() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <span className="text-5xl">☆</span>
      <h2 className="text-xl font-semibold text-gray-800">Inga bokmärken ännu</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        Bokmärk svåra frågor under instuderingen så hittar du dem här.
      </p>
    </div>
  );
}

interface StudyBookmarksProps {
  questionIds: string[];
  onToggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

function StudyBookmarks({ questionIds, onToggleBookmark, isBookmarked }: StudyBookmarksProps) {
  const { state, answer, next } = useStudySession('bookmarked', questionIds);

  if (state.phase === 'loading') {
    return <div className="py-10 text-center text-gray-500">Laddar bokmärkta frågor…</div>;
  }

  if (state.phase === 'error') {
    return <div className="py-10 text-center text-red-600">{state.message}</div>;
  }

  if (state.phase === 'complete') {
    return (
      <Card className="text-center space-y-3">
        <div className="text-4xl">🎉</div>
        <h2 className="text-xl font-bold">Klar med bokmärkta frågor!</h2>
        <p className="text-gray-600">
          {state.summary.correct} av {state.summary.total} rätt
        </p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Börja om
        </Button>
      </Card>
    );
  }

  const { question, index, total, phase } = state;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between text-sm text-gray-500">
          <span>{index} av {total}</span>
        </div>
        <ProgressBar value={index - 1} max={total} color="brand" />
      </div>

      <QuestionCard
        question={question}
        selectedIndex={phase === 'answered' ? state.selectedIndex : null}
        isAnswered={phase === 'answered'}
        onAnswer={(i) => void answer(i)}
        isBookmarked={isBookmarked(question.id)}
        onToggleBookmark={() => onToggleBookmark(question.id)}
      />

      {phase === 'answered' && (
        <>
          <Explanation
            text={question.explanation}
            isCorrect={state.isCorrect}
          />
          <Button variant="primary" fullWidth onClick={next}>
            Nästa fråga →
          </Button>
        </>
      )}
    </div>
  );
}

export default function BookmarksPage() {
  const { bookmarkedIds, isBookmarked, toggle, loaded } = useBookmarks();
  const [studying, setStudying] = useState(false);

  const ids = Array.from(bookmarkedIds);

  if (!loaded) {
    return <div className="py-10 text-center text-gray-500">Laddar…</div>;
  }

  if (ids.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Bokmärken</h1>
        <EmptyBookmarks />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bokmärken</h1>
        <span className="text-sm text-gray-500">{ids.length} frågor</span>
      </div>

      {!studying ? (
        <div className="space-y-3">
          <Card>
            <p className="text-sm text-gray-700 mb-3">
              Du har bokmärkt {ids.length} frågor. Studera dem för att bli bättre på det du haft svårt för.
            </p>
            <Button variant="primary" fullWidth onClick={() => setStudying(true)}>
              Öva bokmärkta frågor
            </Button>
          </Card>
        </div>
      ) : (
        <>
          <button
            onClick={() => setStudying(false)}
            className="text-sm text-brand-600 hover:text-brand-800"
            type="button"
          >
            ← Tillbaka till bokmärken
          </button>
          <StudyBookmarks
            questionIds={ids}
            onToggleBookmark={(id) => void toggle(id)}
            isBookmarked={isBookmarked}
          />
        </>
      )}
    </div>
  );
}
