'use client';

import React, { useEffect, useState } from 'react';
import type { PlayerInfo, Sport } from '@/types';
import { getRecentPairs, RECENT_PAIRS_SHOWN, type RecentPair } from '@/lib/recentPairs';
import { SPORT_ICON, SPORT_COLOR, SPORT_NAME } from '@/lib/sportIcons';

const DEFAULT_PLAYERS = [
  { id: '1', name: 'Ernesto', color: '#3b82f6' },
  { id: '3', name: 'Lila', color: '#8b5cf6' },
  { id: '4', name: 'Maia', color: '#f59e0b' },
  { id: '2', name: 'Liz', color: '#ef4444' },
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
  sport: Sport;
  onSelectPlayers: (p1: PlayerInfo, p2: PlayerInfo) => void;
  onBack: () => void;
}

interface SlotProps {
  label: string;
  name: string;
  setName: (name: string) => void;
  color: string;
  setColor: (color: string) => void;
  opponentName: string;
}

function PlayerSlot({ label, name, setName, color, setColor, opponentName }: SlotProps) {
  return (
    <div>
      <h3
        className="mb-2"
        style={{
          fontFamily: 'var(--font-geist-sans), sans-serif',
          fontWeight: 600,
          fontSize: '13px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: 'var(--sb-text-secondary)',
        }}
      >
        {label}
      </h3>

      {/* Predefined chips */}
      <div
        className="mb-3 grid"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}
      >
        {DEFAULT_PLAYERS.map((player) => {
          const isSelected = name === player.name;
          const isTakenByOpponent = player.name === opponentName;

          return (
            <button
              key={player.id}
              type="button"
              onClick={() => {
                if (isTakenByOpponent) return;
                setName(player.name);
                setColor(player.color);
              }}
              disabled={isTakenByOpponent}
              className="flex items-center transition-all active:scale-95"
              style={{
                gap: '8px',
                padding: '12px 14px',
                borderRadius: '9999px',
                backgroundColor: 'var(--sb-card-bg)',
                border: isSelected ? `2px solid ${player.color}` : '1px solid var(--sb-card-border)',
                opacity: isTakenByOpponent ? 0.4 : 1,
                cursor: isTakenByOpponent ? 'not-allowed' : 'pointer',
              }}
            >
              <span
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '9999px',
                  backgroundColor: player.color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-geist-sans), sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: 'var(--sb-text)',
                }}
              >
                {player.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Editable name field */}
      <div
        className="mb-3 flex items-center"
        style={{
          gap: '10px',
          borderRadius: '16px',
          border: '1px solid var(--sb-card-border)',
          backgroundColor: 'var(--sb-card-bg)',
          padding: '10px 14px',
        }}
      >
        <span
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '9999px',
            backgroundColor: color,
            flexShrink: 0,
          }}
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del jugador"
          className="flex-1 bg-transparent outline-none"
          style={{
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            color: 'var(--sb-text)',
          }}
        />
      </div>

      {/* Color swatches */}
      <div className="flex flex-wrap" style={{ gap: '10px' }}>
        {COLOR_OPTIONS.map((c) => {
          const active = color === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="transition-all active:scale-90"
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '9999px',
                backgroundColor: c,
                boxShadow: active ? `0 0 0 3px var(--sb-bg), 0 0 0 5px var(--sb-text)` : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function PlayerSelector({ sport, onSelectPlayers, onBack }: PlayerSelectorProps) {
  const [p1Name, setP1Name] = useState(DEFAULT_PLAYERS[0].name);
  const [p1Color, setP1Color] = useState(DEFAULT_PLAYERS[0].color);
  const [p2Name, setP2Name] = useState(DEFAULT_PLAYERS[1].name);
  const [p2Color, setP2Color] = useState(DEFAULT_PLAYERS[1].color);
  const [recentPairs, setRecentPairs] = useState<RecentPair[]>([]);

  useEffect(() => {
    setRecentPairs(getRecentPairs().slice(0, RECENT_PAIRS_SHOWN));
  }, []);

  const handleQuickSelect = (pair: RecentPair) => {
    const player1: PlayerInfo = {
      id: `recent-${pair.player1.name}`,
      name: pair.player1.name,
      color: pair.player1.color,
      isFrequent: false,
    };
    const player2: PlayerInfo = {
      id: `recent-${pair.player2.name}`,
      name: pair.player2.name,
      color: pair.player2.color,
      isFrequent: false,
    };
    onSelectPlayers(player1, player2);
  };

  const canStart =
    p1Name.trim().length > 0 &&
    p2Name.trim().length > 0 &&
    p1Name.trim().toLowerCase() !== p2Name.trim().toLowerCase();

  const handleStartMatch = () => {
    if (!canStart) return;
    const matchDefault = (n: string) => DEFAULT_PLAYERS.find((d) => d.name === n);

    const player1: PlayerInfo = {
      id: matchDefault(p1Name)?.id ?? `custom-${p1Name}`,
      name: p1Name.trim(),
      color: p1Color,
      isFrequent: !!matchDefault(p1Name),
    };
    const player2: PlayerInfo = {
      id: matchDefault(p2Name)?.id ?? `custom-${p2Name}`,
      name: p2Name.trim(),
      color: p2Color,
      isFrequent: !!matchDefault(p2Name),
    };
    onSelectPlayers(player1, player2);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--sb-bg)' }}>
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-6 py-10">
        {/* Header */}
        <div className="mb-6 flex items-center" style={{ gap: '14px' }}>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center transition-all active:scale-90"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '9999px',
              backgroundColor: 'var(--sb-card-bg)',
              border: '1px solid var(--sb-card-border)',
              color: 'var(--sb-text)',
              fontSize: '18px',
            }}
          >
            ←
          </button>
          <span style={{ fontSize: '28px', lineHeight: 1 }}>{SPORT_ICON[sport]}</span>
          <span
            style={{
              fontFamily: 'var(--font-geist-sans), sans-serif',
              fontWeight: 700,
              fontSize: '22px',
              color: 'var(--sb-text)',
            }}
          >
            {SPORT_NAME[sport]}
          </span>
        </div>

        <h1
          className="mb-6"
          style={{
            fontFamily: 'var(--font-instrument-serif), Newsreader, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: '34px',
            lineHeight: 1.05,
            color: 'var(--sb-text)',
          }}
        >
          Elige jugadores
        </h1>

        {recentPairs.length > 0 && (
          <div className="mb-6">
            <h3
              className="mb-2"
              style={{
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--sb-text-secondary)',
              }}
            >
              ⚡ Parejas recientes
            </h3>
            <div className="flex flex-wrap" style={{ gap: '8px' }}>
              {recentPairs.map((pair, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickSelect(pair)}
                  className="flex items-center transition-all active:scale-95"
                  style={{
                    gap: '8px',
                    borderRadius: '9999px',
                    border: '1px solid var(--sb-card-border)',
                    backgroundColor: 'var(--sb-card-bg)',
                    padding: '10px 16px',
                    fontFamily: 'var(--font-geist-sans), sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--sb-text)',
                  }}
                >
                  <span
                    style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: pair.player1.color }}
                  />
                  {pair.player1.name} vs {pair.player2.name}
                  <span
                    style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: pair.player2.color }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col" style={{ gap: '28px' }}>
          <PlayerSlot
            label="Jugador 1"
            name={p1Name}
            setName={setP1Name}
            color={p1Color}
            setColor={setP1Color}
            opponentName={p2Name}
          />
          <PlayerSlot
            label="Jugador 2"
            name={p2Name}
            setName={setP2Name}
            color={p2Color}
            setColor={setP2Color}
            opponentName={p1Name}
          />
        </div>

        <button
          type="button"
          onClick={handleStartMatch}
          disabled={!canStart}
          className="mt-10 w-full transition-all active:scale-[0.98] disabled:opacity-40"
          style={{
            padding: '18px',
            borderRadius: '9999px',
            backgroundColor: SPORT_COLOR[sport],
            color: '#FFFFFF',
            fontFamily: 'var(--font-geist-sans), sans-serif',
            fontWeight: 800,
            fontSize: '18px',
            border: 'none',
          }}
        >
          Empezar partido
        </button>
      </div>
    </div>
  );
}
