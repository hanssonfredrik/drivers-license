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
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-gradient-gold text-lg">Nivå {level}</span>
        <span className="text-xs text-gray-500 font-mono">
          {progressXp} / {rangeXp} XP
        </span>
      </div>
      <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-xp-600 to-xp-400 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPct}%` }}
          role="progressbar"
          aria-valuenow={progressXp}
          aria-valuemin={0}
          aria-valuemax={rangeXp}
          aria-label={`XP framsteg: ${progressXp} av ${rangeXp}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer rounded-full" />
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span>Nivå {level}</span>
        <span>Nivå {level + 1}</span>
      </div>
    </div>
  );
}
