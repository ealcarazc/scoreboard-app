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
  const [allPlayers, setAllPlayers] = useState<PlayerInfo[]>(DEFAULT_PLAYERS);
  const [p1, setP1] = useState<PlayerInfo | null>(DEFAULT_PLAYERS[0]);
  const [p2, setP2] = useState<PlayerInfo | null>(DEFAULT_PLAYERS[1]);
  const [p1ColorIdx, setP1ColorIdx] = useState(0);
  const [p2ColorIdx, setP2ColorIdx] = useState(1);
  const [showCustomP1, setShowCustomP1] = useState(false);
  const [showCustomP2, setShowCustomP2] = useState(false);
  const [customNameP1, setCustomNameP1] = useState('');
  const [customNameP2, setCustomNameP2] = useState('');

  const handleAddCustomPlayer = (isP1: boolean, customName: string) => {
    if (!customName.trim()) return;

    const newPlayer: PlayerInfo = {
      id: Date.now().toString(),
      name: customName,
      color: '#999999',
      isFrequent: false,
    };

    setAllPlayers([...allPlayers, newPlayer]);

    if (isP1) {
      setP1(newPlayer);
      setShowCustomP1(false);
      setCustomNameP1('');
      setP1ColorIdx(0);
    } else {
      setP2(newPlayer);
      setShowCustomP2(false);
      setCustomNameP2('');
      setP2ColorIdx(1);
    }
  };

  const handleStartMatch = () => {
    if (p1 && p2 && p1.id !== p2.id) {
      const player1: PlayerInfo = { ...p1, color: COLOR_OPTIONS[p1ColorIdx] };
      const player2: PlayerInfo = { ...p2, color: COLOR_OPTIONS[p2ColorIdx] };
      onSelectPlayers(player1, player2);
    }
  };

  const PlayerSection = ({
    isP1,
    selectedPlayer,
    onSelectPlayer,
    colorIdx,
    onColorChange,
    showCustom,
    setShowCustom,
    customName,
    setCustomName
  }: any) => {
    const title = isP1 ? 'Jugador 1' : 'Jugador 2';

    return (
      <div className="rounded-lg bg-gray-800 p-6">
        <h2 className="mb-4 text-xl font-semibold">{title}</h2>

        {/* Predefined Players */}
        <div className="mb-4 space-y-2">
          {allPlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => onSelectPlayer(player)}
              onTouchEnd={() => onSelectPlayer(player)}
              className={`block w-full rounded px-4 py-2 text-left transition-all ${
                selectedPlayer?.id === player.id
                  ? isP1
                    ? 'bg-blue-600 font-semibold'
                    : 'bg-red-600 font-semibold'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>

        {/* Custom Name Input */}
        {showCustom ? (
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Escribe nombre..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 rounded bg-gray-700 px-3 py-2 text-white placeholder-gray-400 outline-none focus:bg-gray-600"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddCustomPlayer(isP1, customName);
                }
              }}
              autoFocus
            />
            <button
              onClick={() => handleAddCustomPlayer(isP1, customName)}
              className="rounded bg-green-600 px-3 py-2 font-semibold text-white hover:bg-green-700"
            >
              ✓
            </button>
            <button
              onClick={() => setShowCustom(false)}
              className="rounded bg-gray-600 px-3 py-2 font-semibold text-white hover:bg-gray-500"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCustom(true)}
            className="mb-4 w-full rounded bg-indigo-600 px-4 py-2 font-semibold text-white transition-all hover:bg-indigo-700"
          >
            + Nombre Custom
          </button>
        )}

        {/* Colors */}
        <h3 className="mb-2 text-sm font-semibold">Color:</h3>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_OPTIONS.map((color, idx) => (
            <button
              key={color}
              onClick={() => onColorChange(idx)}
              onTouchEnd={() => onColorChange(idx)}
              className={`h-10 rounded transition-all cursor-pointer ${
                colorIdx === idx ? 'ring-2 ring-white' : 'ring-1 ring-gray-600'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 p-6 text-white">
      <h1 className="mb-8 text-center text-4xl font-bold">Elige Jugadores</h1>

      <div className="mb-8 grid grid-cols-2 gap-6">
        <PlayerSection
          isP1={true}
          selectedPlayer={p1}
          onSelectPlayer={setP1}
          colorIdx={p1ColorIdx}
          onColorChange={setP1ColorIdx}
          showCustom={showCustomP1}
          setShowCustom={setShowCustomP1}
          customName={customNameP1}
          setCustomName={setCustomNameP1}
        />

        <PlayerSection
          isP1={false}
          selectedPlayer={p2}
          onSelectPlayer={setP2}
          colorIdx={p2ColorIdx}
          onColorChange={setP2ColorIdx}
          showCustom={showCustomP2}
          setShowCustom={setShowCustomP2}
          customName={customNameP2}
          setCustomName={setCustomNameP2}
        />
      </div>

      <button
        onClick={handleStartMatch}
        onTouchEnd={handleStartMatch}
        disabled={!p1 || !p2 || p1.id === p2.id}
        className="mt-auto rounded-lg bg-green-600 px-6 py-4 text-xl font-bold text-white transition-all active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Comenzar Partido
      </button>
    </div>
  );
}
