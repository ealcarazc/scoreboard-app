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
  const { match, createMatch, addPoint, undo, resetMatch, swapPlayers } = useMatch();

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
      const newMatch = createMatch(selectedSport, lastPlayers.p1, lastPlayers.p2, selectedFormat);
      // Save match ID for display mode
      if (newMatch) {
        localStorage.setItem('currentMatchId', newMatch.id);
      }
    }
  };

  const openDisplayMode = () => {
    if (!match?.id) {
      alert('Error: No match ID');
      return;
    }

    // Store match data in sessionStorage
    const matchData = {
      id: match.id,
      sport: match.sport,
      players: match.players,
      format: match.format,
      currentPoints: match.currentPoints,
      currentGames: match.currentGames,
      currentSets: match.currentSets,
      currentServer: match.currentServer,
      isInTiebreak: match.isInTiebreak,
      startTime: match.startTime.toISOString(),
    };

    sessionStorage.setItem('displayMatch', JSON.stringify(matchData));
    const displayUrl = `${window.location.origin}/display`;
    const newWindow = window.open(displayUrl, 'display', 'width=1024,height=768');
    if (!newWindow) {
      alert(`URL para iPad: ${displayUrl}`);
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
      onSwapPlayers={swapPlayers}
      onOpenDisplay={openDisplayMode}
    />
  );
}
