'use client';

import { useEffect, useRef } from 'react';

interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipeDetection(callbacks: SwipeCallbacks, enabled: boolean = true) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);

  const handleTouchStart = (e: TouchEvent) => {
    if (!enabled) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!enabled) return;

    // Ignore if touch duration is too short (likely a tap/click, not a swipe)
    const touchDuration = Date.now() - touchStartTime.current;
    if (touchDuration < 100) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Must be primarily horizontal (ignore vertical scrolls)
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    // Minimum swipe distance
    const minSwipeDistance = 80;
    if (Math.abs(deltaX) < minSwipeDistance) return;

    // Only trigger swipe if it's a genuine swipe gesture
    if (deltaX > 0 && callbacks.onSwipeRight) {
      callbacks.onSwipeRight();
    } else if (deltaX < 0 && callbacks.onSwipeLeft) {
      callbacks.onSwipeLeft();
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // Use passive listeners to not block touch events
    const options = { passive: true };

    document.addEventListener('touchstart', handleTouchStart as any, options);
    document.addEventListener('touchend', handleTouchEnd as any, options);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart as any);
      document.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, [enabled, callbacks]);
}
