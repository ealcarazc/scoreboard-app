'use client';

import React, { useEffect, useRef } from 'react';
import type { Sport, Format } from '@/types';

interface SportSelectorProps {
  onSelectSport: (sport: Sport, format: Format) => void;
}

export function SportSelector({ onSelectSport }: SportSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-white" style={{ backgroundColor: '#F7F6F3' }}>
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
              color: '#111111',
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
            }}
          >
            Elige tu deporte
          </h1>
          <p
            className="text-lg"
            style={{
              color: '#787774',
              fontFamily: "'Geist Sans', sans-serif",
              lineHeight: '1.6',
            }}
          >
            Selecciona el deporte y el formato que deseas jugar
          </p>
        </div>

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
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EAEAEA',
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
                      color: '#111111',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {sport.name}
                  </h2>

                  {/* Description */}
                  <p
                    className="mb-8 flex-grow text-sm leading-relaxed"
                    style={{
                      color: '#787774',
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
                          backgroundColor: '#111111',
                          color: '#FFFFFF',
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
                            '#333333';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                            '#111111';
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
          <p
            className="text-xs"
            style={{
              color: '#EAEAEA',
              fontFamily: "'Geist Mono', monospace",
              letterSpacing: '0.05em',
            }}
          >
            Desarrollado con precisión
          </p>
        </div>
      </div>

      <style>{`
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
