'use client';

import React, { useEffect, useState } from 'react';
import type { Match } from '@/types';
import { isMatchPoint } from '@/game/matchPoint';
import { getSessionStats, getSessionLeaders } from '@/lib/sessionStats';

// Fluid font-size that also accounts for text length, so wider strings
// like "DEUCE" or "AD" shrink to fit instead of overflowing their panel.
function scoreFontSize(score: number | string): string {
  const length = Math.max(String(score).length, 1);
  const widthFactor = Math.min(72 / length, 40);
  return `clamp(3rem, min(${widthFactor}cqw, 45cqh), 18rem)`;
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
    <div className="flex h-screen w-screen select-none overflow-hidden bg-black">
      <div
        className="relative flex w-1/2 flex-col items-center justify-center gap-2"
        style={{ backgroundColor: match.players.p1.color, containerType: 'size' }}
      >
        {p1Serving && (
          <span className="absolute left-6 top-6 drop-shadow-lg" style={{ fontSize: 'clamp(2.5rem, 12cqmin, 6rem)' }}>
            🎾
          </span>
        )}
        {p1MatchPoint && (
          <div className="absolute left-1/2 top-[8%] -translate-x-1/2">
            <span
              className="inline-block whitespace-nowrap rounded-full bg-white/15 px-6 py-2 font-bold text-white drop-shadow-lg"
              style={{ fontSize: 'clamp(1.25rem, 7cqw, 3rem)', animation: 'pulseMatchPoint 1s ease-in-out infinite' }}
            >
              MATCH POINT
            </span>
          </div>
        )}
        <div className="text-center">
          <h2 className="font-bold text-white drop-shadow-lg" style={{ fontSize: 'clamp(1.5rem, min(8cqw, 8cqh), 4rem)' }}>
            {p1Leader && '🏆 '}
            {match.players.p1.name}
          </h2>
          {subtitle1 && (
            <p className="text-white drop-shadow-lg" style={{ fontSize: 'clamp(1rem, 3cqh, 1.25rem)' }}>
              {subtitle1}
            </p>
          )}
        </div>
        <div
          className="font-bold text-white drop-shadow-lg"
          style={{ fontSize: scoreFontSize(p1Score), lineHeight: '1' }}
        >
          {p1Score}
        </div>
      </div>

      <div className="w-2 bg-white"></div>

      <div
        className="relative flex w-1/2 flex-col items-center justify-center gap-2"
        style={{ backgroundColor: match.players.p2.color, containerType: 'size' }}
      >
        {p2Serving && (
          <span className="absolute right-6 top-6 drop-shadow-lg" style={{ fontSize: 'clamp(2.5rem, 12cqmin, 6rem)' }}>
            🎾
          </span>
        )}
        {p2MatchPoint && (
          <div className="absolute left-1/2 top-[8%] -translate-x-1/2">
            <span
              className="inline-block whitespace-nowrap rounded-full bg-white/15 px-6 py-2 font-bold text-white drop-shadow-lg"
              style={{ fontSize: 'clamp(1.25rem, 7cqw, 3rem)', animation: 'pulseMatchPoint 1s ease-in-out infinite' }}
            >
              MATCH POINT
            </span>
          </div>
        )}
        <div className="text-center">
          <h2 className="font-bold text-white drop-shadow-lg" style={{ fontSize: 'clamp(1.5rem, min(8cqw, 8cqh), 4rem)' }}>
            {p2Leader && '🏆 '}
            {match.players.p2.name}
          </h2>
          {subtitle2 && (
            <p className="text-white drop-shadow-lg" style={{ fontSize: 'clamp(1rem, 3cqh, 1.25rem)' }}>
              {subtitle2}
            </p>
          )}
        </div>
        <div
          className="font-bold text-white drop-shadow-lg"
          style={{ fontSize: scoreFontSize(p2Score), lineHeight: '1' }}
        >
          {p2Score}
        </div>
      </div>

      <style>{`
        @keyframes pulseMatchPoint {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
