interface XpLevelBarProps {
  totalXp: number;
  level: number;
}

function xpForLevel(level: number): number {
  return level * level * 100;
}

export function XpLevelBar({ totalXp, level }: XpLevelBarProps) {
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const rangeXp = nextLevelXp - currentLevelXp;
  const progressXp = totalXp - currentLevelXp;
  const progressPct = Math.min(100, Math.round((progressXp / rangeXp) * 100));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-700">Nivå {level}</span>
        <span className="text-xs text-gray-500">
          {progressXp} / {rangeXp} XP
        </span>
      </div>
      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-xp-400 to-xp-600 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
          role="progressbar"
          aria-valuenow={progressXp}
          aria-valuemin={0}
          aria-valuemax={rangeXp}
          aria-label={`XP framsteg: ${progressXp} av ${rangeXp}`}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Nivå {level}</span>
        <span>Nivå {level + 1}</span>
      </div>
    </div>
  );
}
