'use client';

import React, { useEffect, useState } from 'react';
import type { Match, PlayerInfo } from '@/types';
import { recordMatchResult, revertMatchResult, type SessionStats } from '@/lib/sessionStats';
import { getRecentPairs, RECENT_PAIRS_SHOWN, type RecentPair } from '@/lib/recentPairs';
import { recordSeriesResult, revertSeriesResult, type SeriesResult } from '@/lib/seriesTracker';
import { addMatchHistoryEntry, removeLastMatchHistoryEntry } from '@/lib/matchHistory';
import { pushToDrive } from '@/lib/driveSync';
import { SPORT_COLOR } from '@/lib/sportIcons';

interface ResultScreenProps {
  match: Match;
  onNewMatch: () => void;
  onBackToMenu: () => void;
  onRematchWithPair?: (p1: PlayerInfo, p2: PlayerInfo) => void;
  onUndoLastPoint: () => void;
}

const font = 'var(--font-geist-sans), sans-serif';

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
      getRecentPairs()
        .filter((p) => pairKey(p.player1.name, p.player2.name) !== currentKey)
        .slice(0, RECENT_PAIRS_SHOWN)
    );
  }, [match.players.p1.name, match.players.p2.name]);

  const rows = Object.entries(stats).sort(([, a], [, b]) => b.wins - a.wins);

  const setsLabel = `Sets ${match.currentSets.p1}-${match.currentSets.p2}`;
  const sportColor = SPORT_COLOR[match.sport];

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
    <div
      className="relative flex h-screen w-screen flex-col items-center justify-center overflow-y-auto p-6 text-white"
      style={{ backgroundColor: sportColor, animation: 'popIn 0.4s ease' }}
    >
      <button
        onClick={handleUndoWinner}
        className="absolute left-4 top-4 z-10 flex items-center gap-1 transition-all active:scale-95"
        style={{
          borderRadius: '9999px',
          backgroundColor: 'rgba(0,0,0,0.25)',
          padding: '8px 14px',
          fontFamily: font,
          fontSize: '12px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.9)',
        }}
        title="Deshacer: fue un error, no ganó el partido"
      >
        ↩️ Deshacer
      </button>

      <div style={{ fontSize: '46px', marginBottom: '10px', animation: 'trophyBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        🏆
      </div>
      <h1
        className="mb-3 text-center"
        style={{ fontFamily: font, fontWeight: 800, fontSize: '26px' }}
      >
        ¡{winner.name} gana!
      </h1>

      {match.sport === 'tennis' && (
        <p className="mb-3" style={{ fontFamily: font, fontSize: '17px', color: 'rgba(255,255,255,0.85)' }}>
          {setsLabel}
        </p>
      )}

      <div className="mb-6 flex items-center" style={{ gap: '20px' }}>
        <div className="text-center">
          <p style={{ fontFamily: font, fontWeight: 800, fontSize: '44px', lineHeight: 1 }}>{match.currentPoints.p1}</p>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>
            {match.players.p1.name}
          </p>
        </div>
        <div style={{ fontFamily: font, fontWeight: 800, fontSize: '32px' }}>-</div>
        <div className="text-center">
          <p style={{ fontFamily: font, fontWeight: 800, fontSize: '44px', lineHeight: 1 }}>{match.currentPoints.p2}</p>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>
            {match.players.p2.name}
          </p>
        </div>
      </div>

      <p className="mb-5" style={{ fontFamily: font, fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>
        Duración: {Math.round((match.endTime?.getTime()! - match.startTime.getTime()) / 60000)} minutos
      </p>

      {/* Series tracking */}
      {series && (
        series.clinched ? (
          <div
            className="mb-6 text-center"
            style={{
              borderRadius: '18px',
              backgroundColor: 'rgba(255,255,255,0.18)',
              padding: '14px 24px',
              animation: 'seriesWinPulse 1s ease-in-out infinite',
            }}
          >
            <p style={{ fontFamily: font, fontWeight: 800, fontSize: '18px' }}>
              🏆🏆 ¡{series.seriesWinnerName} ganó la serie! 🏆🏆
            </p>
            <p style={{ fontFamily: font, fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
              {series.seriesFormat} · {series.state.p1Name} {series.state.p1Wins}-{series.state.p2Wins} {series.state.p2Name}
            </p>
          </div>
        ) : (
          <p className="mb-6" style={{ fontFamily: font, fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            Serie: {series.state.p1Name} {series.state.p1Wins} — {series.state.p2Name} {series.state.p2Wins}
          </p>
        )
      )}

      {/* Session standings */}
      <div
        className="mb-6 w-full max-w-md text-center"
        style={{
          borderRadius: '18px',
          backgroundColor: 'rgba(255,255,255,0.14)',
          padding: '16px 18px',
        }}
      >
        <p className="mb-3" style={{ fontFamily: font, fontWeight: 700, fontSize: '15px' }}>
          📊 Tabla de sesión
        </p>
        <div className="flex flex-wrap justify-center" style={{ gap: '16px' }}>
          {rows.map(([name, s], i) => (
            <div key={name} style={{ fontFamily: font, fontSize: '14px' }}>
              {i === 0 && '🏆 '}
              {name}: <span style={{ fontWeight: 800, fontSize: '18px' }}>{s.wins}</span>{' '}
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>({s.matches} partidos)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex" style={{ gap: '12px' }}>
        <button
          onClick={onNewMatch}
          className="transition-all active:scale-95"
          style={{
            borderRadius: '9999px',
            backgroundColor: '#FFFFFF',
            color: sportColor,
            padding: '16px 28px',
            fontFamily: font,
            fontWeight: 800,
            fontSize: '17px',
            border: 'none',
          }}
        >
          🎮 Jugar otra vez
        </button>

        <button
          onClick={onBackToMenu}
          className="transition-all active:scale-95"
          style={{
            borderRadius: '9999px',
            backgroundColor: 'transparent',
            border: '2px solid rgba(255,255,255,0.5)',
            color: '#FFFFFF',
            padding: '16px 28px',
            fontFamily: font,
            fontWeight: 700,
            fontSize: '17px',
          }}
        >
          ← Menú
        </button>
      </div>

      {/* Quick rematch with a different frequent opponent */}
      {onRematchWithPair && recentPairs.length > 0 && (
        <div className="mt-10 w-full max-w-md text-center">
          <p className="mb-3" style={{ fontFamily: font, fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
            ⚡ O empieza revancha con:
          </p>
          <div className="flex flex-wrap justify-center" style={{ gap: '8px' }}>
            {recentPairs.map((pair, i) => (
              <button
                key={i}
                onClick={() => handleQuickRematch(pair)}
                className="flex items-center transition-all active:scale-95"
                style={{
                  gap: '8px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  padding: '10px 16px',
                  fontFamily: font,
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                }}
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
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(255,255,255,0); }
          50% { transform: scale(1.03); box-shadow: 0 0 30px rgba(255,255,255,0.35); }
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
