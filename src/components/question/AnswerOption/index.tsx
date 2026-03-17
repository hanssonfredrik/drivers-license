import { clsx } from 'clsx';

interface AnswerOptionProps {
  text: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean | null;
  isDisabled: boolean;
  onClick: () => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function AnswerOption({
  text,
  index,
  isSelected,
  isCorrect,
  isDisabled,
  onClick,
}: AnswerOptionProps) {
  const isRevealed = isCorrect !== null;

  let stateClass = 'border-gray-200 bg-white hover:border-brand-300 hover:bg-brand-50';

  if (isRevealed) {
    if (isCorrect) {
      stateClass = 'border-success-500 bg-success-50';
    } else if (isSelected && !isCorrect) {
      stateClass = 'border-danger-500 bg-danger-50';
    } else {
      stateClass = 'border-gray-200 bg-white opacity-60';
    }
  } else if (isSelected) {
    stateClass = 'border-brand-500 bg-brand-50';
  }

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
        stateClass,
        !isDisabled && 'cursor-pointer',
        isDisabled && !isRevealed && 'cursor-default',
      )}
    >
      <span
        className={clsx(
          'flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold border-2',
          isRevealed && isCorrect && 'bg-success-500 border-success-500 text-white',
          isRevealed && isSelected && !isCorrect && 'bg-danger-500 border-danger-500 text-white',
          isSelected && !isRevealed && 'bg-brand-500 border-brand-500 text-white',
          !isSelected && !isRevealed && 'border-gray-300 text-gray-600',
          isRevealed && !isSelected && !isCorrect && 'border-gray-300 text-gray-400',
        )}
      >
        {isRevealed && isCorrect ? '✓' : isRevealed && isSelected ? '✗' : OPTION_LABELS[index]}
      </span>
      <span
        className={clsx(
          'text-sm md:text-base leading-snug',
          isRevealed && isCorrect ? 'text-success-700 font-medium' : '',
          isRevealed && isSelected && !isCorrect ? 'text-danger-700' : '',
          isRevealed && !isSelected && !isCorrect ? 'text-gray-400' : '',
          !isRevealed && 'text-gray-800',
        )}
      >
        {text}
      </span>
    </button>
  );
}
