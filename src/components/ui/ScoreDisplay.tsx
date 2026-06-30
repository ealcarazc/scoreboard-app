'use client';

import React, { useState } from 'react';

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
  const [flashP1, setFlashP1] = useState(false);
  const [flashP2, setFlashP2] = useState(false);

  const handleP1Click = () => {
    setFlashP1(true);
    setTimeout(() => setFlashP1(false), 150);
    onTapP1();
  };

  const handleP2Click = () => {
    setFlashP2(true);
    setTimeout(() => setFlashP2(false), 150);
    onTapP2();
  };

  return (
    <div className="flex h-screen w-screen select-none overflow-hidden bg-black">
      {/* Player 1 - Left Side */}
      <button
        onClick={handleP1Click}
        className={`flex w-1/2 flex-col items-center justify-center gap-2 transition-all active:opacity-80 ${
          flashP1 ? 'brightness-150' : ''
        }`}
        style={{ backgroundColor: p1Color }}
      >
        <div className="text-center">
          <h2 className="font-bold text-white drop-shadow-lg" style={{ fontSize: '48px' }}>{p1Name}</h2>
          {p1Serving && <p className="text-3xl text-white drop-shadow-lg">🎾</p>}
          {subtitle1 && <p className="text-sm text-white drop-shadow-lg md:text-base">{subtitle1}</p>}
        </div>
        <div className="font-bold text-white drop-shadow-lg" style={{ fontSize: '200px', lineHeight: '1' }}>{p1Score}</div>
      </button>

      {/* Divider */}
      <div className="w-1 bg-white"></div>

      {/* Player 2 - Right Side */}
      <button
        onClick={handleP2Click}
        className={`flex w-1/2 flex-col items-center justify-center gap-2 transition-all active:opacity-80 ${
          flashP2 ? 'brightness-150' : ''
        }`}
        style={{ backgroundColor: p2Color }}
      >
        <div className="text-center">
          <h2 className="font-bold text-white drop-shadow-lg" style={{ fontSize: '48px' }}>{p2Name}</h2>
          {p2Serving && <p className="text-3xl text-white drop-shadow-lg">🎾</p>}
          {subtitle2 && <p className="text-sm text-white drop-shadow-lg md:text-base">{subtitle2}</p>}
        </div>
        <div className="font-bold text-white drop-shadow-lg" style={{ fontSize: '200px', lineHeight: '1' }}>{p2Score}</div>
      </button>
    </div>
  );
}
