import { clsx } from 'clsx';

type ProgressBarColor = 'brand' | 'success' | 'danger' | 'warning' | 'xp';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: ProgressBarColor;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

const colorClasses: Record<ProgressBarColor, string> = {
  brand: 'bg-brand-500',
  success: 'bg-success-500',
  danger: 'bg-danger-500',
  warning: 'bg-warning-500',
  xp: 'bg-xp-500',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  max = 100,
  color = 'brand',
  size = 'md',
  showLabel = false,
  label,
  className,
  animated = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={clsx('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-600">{label ?? `${Math.round(pct)}%`}</span>
          {showLabel && !label && <span className="text-xs text-gray-400">{value}/{max}</span>}
        </div>
      )}
      <div className={clsx('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={clsx(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorClasses[color],
            animated && 'animate-pulse',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
