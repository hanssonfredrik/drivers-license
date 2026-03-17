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
        <div className="text-6xl mb-4">{passed ? '🎉' : '💪'}</div>
        <div
          className={clsx(
            'inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold mb-4 border',
            passed
              ? 'bg-success-500/10 text-success-400 border-success-500/30'
              : 'bg-danger-500/10 text-danger-400 border-danger-500/30',
          )}
        >
          {passed ? '✓ Godkänd' : '✗ Underkänd'}
        </div>
        <div className="text-5xl font-bold text-white mb-1">
          {score} <span className="text-2xl text-gray-500">/ {total}</span>
        </div>
        <p className="text-gray-400 text-sm">{pct}% rätt · Gräns 52 rätt</p>
      </div>

      {/* Category breakdown */}
      {session.categoryScores && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Resultat per ämne</h3>
          <div className="flex flex-col gap-2.5">
            {(Object.entries(session.categoryScores) as [CategoryId, { correct: number; total: number }][]).map(
              ([cat, scores]) => {
                const catPct = scores.total > 0 ? Math.round((scores.correct / scores.total) * 100) : 0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-40 flex-shrink-0">
                      {CATEGORY_LABELS[cat]}
                    </span>
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={clsx(
                          'h-full rounded-full transition-all',
                          catPct >= 80
                            ? 'bg-gradient-to-r from-success-600 to-success-400'
                            : catPct >= 60
                              ? 'bg-gradient-to-r from-warning-600 to-warning-400'
                              : 'bg-gradient-to-r from-danger-600 to-danger-400',
                        )}
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-14 text-right font-mono">
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
        className="w-full py-3 px-4 bg-white/5 border border-brand-500/30 text-brand-300 font-semibold rounded-xl hover:bg-brand-500/10 hover:border-brand-500/50 transition-all"
      >
        📋 Granska alla svar
      </button>
    </div>
  );
}
