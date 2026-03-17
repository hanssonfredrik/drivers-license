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

  let stateClass = 'border-white/10 bg-white/5 hover:border-brand-500/40 hover:bg-brand-500/10';

  if (isRevealed) {
    if (isCorrect) {
      stateClass = 'border-success-500/50 bg-success-500/10 shadow-glow-success';
    } else if (isSelected && !isCorrect) {
      stateClass = 'border-danger-500/50 bg-danger-500/10 shadow-glow-danger';
    } else {
      stateClass = 'border-white/5 bg-white/[0.02] opacity-50';
    }
  } else if (isSelected) {
    stateClass = 'border-brand-500/50 bg-brand-500/10 shadow-glow-sm';
  }

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950',
        stateClass,
        !isDisabled && 'cursor-pointer',
        isDisabled && !isRevealed && 'cursor-default',
      )}
    >
      <span
        className={clsx(
          'flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-sm font-bold border-2 transition-all',
          isRevealed && isCorrect && 'bg-success-500 border-success-500 text-white',
          isRevealed && isSelected && !isCorrect && 'bg-danger-500 border-danger-500 text-white',
          isSelected && !isRevealed && 'bg-brand-500 border-brand-500 text-white',
          !isSelected && !isRevealed && 'border-white/20 text-gray-400',
          isRevealed && !isSelected && !isCorrect && 'border-white/10 text-gray-600',
        )}
      >
        {isRevealed && isCorrect ? '✓' : isRevealed && isSelected ? '✗' : OPTION_LABELS[index]}
      </span>
      <span
        className={clsx(
          'text-sm md:text-base leading-snug',
          isRevealed && isCorrect ? 'text-success-400 font-medium' : '',
          isRevealed && isSelected && !isCorrect ? 'text-danger-400' : '',
          isRevealed && !isSelected && !isCorrect ? 'text-gray-600' : '',
          !isRevealed && 'text-gray-200',
        )}
      >
        {text}
      </span>
    </button>
  );
}
