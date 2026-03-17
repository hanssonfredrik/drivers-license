import { clsx } from 'clsx';
import type { QuizSession } from '@/types/quiz';
import { CATEGORY_LABELS } from '@/types/question';
import type { CategoryId } from '@/types/question';

interface QuizResultProps {
  session: QuizSession;
  onReview: () => void;
}

export function QuizResult({ session, onReview }: QuizResultProps) {
  const passed = session.passed ?? false;
  const score = session.score ?? 0;
  const total = session.totalQuestions;
  const pct = Math.round((score / total) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* Result header */}
      <div className="text-center">
        <div className="text-6xl mb-3">{passed ? '🎉' : '😞'}</div>
        <div
          className={clsx(
            'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold mb-3',
            passed ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700',
          )}
        >
          {passed ? '✓ Godkänd' : '✗ Underkänd'}
        </div>
        <div className="text-4xl font-bold text-gray-900 mb-1">
          {score} <span className="text-2xl text-gray-400">/ {total}</span>
        </div>
        <p className="text-gray-500 text-sm">{pct}% rätt · Gräns 52 rätt</p>
      </div>

      {/* Category breakdown */}
      {session.categoryScores && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Resultat per ämne</h3>
          <div className="flex flex-col gap-2">
            {(Object.entries(session.categoryScores) as [CategoryId, { correct: number; total: number }][]).map(
              ([cat, scores]) => {
                const catPct = scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-40 flex-shrink-0">
                      {CATEGORY_LABELS[cat]}
                    </span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={clsx(
                          'h-full rounded-full transition-all',
                          catPct >= 80 ? 'bg-success-500' : catPct >= 60 ? 'bg-warning-500' : 'bg-danger-500',
                        )}
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-14 text-right">
                      {scores.correct}/{scores.total}
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}

      <button
        onClick={onReview}
        className="w-full py-3 px-4 bg-white border-2 border-brand-500 text-brand-700 font-semibold rounded-xl hover:bg-brand-50 transition-colors"
      >
        📋 Granska alla svar
      </button>
    </div>
  );
}
