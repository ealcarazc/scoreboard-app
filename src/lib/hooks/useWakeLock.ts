'use client';

import { useEffect, useRef } from 'react';

// Keeps the screen awake while `active` is true (Safari iOS 16.4+, Chrome).
// Silently does nothing where the API is unavailable.
export function useWakeLock(active: boolean) {
  const lockRef = useRef<any>(null);

  useEffect(() => {
    if (!active || typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return;
    }

    let released = false;

    const acquire = async () => {
      try {
        lockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch {
        // ignore — not critical
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !released) {
        acquire();
      }
    };

    acquire();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      released = true;
      document.removeEventListener('visibilitychange', handleVisibility);
      lockRef.current?.release?.().catch(() => {});
      lockRef.current = null;
    };
  }, [active]);
}
