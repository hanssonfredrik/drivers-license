import { clsx } from 'clsx';

interface QuizProgressProps {
  current: number;
  total: number;
  answeredCount: number;
  className?: string;
}

export function QuizProgress({ current, total, answeredCount, className }: QuizProgressProps) {
  const pct = Math.round((answeredCount / total) * 100);

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Fråga {current} av {total}</span>
        <span>{answeredCount} besvarade</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
