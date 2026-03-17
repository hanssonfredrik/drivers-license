import { clsx } from 'clsx';
import type { Question } from '@/types/question';
import { AnswerOption } from '../AnswerOption';
import { QuestionImage } from '../QuestionImage';

interface QuestionCardProps {
  question: Question;
  selectedIndex: number | null;
  isAnswered: boolean;
  onAnswer: (index: number) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  questionNumber?: number;
  totalQuestions?: number;
}

export function QuestionCard({
  question,
  selectedIndex,
  isAnswered,
  onAnswer,
  isBookmarked = false,
  onToggleBookmark,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        {questionNumber != null && totalQuestions != null && (
          <span className="text-sm text-gray-500 font-medium flex-shrink-0">
            {questionNumber} / {totalQuestions}
          </span>
        )}
        {onToggleBookmark && (
          <button
            onClick={onToggleBookmark}
            aria-label={isBookmarked ? 'Ta bort bokmärke' : 'Bokmärk fråga'}
            className={clsx(
              'flex-shrink-0 p-1 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
              isBookmarked ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-600',
            )}
          >
            {isBookmarked ? '★' : '☆'}
          </button>
        )}
      </div>

      {/* Question image */}
      {question.imageId && <QuestionImage imageId={question.imageId} alt={question.text} />}

      {/* Question text */}
      <p className="text-base md:text-lg font-medium text-gray-900 leading-relaxed">
        {question.text}
      </p>

      {/* Answer options */}
      <div className="flex flex-col gap-2">
        {question.options.map((option, index) => (
          <AnswerOption
            key={index}
            text={option}
            index={index}
            isSelected={selectedIndex === index}
            isCorrect={isAnswered ? index === question.correctIndex : null}
            isDisabled={isAnswered}
            onClick={() => onAnswer(index)}
          />
        ))}
      </div>
    </div>
  );
}
