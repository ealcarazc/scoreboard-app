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

  // Short stadium-ovation swell (noise bed + bright blips) for a
  // double-tap "Ace" point. Must run synchronously inside the tap
  // handler (no async gap) so iOS Safari's autoplay gate allows it.
  const aceFeedback = () => {
    vibrate([40, 40, 40, 40, 90]);
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const duration = 1.0;

      // Crowd-roar noise bed, band-passed and shaped with a quick swell + fade
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.7;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1100;
      bandpass.Q.value = 0.5;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.35, now + 0.12);
      noiseGain.gain.exponentialRampToValueAtTime(0.16, now + 0.55);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + duration);

      // A few bright celebratory blips layered on top
      [660, 880, 1046.5].forEach((freq, i) => {
        const start = now + i * 0.08;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'triangle';
        oscillator.frequency.value = freq;

        gainNode.gain.setValueAtTime(0.0001, start);
        gainNode.gain.exponentialRampToValueAtTime(0.2, start + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, start + 0.2);

        oscillator.start(start);
        oscillator.stop(start + 0.22);
      });
    } catch (e) {
      console.debug('Ace audio playback error:', e);
    }
  };

  return { vibrate, playBeep, pointFeedback, aceFeedback };
}
