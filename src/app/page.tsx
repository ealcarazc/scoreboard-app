'use client';

import { useState, useEffect } from 'react';
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
  const [lastPlayers, setLastPlayers] = useState<{ p1: PlayerInfo; p2: PlayerInfo } | null>(null);
  const { match, createMatch, addPoint, undo, resetMatch } = useMatch();

  // Load sticky sport from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lastSport');
    const savedFormat = localStorage.getItem('lastFormat');
    if (saved && savedFormat) {
      setSelectedSport(saved as Sport);
      setSelectedFormat(savedFormat as Format);
    }
  }, []);

  const handleSelectSport = (sport: Sport, format: Format) => {
    setSelectedSport(sport);
    setSelectedFormat(format);
    localStorage.setItem('lastSport', sport);
    localStorage.setItem('lastFormat', format);
    setAppState('player-select');
  };

  const handleSelectPlayers = (p1: PlayerInfo, p2: PlayerInfo) => {
    if (selectedSport && selectedFormat) {
      setLastPlayers({ p1, p2 });
      createMatch(selectedSport, p1, p2, selectedFormat);
      setAppState('playing');
    }
  };

  const handleNewMatch = () => {
    if (lastPlayers && selectedSport && selectedFormat) {
      createMatch(selectedSport, lastPlayers.p1, lastPlayers.p2, selectedFormat);
    }
  };

  const handleBackToMenu = () => {
    resetMatch();
    setAppState('sport-select');
    setSelectedSport(null);
    setSelectedFormat(null);
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
      onNewMatch={handleNewMatch}
      onBackToMenu={handleBackToMenu}
    />
  );
}
