'use client';

import { useEffect, useRef } from 'react';

interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipeDetection(callbacks: SwipeCallbacks, enabled: boolean = true) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    if (!enabled) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!enabled) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Must be primarily horizontal (ignore vertical scrolls)
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    // Minimum swipe distance
    const minSwipeDistance = 50;
    if (Math.abs(deltaX) < minSwipeDistance) return;

    if (deltaX > 0 && callbacks.onSwipeRight) {
      callbacks.onSwipeRight();
    } else if (deltaX < 0 && callbacks.onSwipeLeft) {
      callbacks.onSwipeLeft();
    }
  };

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart, false);
      document.removeEventListener('touchend', handleTouchEnd, false);
    };
  }, [enabled, callbacks]);
}
