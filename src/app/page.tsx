'use client';

import { useState } from 'react';
import { SportSelector } from '@/components/ui/SportSelector';
import { PlayerSelector } from '@/components/ui/PlayerSelector';
import { ScoreboardActive } from '@/components/scoreboard/ScoreboardActive';
import { useMatch } from '@/lib/hooks/useMatch';
import type { PlayerInfo, Sport, Format } from '@/types';

type AppState = 'sport-select' | 'player-select' | 'playing';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('sport-select');
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);
  const { match, createMatch, addPoint, undo, resetMatch, swapPlayers } = useMatch();

  const handleSelectSport = (sport: Sport, format: Format) => {
    setSelectedSport(sport);
    setSelectedFormat(format);
    setAppState('player-select');
  };

  const handleSelectPlayers = (p1: PlayerInfo, p2: PlayerInfo) => {
    if (selectedSport && selectedFormat) {
      createMatch(selectedSport, p1, p2, selectedFormat);
      setAppState('playing');
    }
  };

  const handleReset = () => {
    resetMatch();
    setAppState('sport-select');
    setSelectedSport(null);
    setSelectedFormat(null);
  };

  if (appState === 'sport-select') {
    return <SportSelector onSelectSport={handleSelectSport} />;
  }

  if (appState === 'player-select') {
    return <PlayerSelector onSelectPlayers={handleSelectPlayers} />;
  }

  if (!match) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  return (
    <ScoreboardActive
      match={match}
      onAddPoint={addPoint}
      onUndo={undo}
      onReset={handleReset}
      onSwapPlayers={swapPlayers}
    />
  );
}
