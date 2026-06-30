'use client';

import React, { useState } from 'react';
import type { PlayerInfo } from '@/types';

const DEFAULT_PLAYERS = [
  { id: '1', name: 'Ernesto', color: '#3b82f6', isFrequent: true },
  { id: '2', name: 'Liz', color: '#ef4444', isFrequent: true },
  { id: '3', name: 'Lila', color: '#8b5cf6', isFrequent: true },
  { id: '4', name: 'Maia', color: '#f59e0b', isFrequent: true },
];

const COLOR_OPTIONS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#22c55e', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#6366f1', // indigo
];

interface PlayerSelectorProps {
  onSelectPlayers: (p1: PlayerInfo, p2: PlayerInfo) => void;
}

export function PlayerSelector({ onSelectPlayers }: PlayerSelectorProps) {
  const [p1, setP1] = useState<PlayerInfo | null>(DEFAULT_PLAYERS[0]);
  const [p2, setP2] = useState<PlayerInfo | null>(DEFAULT_PLAYERS[1]);
  const [p1ColorIdx, setP1ColorIdx] = useState(0);
  const [p2ColorIdx, setP2ColorIdx] = useState(1);

  const handleStartMatch = () => {
    if (p1 && p2) {
      const player1: PlayerInfo = { ...p1, color: COLOR_OPTIONS[p1ColorIdx] };
      const player2: PlayerInfo = { ...p2, color: COLOR_OPTIONS[p2ColorIdx] };
      onSelectPlayers(player1, player2);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 p-6 text-white">
      <h1 className="mb-8 text-center text-4xl font-bold">Ping-Pong</h1>

      <div className="mb-8 grid grid-cols-2 gap-6">
        {/* Player 1 Selection */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold">Jugador 1</h2>
          <div className="mb-4 space-y-2">
            {DEFAULT_PLAYERS.map((player) => (
              <button
                key={player.id}
                onClick={() => setP1(player)}
                className={`block w-full rounded px-4 py-2 text-left transition-all ${
                  p1?.id === player.id ? 'bg-blue-600 font-semibold' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {player.name}
              </button>
            ))}
          </div>

          <h3 className="mb-2 text-sm font-semibold">Color:</h3>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_OPTIONS.map((color, idx) => (
              <button
                key={color}
                onClick={() => setP1ColorIdx(idx)}
                className={`h-10 rounded transition-all ${
                  p1ColorIdx === idx ? 'ring-2 ring-white' : 'ring-1 ring-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Player 2 Selection */}
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold">Jugador 2</h2>
          <div className="mb-4 space-y-2">
            {DEFAULT_PLAYERS.map((player) => (
              <button
                key={player.id}
                onClick={() => setP2(player)}
                className={`block w-full rounded px-4 py-2 text-left transition-all ${
                  p2?.id === player.id ? 'bg-red-600 font-semibold' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {player.name}
              </button>
            ))}
          </div>

          <h3 className="mb-2 text-sm font-semibold">Color:</h3>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_OPTIONS.map((color, idx) => (
              <button
                key={color}
                onClick={() => setP2ColorIdx(idx)}
                className={`h-10 rounded transition-all ${
                  p2ColorIdx === idx ? 'ring-2 ring-white' : 'ring-1 ring-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleStartMatch}
        disabled={!p1 || !p2 || p1.id === p2.id}
        className="mt-auto rounded-lg bg-green-600 px-6 py-4 text-xl font-bold text-white transition-all active:scale-95 disabled:opacity-50"
      >
        Comenzar Partido
      </button>
    </div>
  );
}
