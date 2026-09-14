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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--sb-bg)' }}>
      {/* Ambient tint matching the selected sport */}
      <div
        className="fixed inset-0 pointer-events-none transition-colors duration-500"
        style={{
          background: selected
            ? `radial-gradient(circle at 50% 20%, ${hexToRgba(SPORT_COLOR[selected.id], 0.16)} 0%, transparent 60%)`
            : 'transparent',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-14 md:px-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1
            className="mb-2"
            style={{
              fontFamily: 'var(--font-instrument-serif), Newsreader, serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '44px',
              lineHeight: 1.05,
              color: 'var(--sb-text)',
              letterSpacing: '-0.01em',
            }}
          >
            Elige tu deporte
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontSize: '17px',
              color: 'var(--sb-text-secondary)',
            }}
          >
            Toca un deporte para empezar a jugar
          </p>
        </div>

        {/* Sport cards — stacked full-width rows */}
        <div className="mx-auto flex w-full max-w-lg flex-col" style={{ gap: '14px' }}>
          {SPORTS.map((sport) => {
            const isSelected = sport.id === selectedId;
            const color = SPORT_COLOR[sport.id];

            return (
              <button
                key={sport.id}
                onClick={() => setSelectedId(sport.id)}
                type="button"
                className="flex w-full items-center transition-all duration-300 active:scale-[0.97]"
                style={{
                  gap: '16px',
                  backgroundColor: color,
                  borderRadius: '22px',
                  padding: '22px 24px',
                  boxShadow: isSelected
                    ? `0 8px 30px ${hexToRgba(color, 0.45)}, 0 0 0 3px rgba(255,255,255,0.7) inset`
                    : `0 4px 16px ${hexToRgba(color, 0.2)}`,
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <span style={{ fontSize: '40px', lineHeight: 1 }}>{SPORT_ICON[sport.id]}</span>
                <span
                  style={{
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '24px',
                    color: '#FFFFFF',
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
            className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-3"
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
                  borderRadius: '9999px',
                  border: 'none',
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontSize: '15px',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  cursor: 'pointer',
                }}
              >
                {format.label}
              </button>
            ))}
          </div>
        )}

        {/* Footer — ghost pill actions */}
        <div className="mt-auto flex flex-col items-center gap-2 pt-14">
          <button
            onClick={() => setShowStandings(true)}
            className="transition-all active:scale-95"
            style={{
              backgroundColor: 'var(--sb-card-bg)',
              border: '1px solid var(--sb-card-border)',
              borderRadius: '9999px',
              padding: '16px 24px',
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: 'var(--sb-text)',
              width: '100%',
              maxWidth: '320px',
            }}
          >
            🏆 Tabla de sesión
          </button>
          <DriveSyncStatus />
        </div>
      </div>

      <SessionStandingsModal isOpen={showStandings} onClose={() => setShowStandings(false)} />

      <style>{`
        @keyframes formatsIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
