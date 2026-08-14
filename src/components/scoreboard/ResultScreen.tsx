'use client';

import React, { useEffect, useState } from 'react';
import type { Match, PlayerInfo } from '@/types';
import { recordMatchResult, revertMatchResult, type SessionStats } from '@/lib/sessionStats';
import { getRecentPairs, type RecentPair } from '@/lib/recentPairs';
import { recordSeriesResult, revertSeriesResult, type SeriesResult } from '@/lib/seriesTracker';
import { addMatchHistoryEntry, removeLastMatchHistoryEntry } from '@/lib/matchHistory';
import { pushToDrive } from '@/lib/driveSync';

interface ResultScreenProps {
  match: Match;
  onNewMatch: () => void;
  onBackToMenu: () => void;
  onRematchWithPair?: (p1: PlayerInfo, p2: PlayerInfo) => void;
  onUndoLastPoint: () => void;
}

export function ResultScreen({ match, onNewMatch, onBackToMenu, onRematchWithPair, onUndoLastPoint }: ResultScreenProps) {
  const winner = match.result === 'p1_win' ? match.players.p1 : match.players.p2;
  const loser = match.result === 'p1_win' ? match.players.p2 : match.players.p1;
  const [stats, setStats] = useState<SessionStats>({});
  const [recentPairs, setRecentPairs] = useState<RecentPair[]>([]);
  const [series, setSeries] = useState<SeriesResult | null>(null);

  useEffect(() => {
    const updated = recordMatchResult(winner.name, loser.name);
    setStats(updated);

    const seriesResult = recordSeriesResult(
      match.players.p1.name,
      match.players.p2.name,
      match.sport,
      winner.name
    );
    setSeries(seriesResult);

    const score =
      match.sport === 'tennis'
        ? `Sets ${match.currentSets.p1}-${match.currentSets.p2}`
        : `${match.currentPoints.p1}-${match.currentPoints.p2}`;

    addMatchHistoryEntry({
      date: new Date().toISOString().slice(0, 10),
      sport: match.sport,
      player1: match.players.p1.name,
      player2: match.players.p2.name,
      winner: winner.name,
      score,
    });

    pushToDrive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner.name, loser.name, match.result]);

  useEffect(() => {
    const pairKey = (a: string, b: string) => [a, b].sort().join('|');
    const currentKey = pairKey(match.players.p1.name, match.players.p2.name);
    setRecentPairs(
      getRecentPairs().filter((p) => pairKey(p.player1.name, p.player2.name) !== currentKey)
    );
  }, [match.players.p1.name, match.players.p2.name]);

  const rows = Object.entries(stats).sort(([, a], [, b]) => b.wins - a.wins);

  const setsLabel = `Sets ${match.currentSets.p1}-${match.currentSets.p2}`;

  const handleQuickRematch = (pair: RecentPair) => {
    if (!onRematchWithPair) return;
    const p1: PlayerInfo = { id: `recent-${pair.player1.name}`, name: pair.player1.name, color: pair.player1.color, isFrequent: false };
    const p2: PlayerInfo = { id: `recent-${pair.player2.name}`, name: pair.player2.name, color: pair.player2.color, isFrequent: false };
    onRematchWithPair(p1, p2);
  };

  const handleUndoWinner = () => {
    revertMatchResult(winner.name, loser.name);
    if (series) {
      revertSeriesResult(series.state, winner.name);
    }
    removeLastMatchHistoryEntry();
    pushToDrive();
    onUndoLastPoint();
  };

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-y-auto bg-gradient-to-b from-green-600 to-green-900 p-6 text-white">
      <button
        onClick={handleUndoWinner}
        className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-black/25 px-3 py-2 text-xs font-semibold text-white/90 transition-all hover:bg-black/40 active:scale-95"
        title="Deshacer: fue un error, no ganó el partido"
      >
        ↩️ Deshacer
      </button>

      <div className="mb-4 text-8xl" style={{ animation: 'trophyBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        🏆
      </div>
      <h1 className="mb-2 text-center text-6xl font-bold">¡{winner.name} GANÓ!</h1>

      {match.sport === 'tennis' && <p className="mb-4 text-2xl">{setsLabel}</p>}

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

      <p className="mb-4 text-2xl">Duración: {Math.round((match.endTime?.getTime()! - match.startTime.getTime()) / 60000)} minutos</p>

      {/* Series tracking */}
      {series && (
        series.clinched ? (
          <div
            className="mb-8 rounded-xl bg-yellow-500/20 px-6 py-4 text-center"
            style={{ animation: 'seriesWinPulse 1s ease-in-out infinite' }}
          >
            <p className="text-2xl font-black">
              🏆🏆 ¡{series.seriesWinnerName} ganó la serie! 🏆🏆
            </p>
            <p className="text-sm text-white/80">{series.seriesFormat} · {series.state.p1Name} {series.state.p1Wins}-{series.state.p2Wins} {series.state.p2Name}</p>
          </div>
        ) : (
          <p className="mb-8 text-sm text-white/70">
            Serie: {series.state.p1Name} {series.state.p1Wins} — {series.state.p2Name} {series.state.p2Wins}
          </p>
        )
      )}

      {/* Session standings */}
      <div className="mb-8 text-center">
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
          🎮 Jugar otra vez
        </button>

        <button
          onClick={onBackToMenu}
          className="rounded-lg bg-gray-700 px-8 py-4 text-2xl font-bold hover:bg-gray-600 active:scale-95"
        >
          ← Menú
        </button>
      </div>

      {/* Quick rematch with a different frequent opponent */}
      {onRematchWithPair && recentPairs.length > 0 && (
        <div className="mt-10 w-full max-w-md text-center">
          <p className="mb-3 text-sm font-semibold text-white/70">⚡ O empieza revancha con:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {recentPairs.map((pair, i) => (
              <button
                key={i}
                onClick={() => handleQuickRematch(pair)}
                className="flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-sm transition-all hover:bg-black/30 active:scale-95"
              >
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: pair.player1.color }} />
                {pair.player1.name} vs {pair.player2.name}
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: pair.player2.color }} />
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes trophyBounce {
          0% { transform: scale(0) rotate(-15deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(8deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes seriesWinPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(234, 179, 8, 0); }
          50% { transform: scale(1.03); box-shadow: 0 0 30px rgba(234, 179, 8, 0.6); }
        }
      `}</style>
    </div>
  );
}
