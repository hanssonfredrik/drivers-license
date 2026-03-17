import { useState, useEffect, useCallback } from 'react';
import { gamificationEngine } from '@/services/gamificationEngine';
import type { GamificationState, Badge, GamificationEvent } from '@/types/gamification';

interface UseGamificationResult {
  state: GamificationState | null;
  badges: Badge[];
  earnedBadgeIds: string[];
  isLoading: boolean;
  pendingEvents: GamificationEvent[];
  dismissEvents: () => void;
  refresh: () => void;
}

export function useGamification(): UseGamificationResult {
  const [state, setState] = useState<GamificationState | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEvents, setPendingEvents] = useState<GamificationEvent[]>([]);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  const dismissEvents = useCallback(() => setPendingEvents([]), []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([gamificationEngine.getState(), gamificationEngine.getAllBadges()])
      .then(([s, b]) => {
        if (cancelled) return;
        setState(s);
        setBadges(b);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [tick]);

  return { state, badges, earnedBadgeIds: state?.earnedBadgeIds ?? [], isLoading, pendingEvents, dismissEvents, refresh };
}
