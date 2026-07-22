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

  // Short celebratory ascending arpeggio for a double-tap "Ace" point
  const aceFeedback = () => {
    vibrate([40, 40, 40, 40, 90]);
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      const noteDuration = 0.09;

      notes.forEach((freq, i) => {
        const start = ctx.currentTime + i * noteDuration;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'triangle';

        gainNode.gain.setValueAtTime(0.001, start);
        gainNode.gain.exponentialRampToValueAtTime(0.25, start + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, start + noteDuration);

        oscillator.start(start);
        oscillator.stop(start + noteDuration);
      });
    } catch (e) {
      console.debug('Ace audio playback error:', e);
    }
  };

  return { vibrate, playBeep, pointFeedback, aceFeedback };
}
