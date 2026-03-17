import clsx from 'clsx';
import type { Badge } from '@/types/gamification';

interface BadgeGridProps {
  badges: Badge[];
  earnedBadgeIds: string[];
}

interface BadgeCardProps {
  badge: Badge;
  earned: boolean;
}

function BadgeCard({ badge, earned }: BadgeCardProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all',
        earned
          ? 'bg-brand-50 border-brand-200 shadow-sm'
          : 'bg-gray-50 border-gray-200 opacity-50',
      )}
      title={earned ? 'Upplåst' : badge.description}
    >
      <span className="text-2xl">{badge.icon}</span>
      <span className="text-xs font-medium text-gray-700 leading-tight">{badge.name}</span>
      {earned && (
        <span className="text-[10px] text-brand-600 font-semibold">✓ Upplåst</span>
      )}
    </div>
  );
}

export function BadgeGrid({ badges, earnedBadgeIds }: BadgeGridProps) {
  if (badges.length === 0) {
    return <p className="text-sm text-gray-500">Inga märken tillgängliga.</p>;
  }

  const earnedSet = new Set(earnedBadgeIds);
  const earnedBadges = badges.filter((b) => earnedSet.has(b.id));
  const locked = badges.filter((b) => !earnedSet.has(b.id));
  const sorted = [...earnedBadges, ...locked];

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        {earnedBadges.length} av {badges.length} upplåsta
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {sorted.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} earned={earnedSet.has(badge.id)} />
        ))}
      </div>
    </div>
  );
}
