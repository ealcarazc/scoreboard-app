'use client';

import React, { use, useState } from 'react';
import { useRemoteChannel } from '@/lib/hooks/useRemoteChannel';
import { useWakeLock } from '@/lib/hooks/useWakeLock';
import { isRealtimeConfigured } from '@/lib/supabase/client';
import type { RemoteState } from '@/lib/remoteChannel';

const FLASH_MS = 140;

export default function RemotePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const roomCode = code?.toUpperCase() || null;

  const [state, setState] = useState<RemoteState | null>(null);
  const [flashP1, setFlashP1] = useState(false);
  const [flashP2, setFlashP2] = useState(false);

  useWakeLock(true);

  const { connected, sendAction } = useRemoteChannel({
    role: 'remote',
    roomCode,
    onState: setState,
  });

  const buzz = (ms: number | number[]) => {
    try {
      navigator.vibrate?.(ms);
    } catch {
      /* ignore */
    }
  };

  const score = (player: 'p1' | 'p2') => {
    if (player === 'p1') {
      setFlashP1(true);
      setTimeout(() => setFlashP1(false), FLASH_MS);
    } else {
      setFlashP2(true);
      setTimeout(() => setFlashP2(false), FLASH_MS);
    }
    buzz(45);
    sendAction({ type: 'point', player });
  };

  const undo = () => {
    buzz([30, 40, 30]);
    sendAction({ type: 'undo' });
  };

  if (!isRealtimeConfigured()) {
    return (
      <div className="flex h-[100dvh] w-screen items-center justify-center bg-gray-900 p-6 text-center text-white">
        <p>El control remoto no está disponible (falta configurar Realtime).</p>
      </div>
    );
  }

  const p1Color = state?.p1Color || '#2563eb';
  const p2Color = state?.p2Color || '#dc2626';

  return (
    <div className="relative flex h-[100dvh] w-screen select-none flex-col overflow-hidden bg-black">
      {/* Connection dot */}
      <div className="pointer-events-none absolute right-3 top-3 z-30 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: connected ? '#22c55e' : '#ef4444' }}
        />
        {connected ? (state ? 'Conectado' : 'Esperando marcador…') : 'Conectando…'}
      </div>

      {/* Player 1 half */}
      <div className="relative flex-1" style={{ backgroundColor: p1Color }}>
        <button
          onClick={() => score('p1')}
          className={`absolute inset-8 flex flex-col items-center justify-center rounded-3xl transition-all active:scale-[0.97] ${
            flashP1 ? 'brightness-150' : ''
          }`}
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <span className="font-bold text-white drop-shadow-lg" style={{ fontSize: 'clamp(1.5rem, 7vw, 3rem)' }}>
            {state?.p1Name || 'Jugador 1'}
          </span>
          <span
            className="font-black text-white drop-shadow-lg"
            style={{ fontSize: 'clamp(4rem, 22vw, 9rem)', lineHeight: 1 }}
          >
            {state?.p1Score ?? '–'}
          </span>
          <span className="mt-2 text-sm font-semibold text-white/80">Tocar para anotar</span>
        </button>
      </div>

      {/* Center bar with undo + subtitle */}
      <div className="z-20 flex items-center justify-center gap-4 bg-gray-950 px-4 py-3">
        {state?.subtitle ? (
          <span className="text-xs text-white/60">{state.subtitle}</span>
        ) : null}
        <button
          onClick={undo}
          className="rounded-full bg-white/15 px-5 py-2 text-sm font-bold text-white transition-all active:scale-90"
        >
          ↶ Deshacer
        </button>
      </div>

      {/* Player 2 half */}
      <div className="relative flex-1" style={{ backgroundColor: p2Color }}>
        <button
          onClick={() => score('p2')}
          className={`absolute inset-8 flex flex-col items-center justify-center rounded-3xl transition-all active:scale-[0.97] ${
            flashP2 ? 'brightness-150' : ''
          }`}
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <span className="font-bold text-white drop-shadow-lg" style={{ fontSize: 'clamp(1.5rem, 7vw, 3rem)' }}>
            {state?.p2Name || 'Jugador 2'}
          </span>
          <span
            className="font-black text-white drop-shadow-lg"
            style={{ fontSize: 'clamp(4rem, 22vw, 9rem)', lineHeight: 1 }}
          >
            {state?.p2Score ?? '–'}
          </span>
          <span className="mt-2 text-sm font-semibold text-white/80">Tocar para anotar</span>
        </button>
      </div>

      {/* Match over overlay */}
      {state?.matchOver && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 text-center text-white">
          <p className="text-3xl font-black">🏆 {state.winnerName} ganó</p>
          <p className="mt-2 text-sm text-white/70">Controla el siguiente partido desde el iPad</p>
        </div>
      )}
    </div>
  );
}
