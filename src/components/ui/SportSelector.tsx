'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Sport, Format } from '@/types';
import { SessionStandingsModal } from '@/components/scoreboard/SessionStandingsModal';

interface SportSelectorProps {
  onSelectSport: (sport: Sport, format: Format) => void;
}

export function SportSelector({ onSelectSport }: SportSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showStandings, setShowStandings] = useState(false);
  const [quickContinue, setQuickContinue] = useState<{
    sport: Sport;
    format: Format;
    sportName: string;
    formatLabel: string;
  } | null>(null);

  useEffect(() => {
    const savedSport = localStorage.getItem('lastSport') as Sport | null;
    const savedFormat = localStorage.getItem('lastFormat') as Format | null;
    if (!savedSport || !savedFormat) return;

    const sportDef = sports.find((s) => s.id === savedSport);
    const formatDef = sportDef?.formats.find((f) => f.value === savedFormat);
    if (sportDef && formatDef) {
      setQuickContinue({
        sport: savedSport,
        format: savedFormat,
        sportName: sportDef.name,
        formatLabel: formatDef.label,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = containerRef.current?.querySelectorAll('[data-animate]');
    cards?.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const sports = [
    {
      id: 'pingpong',
      name: 'Ping-Pong',
      description: 'Juego acelerado a 11 puntos o 21 puntos. Saque alternado cada 2 puntos.',
      formats: [
        { value: '11-points' as Format, label: '11 puntos' },
        { value: '21-points' as Format, label: '21 puntos' },
      ],
    },
    {
      id: 'squash',
      name: 'Squash',
      description: 'Juego rápido a 11 puntos bajo regla PAR. Cualquiera puede anotar.',
      formats: [
        { value: '11-points' as Format, label: '11 puntos' },
      ],
    },
    {
      id: 'tennis',
      name: 'Tenis',
      description: 'Juego de sets, juegos y desempates. Clásico con lógica de ventaja.',
      formats: [
        { value: 'best-of-3' as Format, label: 'Mejor de 3' },
        { value: 'best-of-5' as Format, label: 'Mejor de 5' },
      ],
    },
  ];

  return (
    <div className="sb-select min-h-screen" style={{ backgroundColor: 'var(--sb-bg)' }}>
      {/* Ambient background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 25% 75%, rgba(191, 144, 84, 0.03) 0%, transparent 50%)',
          animation: 'drift 20s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-16 md:px-12">
        {/* Header */}
        <div className="mb-20 text-center">
          <h1
            className="mb-4 text-5xl md:text-6xl font-light"
            style={{
              fontFamily: "'Instrument Serif', 'Newsreader', serif",
              color: 'var(--sb-text)',
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
            }}
          >
            Elige tu deporte
          </h1>
          <p
            className="text-lg"
            style={{
              color: 'var(--sb-text-secondary)',
              fontFamily: "'Geist Sans', sans-serif",
              lineHeight: '1.6',
            }}
          >
            Selecciona el deporte y el formato que deseas jugar
          </p>
        </div>

        {quickContinue && (
          <div className="mx-auto mb-10 w-full max-w-5xl">
            <button
              onClick={() => onSelectSport(quickContinue.sport, quickContinue.format)}
              className="w-full transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: 'var(--sb-button-bg)',
                color: 'var(--sb-button-text)',
                padding: '18px 24px',
                borderRadius: '10px',
                border: 'none',
                fontFamily: "'Geist Sans', sans-serif",
                fontSize: '16px',
                fontWeight: '600',
                letterSpacing: '0.01em',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              type="button"
            >
              ▶ Continuar: {quickContinue.sportName} · {quickContinue.formatLabel}
            </button>
          </div>
        )}

        {/* Sports Grid - Asymmetric Bento */}
        <div className="mx-auto w-full max-w-5xl">
          <div
            className="grid gap-6 md:gap-8"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            {sports.map((sport, index) => (
              <div
                key={sport.id}
                data-animate
                className="opacity-0 translate-y-3"
                style={{
                  animation: `slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className="group h-full flex flex-col p-8 transition-all duration-200 hover:shadow-sm"
                  style={{
                    backgroundColor: 'var(--sb-card-bg)',
                    border: '1px solid var(--sb-card-border)',
                    borderRadius: '12px',
                    boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      '0 2px 8px rgba(0, 0, 0, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      '0 0 0 0 rgba(0, 0, 0, 0)';
                  }}
                >
                  {/* Sport Name */}
                  <h2
                    className="mb-3 text-2xl font-medium"
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      color: 'var(--sb-text)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {sport.name}
                  </h2>

                  {/* Description */}
                  <p
                    className="mb-8 flex-grow text-sm leading-relaxed"
                    style={{
                      color: 'var(--sb-text-secondary)',
                      fontFamily: "'Geist Sans', sans-serif",
                      lineHeight: '1.6',
                    }}
                  >
                    {sport.description}
                  </p>

                  {/* Format Buttons */}
                  <div className="space-y-3">
                    {sport.formats.map((format) => (
                      <button
                        key={format.value}
                        onClick={() => onSelectSport(sport.id as Sport, format.value)}
                        className="w-full transition-all duration-200 active:scale-95"
                        style={{
                          backgroundColor: 'var(--sb-button-bg)',
                          color: 'var(--sb-button-text)',
                          padding: '12px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          fontFamily: "'Geist Sans', sans-serif",
                          fontSize: '14px',
                          fontWeight: '500',
                          letterSpacing: '0.02em',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                            'var(--sb-button-bg-hover)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                            'var(--sb-button-bg)';
                        }}
                        type="button"
                      >
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setShowStandings(true)}
            className="mb-3 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--sb-text-secondary)', fontFamily: "'Geist Sans', sans-serif" }}
          >
            🏆 Tabla de sesión
          </button>
          <p
            className="text-xs"
            style={{
              color: 'var(--sb-text-faint)',
              fontFamily: "'Geist Mono', monospace",
              letterSpacing: '0.05em',
            }}
          >
            Desarrollado con precisión
          </p>
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
          --sb-button-bg: #111111;
          --sb-button-bg-hover: #333333;
          --sb-button-text: #FFFFFF;
        }

        @media (prefers-color-scheme: dark) {
          .sb-select {
            --sb-bg: #0A0A0A;
            --sb-text: #F5F5F5;
            --sb-text-secondary: #9B9B98;
            --sb-text-faint: #333333;
            --sb-card-bg: #161616;
            --sb-card-border: #2A2A2A;
            --sb-button-bg: #F5F5F5;
            --sb-button-bg-hover: #FFFFFF;
            --sb-button-text: #111111;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes drift {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(20px, -20px);
          }
          50% {
            transform: translate(0, 20px);
          }
          75% {
            transform: translate(-20px, -10px);
          }
        }

        [data-animate].animate-in {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @supports (font-variation-settings: normal) {
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
              'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
              'Helvetica Neue', sans-serif;
          }
        }
      `}</style>
    </div>
  );
}
