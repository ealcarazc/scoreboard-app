'use client';

import React from 'react';
import type { Sport, Format } from '@/types';

interface SportSelectorProps {
  onSelectSport: (sport: Sport, format: Format) => void;
}

export function SportSelector({ onSelectSport }: SportSelectorProps) {
  const sports = [
    {
      id: 'pingpong',
      name: 'Ping-Pong',
      description: 'Juego a 11 puntos (o 21)',
      formats: [
        { value: '11-points' as Format, label: '11 puntos' },
        { value: '21-points' as Format, label: '21 puntos' },
      ],
    },
    {
      id: 'squash',
      name: 'Squash',
      description: 'Juego a 11 puntos (regla PAR)',
      formats: [
        { value: '11-points' as Format, label: '11 puntos' },
      ],
    },
    {
      id: 'tennis',
      name: 'Tenis',
      description: 'Sets, juegos y desempates',
      formats: [
        { value: 'best-of-3' as Format, label: 'Mejor de 3' },
        { value: 'best-of-5' as Format, label: 'Mejor de 5' },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 p-6 text-white">
      <h1 className="mb-12 text-center text-4xl font-bold">Elige Deporte</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {sports.map((sport) => (
          <div key={sport.id} className="rounded-lg bg-gray-800 p-6">
            <h2 className="mb-2 text-2xl font-bold">{sport.name}</h2>
            <p className="mb-6 text-sm text-gray-400">{sport.description}</p>

            <div className="space-y-2">
              {sport.formats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => onSelectSport(sport.id as Sport, format.value)}
                  className="w-full rounded bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 cursor-pointer"
                  type="button"
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
