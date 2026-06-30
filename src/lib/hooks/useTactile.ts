'use client';

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!audioContext) {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContext = new AudioContextClass();
      }
    } catch (e) {
      console.debug('AudioContext not available');
    }
  }

  return audioContext;
}

export function useTactile() {
  const vibrate = (pattern: number | number[] = 50) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        console.debug('Vibration not available');
      }
    }
  };

  const playBeep = (frequency: number = 200, duration: number = 80) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      // Resume audio context if suspended (common in browsers)
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      // Set volume and create fade out
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);

      oscillator.start(now);
      oscillator.stop(now + duration / 1000);
    } catch (e) {
      console.debug('Audio playback error:', e);
    }
  };

  const pointFeedback = () => {
    vibrate(50);
    playBeep(200, 80);
  };

  return { vibrate, playBeep, pointFeedback };
}
