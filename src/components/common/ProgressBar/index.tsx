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
  brand: 'bg-gradient-to-r from-brand-600 to-brand-400',
  success: 'bg-gradient-to-r from-success-600 to-success-400',
  danger: 'bg-gradient-to-r from-danger-600 to-danger-400',
  warning: 'bg-gradient-to-r from-warning-600 to-warning-400',
  xp: 'bg-gradient-to-r from-xp-600 to-xp-400',
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
          <span className="text-xs text-gray-400">{label ?? `${Math.round(pct)}%`}</span>
          {showLabel && !label && <span className="text-xs text-gray-500">{value}/{max}</span>}
        </div>
      )}
      <div className={clsx('w-full bg-white/5 rounded-full overflow-hidden', sizeClasses[size])}>
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
