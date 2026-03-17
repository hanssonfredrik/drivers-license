import clsx from 'clsx';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  const fire =
    currentStreak >= 30 ? '🔥🔥🔥' : currentStreak >= 7 ? '🔥🔥' : currentStreak >= 3 ? '🔥' : '📅';

  return (
    <div className="flex gap-4">
      <div
        className={clsx(
          'flex-1 rounded-xl p-4 text-center border',
          currentStreak >= 7
            ? 'bg-orange-50 border-orange-200'
            : 'bg-gray-50 border-gray-200',
        )}
      >
        <div className="text-3xl mb-1">{fire}</div>
        <div className="text-2xl font-bold text-gray-800">{currentStreak}</div>
        <div className="text-xs text-gray-500 mt-0.5">Dagars svit</div>
      </div>
      <div className="flex-1 rounded-xl p-4 text-center bg-gray-50 border border-gray-200">
        <div className="text-3xl mb-1">🏆</div>
        <div className="text-2xl font-bold text-gray-800">{longestStreak}</div>
        <div className="text-xs text-gray-500 mt-0.5">Längsta svit</div>
      </div>
    </div>
  );
}
