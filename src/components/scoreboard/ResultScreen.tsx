'use client';

import React, { useEffect, useState } from 'react';
import type { Match } from '@/types';

interface ResultScreenProps {
  match: Match;
  onNewMatch: () => void;
  onBackToMenu: () => void;
}

interface GameStats {
  [playerName: string]: number;
}

export function ResultScreen({ match, onNewMatch, onBackToMenu }: ResultScreenProps) {
  const winner = match.result === 'p1_win' ? match.players.p1 : match.players.p2;
  const loser = match.result === 'p1_win' ? match.players.p2 : match.players.p1;
  const [gameStats, setGameStats] = useState<GameStats>({});

  useEffect(() => {
    // Load and update game stats
    const saved = localStorage.getItem('gameStats');
    const stats: GameStats = saved ? JSON.parse(saved) : {};

    // Increment winner's games won count
    stats[winner.name] = (stats[winner.name] || 0) + 1;

    localStorage.setItem('gameStats', JSON.stringify(stats));
    setGameStats(stats);
  }, [winner.name, match.result]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-b from-green-600 to-green-900 text-white">
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

      {/* Game stats counter */}
      <div className="mb-12 text-center">
        <p className="mb-4 text-xl font-semibold">📊 Juegos Ganados:</p>
        <div className="flex gap-8 text-lg">
          {Object.entries(gameStats)
            .sort(([, a], [, b]) => b - a)
            .map(([name, wins]) => (
              <div key={name}>
                <p>{name}: <span className="font-bold text-2xl">{wins}</span></p>
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
    </div>
  );
}
