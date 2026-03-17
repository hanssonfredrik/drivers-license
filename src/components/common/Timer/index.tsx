import { useEffect, useState, useRef } from 'react';
import { clsx } from 'clsx';

interface TimerProps {
  initialMs: number;
  onTimeout: () => void;
  paused?: boolean;
  className?: string;
}

export function Timer({ initialMs, onTimeout, paused = false, className }: TimerProps) {
  const [remaining, setRemaining] = useState(initialMs);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    setRemaining(initialMs);
  }, [initialMs]);

  useEffect(() => {
    if (paused || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          onTimeoutRef.current();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, remaining]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const isWarning = remaining <= 5 * 60 * 1000;
  const isCritical = remaining <= 2 * 60 * 1000;

  return (
    <div
      className={clsx(
        'flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums px-3 py-1.5 rounded-xl border',
        isCritical
          ? 'bg-danger-50 border-danger-500/30 text-danger-400 animate-pulse shadow-glow-danger'
          : isWarning
            ? 'bg-warning-50 border-warning-500/30 text-warning-400'
            : 'bg-white/5 border-white/10 text-gray-300',
        className,
      )}
      role="timer"
      aria-label={`Tid kvar: ${minutes} minuter ${seconds} sekunder`}
    >
      <span>{String(minutes).padStart(2, '0')}</span>
      <span className="opacity-50">:</span>
      <span>{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}
