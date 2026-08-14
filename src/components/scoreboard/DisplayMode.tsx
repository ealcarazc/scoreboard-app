'use client';

import React, { useEffect, useState } from 'react';
import type { Match } from '@/types';
import { isMatchPoint } from '@/game/matchPoint';
import { getSessionStats, getSessionLeaders } from '@/lib/sessionStats';
import { SERVE_ICON } from '@/lib/sportIcons';

// Fluid font-size that also accounts for text length, so wider strings
// like "DEUCE" or "AD" shrink to fit instead of overflowing their panel.
function scoreFontSize(score: number | string): string {
  const length = Math.max(String(score).length, 1);
  const widthFactor = Math.min(72 / length, 50);
  return `clamp(3rem, min(${widthFactor}cqw, 45cqh), 20rem)`;
}

interface DisplayModeProps {}

export function DisplayMode({}: DisplayModeProps) {
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [leaders, setLeaders] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('displayMatch');
      if (!stored) {
        setError('No hay datos de marcador. Abre desde el app de control.');
        return;
      }

      const matchData: Match = JSON.parse(stored);
      matchData.startTime = new Date(matchData.startTime);
      if (matchData.endTime) {
        matchData.endTime = new Date(matchData.endTime);
      }
      setMatch(matchData);
      setError(null);
      setLeaders(getSessionLeaders(getSessionStats()));
    } catch (err) {
      console.error('Error parsing match data:', err);
      setError(`Error: ${err}`);
    }
  }, []);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white text-center px-4">
        <div>
          <p className="mb-4 text-red-400">Error cargando marcador</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white text-2xl">
        Cargando marcador desde sesión...
      </div>
    );
  }

  let p1Score: string | number = match.currentPoints.p1;
  let p2Score: string | number = match.currentPoints.p2;
  let subtitle1 = '';
  let subtitle2 = '';

  if (match.sport === 'tennis') {
    subtitle1 = `Sets ${match.currentSets.p1}-${match.currentSets.p2} | Games ${match.currentGames.p1}-${match.currentGames.p2}`;
    subtitle2 = `Sets ${match.currentSets.p1}-${match.currentSets.p2} | Games ${match.currentGames.p1}-${match.currentGames.p2}`;

    const p1Pts = match.currentPoints.p1;
    const p2Pts = match.currentPoints.p2;

    if (match.isInTiebreak) {
      p1Score = p1Pts;
      p2Score = p2Pts;
    } else {
      if (p1Pts >= 3 && p2Pts >= 3) {
        if (p1Pts === p2Pts) {
          p1Score = 'DEUCE';
          p2Score = 'DEUCE';
        } else if (p1Pts > p2Pts) {
          p1Score = 'AD';
          p2Score = '';
        } else {
          p1Score = '';
          p2Score = 'AD';
        }
      } else {
        const pointMap = ['0', '15', '30', '40'];
        p1Score = pointMap[Math.min(p1Pts, 3)];
        p2Score = pointMap[Math.min(p2Pts, 3)];
      }
    }
  }

  const p1Serving = match.currentServer === 'p1';
  const p2Serving = match.currentServer === 'p2';
  const p1MatchPoint = isMatchPoint(match, 'p1');
  const p2MatchPoint = isMatchPoint(match, 'p2');
  const p1Leader = leaders.includes(match.players.p1.name);
  const p2Leader = leaders.includes(match.players.p2.name);

  return (
    <div className="sb-root relative flex h-screen w-screen select-none overflow-hidden bg-black">
      <div
        className="sb-panel relative flex flex-col items-center justify-center gap-2"
        style={{ backgroundColor: match.players.p1.color, containerType: 'size' }}
      >
        {p1MatchPoint && <div className="mp-glow absolute inset-0 pointer-events-none" />}
        {p1MatchPoint && (
          <div className="absolute left-1/2 top-[4%] -translate-x-1/2 z-10">
            <span
              className="mp-badge inline-block whitespace-nowrap rounded-full bg-black/30 px-6 py-2 font-black uppercase text-white drop-shadow-lg"
              style={{ fontSize: 'clamp(1.75rem, 9cqw, 4.5rem)', letterSpacing: '0.03em' }}
            >
              Match Point
            </span>
          </div>
        )}
        <div className="relative z-10 text-center">
          <h2 className="font-bold text-white drop-shadow-lg" style={{ fontSize: 'clamp(1.5rem, min(8cqw, 8cqh), 4.5rem)' }}>
            {p1Leader && <span style={{ fontSize: '0.6em' }}>🏆 </span>}
            {match.players.p1.name}
          </h2>
          {p1Serving && (
            <div className="drop-shadow-lg" style={{ fontSize: 'clamp(2.75rem, 16cqmin, 7.5rem)', lineHeight: '1.2' }}>
              {SERVE_ICON[match.sport]}
            </div>
          )}
          {subtitle1 && (
            <p className="text-white drop-shadow-lg" style={{ fontSize: 'clamp(1rem, 3cqh, 1.25rem)' }}>
              {subtitle1}
            </p>
          )}
        </div>
        <div
          className="relative z-10 font-bold text-white drop-shadow-lg"
          style={{ fontSize: scoreFontSize(p1Score), lineHeight: '1' }}
        >
          {p1Score}
        </div>
      </div>

      <div className="sb-divider bg-white"></div>

      <div
        className="sb-panel relative flex flex-col items-center justify-center gap-2"
        style={{ backgroundColor: match.players.p2.color, containerType: 'size' }}
      >
        {p2MatchPoint && <div className="mp-glow absolute inset-0 pointer-events-none" />}
        {p2MatchPoint && (
          <div className="absolute left-1/2 top-[4%] -translate-x-1/2 z-10">
            <span
              className="mp-badge inline-block whitespace-nowrap rounded-full bg-black/30 px-6 py-2 font-black uppercase text-white drop-shadow-lg"
              style={{ fontSize: 'clamp(1.75rem, 9cqw, 4.5rem)', letterSpacing: '0.03em' }}
            >
              Match Point
            </span>
          </div>
        )}
        <div className="relative z-10 text-center">
          <h2 className="font-bold text-white drop-shadow-lg" style={{ fontSize: 'clamp(1.5rem, min(8cqw, 8cqh), 4.5rem)' }}>
            {p2Leader && <span style={{ fontSize: '0.6em' }}>🏆 </span>}
            {match.players.p2.name}
          </h2>
          {p2Serving && (
            <div className="drop-shadow-lg" style={{ fontSize: 'clamp(2.75rem, 16cqmin, 7.5rem)', lineHeight: '1.2' }}>
              {SERVE_ICON[match.sport]}
            </div>
          )}
          {subtitle2 && (
            <p className="text-white drop-shadow-lg" style={{ fontSize: 'clamp(1rem, 3cqh, 1.25rem)' }}>
              {subtitle2}
            </p>
          )}
        </div>
        <div
          className="relative z-10 font-bold text-white drop-shadow-lg"
          style={{ fontSize: scoreFontSize(p2Score), lineHeight: '1' }}
        >
          {p2Score}
        </div>
      </div>

      <style>{`
        @keyframes pulseMatchBadge {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }

        @keyframes pulseMatchGlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.55; }
        }

        .mp-badge { animation: pulseMatchBadge 0.7s ease-in-out infinite; }
        .mp-glow {
          background: radial-gradient(circle at 50% 30%, rgba(255, 215, 0, 0.9) 0%, transparent 70%);
          animation: pulseMatchGlow 0.7s ease-in-out infinite;
        }

        .sb-panel { flex: 1 1 0; }

        @media (orientation: portrait) {
          .sb-root { flex-direction: column; }
          .sb-divider { width: 100%; height: 2px; }
        }

        @media (orientation: landscape) {
          .sb-root { flex-direction: row; }
          .sb-divider { width: 2px; height: 100%; }
        }
      `}</style>
    </div>
  );
}
