import { useCallback } from 'react';
import confetti from 'canvas-confetti';

type CelebrationType = 'quiz-passed' | 'badge-earned' | 'level-up' | 'streak-milestone';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useCelebration() {
  const celebrate = useCallback((type: CelebrationType) => {
    if (prefersReducedMotion()) return;

    switch (type) {
      case 'quiz-passed':
        void confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#1d4ed8', '#22c55e', '#f59e0b'],
        });
        break;
      case 'badge-earned':
        void confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#8b5cf6', '#a78bfa', '#fbbf24'],
          scalar: 0.8,
        });
        break;
      case 'level-up':
        void confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
        });
        void confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
        });
        break;
      case 'streak-milestone':
        void confetti({
          particleCount: 40,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#f59e0b', '#ef4444', '#22c55e'],
        });
        break;
    }
  }, []);

  return { celebrate };
}
