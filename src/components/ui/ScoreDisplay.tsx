'use client';

import React, { useRef, useState } from 'react';
import type { Sport } from '@/types';
import { SERVE_ICON } from '@/lib/sportIcons';

// Fluid font-size that also accounts for text length, so wider strings
// like "DEUCE" or "AD" shrink to fit instead of overflowing their panel.
function scoreFontSize(score: number | string): string {
  const length = Math.max(String(score).length, 1);
  const widthFactor = Math.min(72 / length, 50);
  return `clamp(2.5rem, min(${widthFactor}cqw, 45cqh), 18rem)`;
}

const DOUBLE_TAP_WINDOW_MS = 300;
const ACE_FLASH_MS = 700;

interface ScoreDisplayProps {
  sport: Sport;
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
  onTapP1: (isAce?: boolean) => void;
  onTapP2: (isAce?: boolean) => void;
}

export function ScoreDisplay({
  sport,
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
  const [aceFlashP1, setAceFlashP1] = useState(false);
  const [aceFlashP2, setAceFlashP2] = useState(false);

  const p1LastTap = useRef(0);
  const p1PendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const p2LastTap = useRef(0);
  const p2PendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleP1Click = () => {
    setFlashP1(true);
    setTimeout(() => setFlashP1(false), 150);

    const now = Date.now();
    if (now - p1LastTap.current < DOUBLE_TAP_WINDOW_MS) {
      if (p1PendingTimer.current) {
        clearTimeout(p1PendingTimer.current);
        p1PendingTimer.current = null;
      }
      setAceFlashP1(true);
      setTimeout(() => setAceFlashP1(false), ACE_FLASH_MS);
      onTapP1(true);
    } else {
      p1PendingTimer.current = setTimeout(() => {
        onTapP1(false);
        p1PendingTimer.current = null;
      }, DOUBLE_TAP_WINDOW_MS);
    }
    p1LastTap.current = now;
  };

  const handleP2Click = () => {
    setFlashP2(true);
    setTimeout(() => setFlashP2(false), 150);

    const now = Date.now();
    if (now - p2LastTap.current < DOUBLE_TAP_WINDOW_MS) {
      if (p2PendingTimer.current) {
        clearTimeout(p2PendingTimer.current);
        p2PendingTimer.current = null;
      }
      setAceFlashP2(true);
      setTimeout(() => setAceFlashP2(false), ACE_FLASH_MS);
      onTapP2(true);
    } else {
      p2PendingTimer.current = setTimeout(() => {
        onTapP2(false);
        p2PendingTimer.current = null;
      }, DOUBLE_TAP_WINDOW_MS);
    }
    p2LastTap.current = now;
  };

  return (
    <div className="sb-root relative flex h-full w-full select-none overflow-hidden bg-black">
      {/* Player 1 */}
      <button
        onClick={handleP1Click}
        className={`sb-panel relative flex flex-col items-center justify-center gap-2 transition-all active:opacity-80 ${
          flashP1 ? 'brightness-150' : ''
        }`}
        style={{ backgroundColor: p1Color, containerType: 'size' }}
      >
        {p1MatchPoint && (
          <div className="mp-glow absolute inset-0 pointer-events-none" />
        )}

        {p1MatchPoint && (
          <div className="absolute left-1/2 top-[4%] -translate-x-1/2 z-10">
            <span
              className="mp-badge inline-block whitespace-nowrap rounded-full bg-black/30 px-5 py-2 font-black uppercase text-white drop-shadow-lg"
              style={{ fontSize: 'clamp(1.5rem, 10cqw, 4rem)', letterSpacing: '0.03em' }}
            >
              Match Point
            </span>
          </div>
        )}

        {aceFlashP1 && (
          <div className="absolute left-1/2 top-[4%] -translate-x-1/2 z-20">
            <span
              className="ace-badge inline-block whitespace-nowrap rounded-full bg-white/90 px-5 py-2 font-black uppercase text-black drop-shadow-lg"
              style={{ fontSize: 'clamp(1.25rem, 9cqw, 3.5rem)', letterSpacing: '0.03em' }}
            >
              ⚡ Ace!
            </span>
          </div>
        )}

        <div className="relative z-10 text-center">
          <h2
            className="font-bold text-white drop-shadow-lg"
            style={{ fontSize: 'clamp(1.25rem, min(8cqw, 8cqh), 3.5rem)' }}
          >
            {p1SessionLeader && <span style={{ fontSize: '0.6em' }}>🏆 </span>}
            {p1Name}
          </h2>
          {p1Serving && (
            <div className="drop-shadow-lg" style={{ fontSize: 'clamp(2.25rem, 16cqmin, 6.5rem)', lineHeight: '1.2' }}>
              {SERVE_ICON[sport]}
            </div>
          )}
          {subtitle1 && (
            <p className="text-white drop-shadow-lg" style={{ fontSize: 'clamp(0.75rem, 2.5cqh, 1.1rem)' }}>
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
      </button>

      {/* Divider */}
      <div className="sb-divider bg-white"></div>

      {/* Player 2 */}
      <button
        onClick={handleP2Click}
        className={`sb-panel relative flex flex-col items-center justify-center gap-2 transition-all active:opacity-80 ${
          flashP2 ? 'brightness-150' : ''
        }`}
        style={{ backgroundColor: p2Color, containerType: 'size' }}
      >
        {p2MatchPoint && (
          <div className="mp-glow absolute inset-0 pointer-events-none" />
        )}

        {p2MatchPoint && (
          <div className="absolute left-1/2 top-[4%] -translate-x-1/2 z-10">
            <span
              className="mp-badge inline-block whitespace-nowrap rounded-full bg-black/30 px-5 py-2 font-black uppercase text-white drop-shadow-lg"
              style={{ fontSize: 'clamp(1.5rem, 10cqw, 4rem)', letterSpacing: '0.03em' }}
            >
              Match Point
            </span>
          </div>
        )}

        {aceFlashP2 && (
          <div className="absolute left-1/2 top-[4%] -translate-x-1/2 z-20">
            <span
              className="ace-badge inline-block whitespace-nowrap rounded-full bg-white/90 px-5 py-2 font-black uppercase text-black drop-shadow-lg"
              style={{ fontSize: 'clamp(1.25rem, 9cqw, 3.5rem)', letterSpacing: '0.03em' }}
            >
              ⚡ Ace!
            </span>
          </div>
        )}

        <div className="relative z-10 text-center">
          <h2
            className="font-bold text-white drop-shadow-lg"
            style={{ fontSize: 'clamp(1.25rem, min(8cqw, 8cqh), 3.5rem)' }}
          >
            {p2SessionLeader && <span style={{ fontSize: '0.6em' }}>🏆 </span>}
            {p2Name}
          </h2>
          {p2Serving && (
            <div className="drop-shadow-lg" style={{ fontSize: 'clamp(2.25rem, 16cqmin, 6.5rem)', lineHeight: '1.2' }}>
              {SERVE_ICON[sport]}
            </div>
          )}
          {subtitle2 && (
            <p className="text-white drop-shadow-lg" style={{ fontSize: 'clamp(0.75rem, 2.5cqh, 1.1rem)' }}>
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
      </button>

      <style>{`
        @keyframes pulseMatchBadge {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }

        @keyframes pulseMatchGlow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.55; }
        }

        @keyframes aceBadgeIn {
          0% { opacity: 0; transform: translateX(-50%) scale(0.6); }
          15% { opacity: 1; transform: translateX(-50%) scale(1.1); }
          25% { transform: translateX(-50%) scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }

        .mp-badge { animation: pulseMatchBadge 0.7s ease-in-out infinite; }
        .mp-glow {
          background: radial-gradient(circle at 50% 30%, rgba(255, 215, 0, 0.9) 0%, transparent 70%);
          animation: pulseMatchGlow 0.7s ease-in-out infinite;
        }
        .ace-badge { animation: aceBadgeIn 0.7s ease-out forwards; }

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
