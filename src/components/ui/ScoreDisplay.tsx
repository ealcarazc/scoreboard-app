'use client';

import React from 'react';

interface ScoreDisplayProps {
  p1Name: string;
  p2Name: string;
  p1Score: number | string;
  p2Score: number | string;
  p1Color: string;
  p2Color: string;
  p1Serving?: boolean;
  p2Serving?: boolean;
  subtitle1?: string;
  subtitle2?: string;
  onTapP1: () => void;
  onTapP2: () => void;
}

export function ScoreDisplay({
  p1Name,
  p2Name,
  p1Score,
  p2Score,
  p1Color,
  p2Color,
  p1Serving = false,
  p2Serving = false,
  subtitle1,
  subtitle2,
  onTapP1,
  onTapP2,
}: ScoreDisplayProps) {
  return (
    <div className="flex h-screen w-screen select-none overflow-hidden bg-black">
      {/* Player 1 - Left Side */}
      <button
        onClick={onTapP1}
        className="flex w-1/2 flex-col items-center justify-center gap-2 transition-opacity active:opacity-80"
        style={{ backgroundColor: p1Color }}
      >
        <div className="text-center">
          <h2 className="text-lg font-bold text-white drop-shadow-lg md:text-xl">{p1Name}</h2>
          {p1Serving && <p className="text-xs text-white drop-shadow-lg md:text-sm">Saca *</p>}
          {subtitle1 && <p className="text-xs text-white drop-shadow-lg md:text-sm">{subtitle1}</p>}
        </div>
        <div className="text-6xl font-bold text-white drop-shadow-lg md:text-8xl">{p1Score}</div>
      </button>

      {/* Divider */}
      <div className="w-1 bg-white"></div>

      {/* Player 2 - Right Side */}
      <button
        onClick={onTapP2}
        className="flex w-1/2 flex-col items-center justify-center gap-2 transition-opacity active:opacity-80"
        style={{ backgroundColor: p2Color }}
      >
        <div className="text-center">
          <h2 className="text-lg font-bold text-white drop-shadow-lg md:text-xl">{p2Name}</h2>
          {p2Serving && <p className="text-xs text-white drop-shadow-lg md:text-sm">Saca *</p>}
          {subtitle2 && <p className="text-xs text-white drop-shadow-lg md:text-sm">{subtitle2}</p>}
        </div>
        <div className="text-6xl font-bold text-white drop-shadow-lg md:text-8xl">{p2Score}</div>
      </button>
    </div>
  );
}
