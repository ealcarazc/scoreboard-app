'use client';

import React, { useEffect, useState } from 'react';
import type { Sport, Format } from '@/types';
import { SessionStandingsModal } from '@/components/scoreboard/SessionStandingsModal';
import { DriveSyncStatus } from '@/components/ui/DriveSyncStatus';
import { SPORT_ICON, SPORT_COLOR, SPORT_NAME } from '@/lib/sportIcons';

interface SportSelectorProps {
  onSelectSport: (sport: Sport, format: Format) => void;
}

interface SportDef {
  id: Sport;
  formats: { value: Format; label: string }[];
}

const SPORTS: SportDef[] = [
  {
    id: 'tennis',
    formats: [
      { value: 'best-of-3', label: 'Mejor de 3' },
      { value: 'best-of-5', label: 'Mejor de 5' },
    ],
  },
  {
    id: 'pingpong',
    formats: [
      { value: '11-points', label: '11 puntos' },
      { value: '21-points', label: '21 puntos' },
    ],
  },
  {
    id: 'squash',
    formats: [{ value: '11-points', label: '11 puntos' }],
  },
];

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function SportSelector({ onSelectSport }: SportSelectorProps) {
  const [showStandings, setShowStandings] = useState(false);
  const [selectedId, setSelectedId] = useState<Sport | null>(null);

  useEffect(() => {
    const savedSport = localStorage.getItem('lastSport') as Sport | null;
    if (savedSport && SPORTS.some((s) => s.id === savedSport)) {
      setSelectedId(savedSport);
    }
  }, []);

  const selected = SPORTS.find((s) => s.id === selectedId) || null;

  return (
    <div className="sb-select min-h-screen" style={{ backgroundColor: 'var(--sb-bg)' }}>
      {/* Ambient tint matching the selected sport */}
      <div
        className="fixed inset-0 pointer-events-none transition-colors duration-500"
        style={{
          background: selected
            ? `radial-gradient(circle at 50% 20%, ${hexToRgba(SPORT_COLOR[selected.id], 0.16)} 0%, transparent 60%)`
            : 'transparent',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-16 md:px-12">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1
            className="mb-2 text-5xl md:text-6xl font-light"
            style={{
              fontFamily: "var(--font-instrument-serif), 'Newsreader', serif",
              color: 'var(--sb-text)',
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
            }}
          >
            Elige tu deporte
          </h1>
        </div>

        {/* Sport Cards */}
        <div className="mx-auto w-full max-w-4xl">
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {SPORTS.map((sport) => {
              const isSelected = sport.id === selectedId;
              const color = SPORT_COLOR[sport.id];

              return (
                <button
                  key={sport.id}
                  onClick={() => setSelectedId(sport.id)}
                  type="button"
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl p-6 transition-all duration-300 active:scale-95 md:p-10"
                  style={{
                    backgroundColor: isSelected ? color : 'var(--sb-card-bg)',
                    border: `2px solid ${isSelected ? color : 'var(--sb-card-border)'}`,
                    boxShadow: isSelected ? `0 8px 30px ${hexToRgba(color, 0.4)}` : 'none',
                    transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  <span style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', lineHeight: 1 }}>
                    {SPORT_ICON[sport.id]}
                  </span>
                  <span
                    className="text-sm font-semibold md:text-base"
                    style={{
                      color: isSelected ? '#FFFFFF' : 'var(--sb-text)',
                      fontFamily: "var(--font-geist-sans), sans-serif",
                    }}
                  >
                    {SPORT_NAME[sport.id]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Format picker for the selected sport */}
          {selected && (
            <div
              className="mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-3"
              style={{ animation: 'formatsIn 0.3s ease forwards' }}
            >
              {selected.formats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => onSelectSport(selected.id, format.value)}
                  type="button"
                  className="transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor: SPORT_COLOR[selected.id],
                    color: '#FFFFFF',
                    padding: '14px 28px',
                    borderRadius: '10px',
                    border: 'none',
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: '15px',
                    fontWeight: '600',
                    letterSpacing: '0.01em',
                    cursor: 'pointer',
                  }}
                >
                  {format.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="mt-auto flex flex-col items-center gap-3 pt-16 text-center">
          <button
            onClick={() => setShowStandings(true)}
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--sb-text-secondary)', fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            🏆 Tabla de sesión
          </button>
          <DriveSyncStatus />
        </div>
      </div>

      <SessionStandingsModal isOpen={showStandings} onClose={() => setShowStandings(false)} />

      <style>{`
        .sb-select {
          --sb-bg: #F7F6F3;
          --sb-text: #111111;
          --sb-text-secondary: #787774;
          --sb-text-faint: #EAEAEA;
          --sb-card-bg: #FFFFFF;
          --sb-card-border: #EAEAEA;
        }

        @media (prefers-color-scheme: dark) {
          .sb-select {
            --sb-bg: #0A0A0A;
            --sb-text: #F5F5F5;
            --sb-text-secondary: #9B9B98;
            --sb-text-faint: #333333;
            --sb-card-bg: #161616;
            --sb-card-border: #2A2A2A;
          }
        }

        @keyframes formatsIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
