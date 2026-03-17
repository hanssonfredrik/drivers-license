import { useEffect, useState, useCallback } from 'react';

export function useTimer(initialMs: number, paused = false) {
  const [remaining, setRemaining] = useState(initialMs);
  const [expired, setExpired] = useState(false);

  const reset = useCallback(() => {
    setRemaining(initialMs);
    setExpired(false);
  }, [initialMs]);

  useEffect(() => {
    if (paused || expired || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setExpired(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, expired, remaining]);

  return { remaining, expired, reset };
}
