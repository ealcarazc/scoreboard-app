'use client';

import React, { useEffect, useState } from 'react';
import type { Match } from '@/types';

interface DisplayModeProps {
  data: string;
}

export function DisplayMode({ data }: DisplayModeProps) {
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const decodedData = decodeURIComponent(data);
      const matchData: Match = JSON.parse(decodedData);
      matchData.startTime = new Date(matchData.startTime);
      if (matchData.endTime) {
        matchData.endTime = new Date(matchData.endTime);
      }
      setMatch(matchData);
      setError(null);
    } catch (err) {
      console.error('Error parsing match data:', err);
      setError(`Error: ${err}`);
    }
  }, [data]);

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
        Cargando marcador...
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

  return (
    <div className="flex h-screen w-screen select-none overflow-hidden bg-black">

      <div className="flex w-1/2 flex-col items-center justify-center gap-2" style={{ backgroundColor: match.players.p1.color }}>
        <div className="text-center">
          <h2 className="font-bold text-white drop-shadow-lg" style={{ fontSize: '64px' }}>
            {match.players.p1.name}
          </h2>
          {p1Serving && <p className="text-5xl text-white drop-shadow-lg">🎾</p>}
          {subtitle1 && <p className="text-xl text-white drop-shadow-lg">{subtitle1}</p>}
        </div>
        <div className="font-bold text-white drop-shadow-lg" style={{ fontSize: '280px', lineHeight: '1' }}>
          {p1Score}
        </div>
      </div>

      <div className="w-2 bg-white"></div>

      <div className="flex w-1/2 flex-col items-center justify-center gap-2" style={{ backgroundColor: match.players.p2.color }}>
        <div className="text-center">
          <h2 className="font-bold text-white drop-shadow-lg" style={{ fontSize: '64px' }}>
            {match.players.p2.name}
          </h2>
          {p2Serving && <p className="text-5xl text-white drop-shadow-lg">🎾</p>}
          {subtitle2 && <p className="text-xl text-white drop-shadow-lg">{subtitle2}</p>}
        </div>
        <div className="font-bold text-white drop-shadow-lg" style={{ fontSize: '280px', lineHeight: '1' }}>
          {p2Score}
        </div>
      </div>
    </div>
  );
}
