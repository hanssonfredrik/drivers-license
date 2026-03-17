import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { quizEngine } from '@/services/quizEngine';
import type { QuizSession } from '@/types/quiz';
import { QuizResult } from '@/components/quiz/QuizResult';
import { QuizReview } from '@/components/quiz/QuizReview';
import { Button } from '@/components/common/Button';

type View = 'result' | 'review';

export default function QuizResultPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<QuizSession | null>(
    (location.state as { session?: QuizSession } | null)?.session ?? null,
  );
  const [view, setView] = useState<View>('result');

  useEffect(() => {
    if (!session && id) {
      quizEngine.getCompletedQuiz(id).then(setSession).catch(() => setSession(null));
    }
  }, [id, session]);

  if (!session) {
    return (
      <div className="max-w-xl mx-auto px-4 py-6 text-center">
        <p className="text-gray-400 mb-4">Quiz-resultat hittades inte.</p>
        <Link to="/">
          <Button variant="secondary">Hem</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
          ← Hem
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setView('result')}
            className={`text-sm px-3 py-1 rounded-full font-medium transition-all ${
              view === 'result'
                ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                : 'text-gray-500 hover:bg-white/5'
            }`}
          >
            Resultat
          </button>
          <button
            onClick={() => setView('review')}
            className={`text-sm px-3 py-1 rounded-full font-medium transition-all ${
              view === 'review'
                ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                : 'text-gray-500 hover:bg-white/5'
            }`}
          >
            Granska
          </button>
        </div>
      </div>

      {view === 'result' ? (
        <>
          <QuizResult session={session} onReview={() => setView('review')} />
          <div className="mt-6 flex flex-col gap-2">
            <Button
              fullWidth
              onClick={() => { void navigate('/quiz'); }}
            >
              Nytt quiz
            </Button>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => { void navigate('/stats'); }}
            >
              Se statistik
            </Button>
          </div>
        </>
      ) : (
        <QuizReview session={session} />
      )}
    </div>
  );
}
