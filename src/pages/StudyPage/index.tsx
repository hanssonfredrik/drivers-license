import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStudySession } from '@/hooks/useStudySession';
import { useBookmarks } from '@/hooks/useBookmarks';
import { QuestionCard } from '@/components/question/QuestionCard';
import { Explanation } from '@/components/question/Explanation';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { CATEGORY_LABELS } from '@/types/question';
import type { CategoryId } from '@/types/question';

const CATEGORIES: CategoryId[] = [
  'trafikregler',
  'trafiksakerhet',
  'fordonskannedom',
  'miljo',
  'personliga',
];

function CategorySelector() {
  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <Link to="/" className="text-sm text-brand-600 hover:underline mb-4 inline-block">
        ← Hem
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Välj ämne</h1>
      <p className="text-sm text-gray-500 mb-6">Studera frågor inom ett specifikt ämnesområde</p>
      <div className="flex flex-col gap-2">
        {CATEGORIES.map((id) => (
          <Link key={id} to={`/study/${id}`}>
            <Card
              shadow={false}
              className="flex items-center gap-3 hover:border-brand-300 hover:bg-brand-50 transition-all cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-800">{CATEGORY_LABELS[id]}</span>
              <span className="ml-auto text-gray-400">→</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function StudyPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const categoryId = CATEGORIES.includes(category as CategoryId)
    ? (category as CategoryId)
    : null;

  const { state, answer, next } = useStudySession(categoryId ?? 'trafikregler');
  const { isBookmarked, toggle } = useBookmarks();

  if (!categoryId) return <CategorySelector />;

  if (state.phase === 'loading') {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (state.phase === 'error') {
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <p className="text-danger-600">{state.message}</p>
        <Button onClick={() => { void navigate(-1); }} variant="secondary" className="mt-4">
          Gå tillbaka
        </Button>
      </div>
    );
  }

  if (state.phase === 'complete') {
    const pct = Math.round((state.summary.correct / state.summary.total) * 100);
    return (
      <div className="max-w-xl mx-auto px-4 py-6">
        <Card className="text-center">
          <div className="text-5xl mb-3">{pct >= 80 ? '🎉' : '📚'}</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Instudering klar!</h2>
          <p className="text-gray-500 mb-4">{CATEGORY_LABELS[categoryId]}</p>
          <div className="text-3xl font-bold text-brand-700 mb-1">{pct}%</div>
          <p className="text-sm text-gray-500 mb-6">
            {state.summary.correct} rätt av {state.summary.total}
          </p>
          <div className="flex flex-col gap-2">
            <Button fullWidth onClick={() => { void navigate(0); }}>
              Studera igen
            </Button>
            <Button fullWidth variant="secondary" onClick={() => { void navigate('/study'); }}>
              Välj annat ämne
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const question = state.phase === 'answering' ? state.question : state.question;
  const isAnswered = state.phase === 'answered';

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <Link to="/study" className="text-sm text-brand-600 hover:underline">
          ← Ämnen
        </Link>
        <span className="text-sm font-medium text-gray-500">{CATEGORY_LABELS[categoryId]}</span>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar
          value={'index' in state ? state.index : 0}
          max={'total' in state ? state.total : 1}
          color="brand"
          size="sm"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          {'index' in state && 'total' in state ? `${state.index} / ${state.total}` : ''}
        </p>
      </div>

      {/* Question */}
      <Card className="mb-4">
        <QuestionCard
          question={question}
          selectedIndex={'selectedIndex' in state ? state.selectedIndex : null}
          isAnswered={isAnswered}
          onAnswer={(i) => void answer(i)}
          isBookmarked={isBookmarked(question.id)}
          onToggleBookmark={() => void toggle(question.id)}
        />
      </Card>

      {/* Explanation */}
      {isAnswered && state.phase === 'answered' && (
        <div className="mb-4 animate-slide-up">
          <Explanation text={question.explanation} isCorrect={state.isCorrect} />
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <Button fullWidth onClick={next} className="animate-fade-in">
          {'index' in state && 'total' in state && state.index >= state.total ? 'Visa resultat' : 'Nästa fråga →'}
        </Button>
      )}
    </div>
  );
}
