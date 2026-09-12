'use client';

import React, { use, useState } from 'react';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { useRemoteChannel } from '@/lib/hooks/useRemoteChannel';
import { useWakeLock } from '@/lib/hooks/useWakeLock';
import { isRealtimeConfigured } from '@/lib/supabase/client';
import type { RemoteState } from '@/lib/remoteChannel';

export default function RemotePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const roomCode = code?.toUpperCase() || null;

  const [state, setState] = useState<RemoteState | null>(null);

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

  const handleTapP1 = (isAce?: boolean) => {
    buzz(isAce ? [40, 40, 40, 40, 90] : 45);
    sendAction({ type: isAce ? 'ace' : 'point', player: 'p1' });
  };

  const handleTapP2 = (isAce?: boolean) => {
    buzz(isAce ? [40, 40, 40, 40, 90] : 45);
    sendAction({ type: isAce ? 'ace' : 'point', player: 'p2' });
  };

  const handleUndo = () => {
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

  return (
    <div className="relative h-[100dvh] w-screen select-none overflow-hidden bg-black">
      {!state ? (
        <div className="flex h-full w-full items-center justify-center text-center text-white">
          <p className="text-lg">{connected ? 'Esperando el marcador…' : 'Conectando…'}</p>
        </div>
      ) : (
        <ScoreDisplay
          sport={state.sport}
          p1Name={state.p1Name}
          p2Name={state.p2Name}
          p1Score={state.p1Score}
          p2Score={state.p2Score}
          p1Color={state.p1Color}
          p2Color={state.p2Color}
          p1Serving={state.p1Serving}
          p2Serving={state.p2Serving}
          subtitle1={state.subtitle}
          subtitle2={state.subtitle}
          p1MatchPoint={state.p1MatchPoint}
          p2MatchPoint={state.p2MatchPoint}
          p1SessionLeader={state.p1SessionLeader}
          p2SessionLeader={state.p2SessionLeader}
          onTapP1={handleTapP1}
          onTapP2={handleTapP2}
        />
      )}

      {/* Connection status */}
      <div className="pointer-events-none absolute right-3 top-3 z-[60] flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: connected ? '#22c55e' : '#ef4444' }}
        />
        {connected ? 'Vinculado' : 'Conectando…'}
      </div>

      {/* Undo — floating, out of the way of the score panels */}
      {state && !state.matchOver && (
        <button
          onClick={handleUndo}
          className="absolute left-1/2 top-3 z-[60] -translate-x-1/2 rounded-full bg-black/40 px-4 py-1.5 text-xs font-bold text-white transition-all active:scale-90"
        >
          ↶ Deshacer
        </button>
      )}

      {/* Match over overlay */}
      {state?.matchOver && (
        <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-black/80 text-center text-white">
          <p className="text-3xl font-black">🏆 {state.winnerName} ganó</p>
          <p className="mt-2 text-sm text-white/70">Sigue desde el otro dispositivo</p>
        </div>
      )}
    </div>
  );
}
