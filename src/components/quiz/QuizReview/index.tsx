import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import type { QuizSession } from '@/types/quiz';
import type { Question } from '@/types/question';
import { questionBank } from '@/services/questionBank';
import { Card } from '@/components/common/Card';

interface QuizReviewProps {
  session: QuizSession;
}

export function QuizReview({ session }: QuizReviewProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = session.answers.map((a) => a.questionId);
    questionBank.getByIds(ids).then((qs) => {
      setQuestions(qs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-6 h-6 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const qMap = new Map(questions.map((q) => [q.id, q]));
  const OPTION_LABELS = ['A', 'B', 'C', 'D'];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-500">
        {session.answers.filter((a) => a.isCorrect).length} rätt av {session.totalQuestions}
      </p>
      {session.answers.map((answer, idx) => {
        const q = qMap.get(answer.questionId);
        if (!q) return null;
        const isCorrect = answer.isCorrect;

        return (
          <Card key={answer.questionId} padding="sm">
            <div className="flex items-start gap-2 mb-2">
              <span
                className={clsx(
                  'flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold mt-0.5',
                  isCorrect ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700',
                )}
              >
                {isCorrect ? '✓' : '✗'}
              </span>
              <p className="text-sm text-gray-800 font-medium leading-snug">
                <span className="text-gray-400 mr-1">{idx + 1}.</span>
                {q.text}
              </p>
            </div>
            <div className="flex flex-col gap-1 mb-3 ml-7">
              {q.options.map((opt, i) => (
                <div
                  key={i}
                  className={clsx(
                    'text-xs px-2 py-1 rounded flex items-center gap-1.5',
                    i === q.correctIndex && 'bg-success-50 text-success-700 font-medium',
                    i === answer.selectedIndex && i !== q.correctIndex && 'bg-danger-50 text-danger-700 line-through',
                    i !== q.correctIndex && i !== answer.selectedIndex && 'text-gray-400',
                  )}
                >
                  <span className="font-mono text-xs">{OPTION_LABELS[i]}.</span>
                  {opt}
                  {i === q.correctIndex && ' ✓'}
                </div>
              ))}
            </div>
            <div className="ml-7 text-xs text-gray-500 bg-gray-50 rounded p-2 leading-relaxed">
              {q.explanation}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
