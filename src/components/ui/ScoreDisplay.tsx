'use client';

import React, { useState } from 'react';

// Fluid font-size that also accounts for text length, so wider strings
// like "DEUCE" or "AD" shrink to fit instead of overflowing their panel.
function scoreFontSize(score: number | string): string {
  const length = Math.max(String(score).length, 1);
  const widthFactor = Math.min(72 / length, 40);
  return `clamp(2.5rem, min(${widthFactor}cqw, 45cqh), 15rem)`;
}

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
  p1MatchPoint?: boolean;
  p2MatchPoint?: boolean;
  p1SessionLeader?: boolean;
  p2SessionLeader?: boolean;
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
  p1MatchPoint = false,
  p2MatchPoint = false,
  p1SessionLeader = false,
  p2SessionLeader = false,
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
        className={`relative flex w-1/2 flex-col items-center justify-center gap-2 transition-all active:opacity-80 ${
          flashP1 ? 'brightness-150' : ''
        }`}
        style={{ backgroundColor: p1Color, containerType: 'size' }}
      >
        {p1Serving && (
          <span
            className="absolute left-4 top-4 drop-shadow-lg md:left-6 md:top-6"
            style={{ fontSize: 'clamp(2rem, 12cqmin, 5rem)' }}
          >
            🎾
          </span>
        )}

        {p1MatchPoint && (
          <div className="absolute left-1/2 top-[8%] -translate-x-1/2">
            <span
              className="inline-block whitespace-nowrap rounded-full bg-white/15 px-4 py-1 font-bold text-white drop-shadow-lg"
              style={{ fontSize: 'clamp(0.75rem, 7cqw, 1.75rem)', animation: 'pulseMatchPoint 1s ease-in-out infinite' }}
            >
              MATCH POINT
            </span>
          </div>
        )}

        <div className="text-center">
          <h2
            className="font-bold text-white drop-shadow-lg"
            style={{ fontSize: 'clamp(1.25rem, min(8cqw, 8cqh), 3rem)' }}
          >
            {p1SessionLeader && '🏆 '}
            {p1Name}
          </h2>
          {subtitle1 && (
            <p className="text-white drop-shadow-lg" style={{ fontSize: 'clamp(0.75rem, 2.5cqh, 1.1rem)' }}>
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
      </button>

      {/* Divider */}
      <div className="w-1 bg-white"></div>

      {/* Player 2 - Right Side */}
      <button
        onClick={handleP2Click}
        className={`relative flex w-1/2 flex-col items-center justify-center gap-2 transition-all active:opacity-80 ${
          flashP2 ? 'brightness-150' : ''
        }`}
        style={{ backgroundColor: p2Color, containerType: 'size' }}
      >
        {p2Serving && (
          <span
            className="absolute right-4 top-4 drop-shadow-lg md:right-6 md:top-6"
            style={{ fontSize: 'clamp(2rem, 12cqmin, 5rem)' }}
          >
            🎾
          </span>
        )}

        {p2MatchPoint && (
          <div className="absolute left-1/2 top-[8%] -translate-x-1/2">
            <span
              className="inline-block whitespace-nowrap rounded-full bg-white/15 px-4 py-1 font-bold text-white drop-shadow-lg"
              style={{ fontSize: 'clamp(0.75rem, 7cqw, 1.75rem)', animation: 'pulseMatchPoint 1s ease-in-out infinite' }}
            >
              MATCH POINT
            </span>
          </div>
        )}

        <div className="text-center">
          <h2
            className="font-bold text-white drop-shadow-lg"
            style={{ fontSize: 'clamp(1.25rem, min(8cqw, 8cqh), 3rem)' }}
          >
            {p2SessionLeader && '🏆 '}
            {p2Name}
          </h2>
          {subtitle2 && (
            <p className="text-white drop-shadow-lg" style={{ fontSize: 'clamp(0.75rem, 2.5cqh, 1.1rem)' }}>
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
      </button>

      <style>{`
        @keyframes pulseMatchPoint {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
