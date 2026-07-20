'use client';

import React, { useEffect, useState } from 'react';
import type { Match } from '@/types';
import { recordMatchResult, type SessionStats } from '@/lib/sessionStats';

interface ResultScreenProps {
  match: Match;
  onNewMatch: () => void;
  onBackToMenu: () => void;
}

export function ResultScreen({ match, onNewMatch, onBackToMenu }: ResultScreenProps) {
  const winner = match.result === 'p1_win' ? match.players.p1 : match.players.p2;
  const loser = match.result === 'p1_win' ? match.players.p2 : match.players.p1;
  const [stats, setStats] = useState<SessionStats>({});

  useEffect(() => {
    const updated = recordMatchResult(winner.name, loser.name);
    setStats(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner.name, loser.name, match.result]);

  const rows = Object.entries(stats).sort(([, a], [, b]) => b.wins - a.wins);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-green-600 to-green-900 text-white">
      <div className="mb-4 text-8xl" style={{ animation: 'trophyBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        🏆
      </div>
      <h1 className="mb-8 text-6xl font-bold">¡{winner.name} GANÓ!</h1>

      <div className="mb-8 flex gap-12 text-center">
        <div>
          <p className="text-4xl font-bold">{match.currentPoints.p1}</p>
          <p className="text-2xl">{match.players.p1.name}</p>
        </div>
        <div className="text-4xl font-bold">-</div>
        <div>
          <p className="text-4xl font-bold">{match.currentPoints.p2}</p>
          <p className="text-2xl">{match.players.p2.name}</p>
        </div>
      </div>

      <p className="mb-8 text-2xl">Duración: {Math.round((match.endTime?.getTime()! - match.startTime.getTime()) / 60000)} minutos</p>

      {/* Session standings */}
      <div className="mb-12 text-center">
        <p className="mb-4 text-xl font-semibold">📊 Tabla de Sesión:</p>
        <div className="flex flex-wrap justify-center gap-8 text-lg">
          {rows.map(([name, s], i) => (
            <div key={name}>
              <p>
                {i === 0 && '🏆 '}
                {name}: <span className="font-bold text-2xl">{s.wins}</span>{' '}
                <span className="text-sm text-white/70">({s.matches} partidos)</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <button
          onClick={onNewMatch}
          className="rounded-lg bg-blue-600 px-8 py-4 text-2xl font-bold hover:bg-blue-700 active:scale-95"
        >
          🎮 Otro Partido
        </button>

        <button
          onClick={onBackToMenu}
          className="rounded-lg bg-gray-700 px-8 py-4 text-2xl font-bold hover:bg-gray-600 active:scale-95"
        >
          ← Menú
        </button>
      </div>

      <style>{`
        @keyframes trophyBounce {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(8deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
