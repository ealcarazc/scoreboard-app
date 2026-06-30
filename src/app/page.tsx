'use client';

import { useState } from 'react';
import { PlayerSelector } from '@/components/ui/PlayerSelector';
import { ScoreboardActive } from '@/components/scoreboard/ScoreboardActive';
import { useMatch } from '@/lib/hooks/useMatch';
import type { PlayerInfo } from '@/types';

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  const { match, createMatch, addPoint, undo, resetMatch } = useMatch();

  const handleSelectPlayers = (p1: PlayerInfo, p2: PlayerInfo) => {
    createMatch('pingpong', p1, p2, '11-points');
    setGameStarted(true);
  };

  const handleReset = () => {
    resetMatch();
    setGameStarted(false);
  };

  if (!gameStarted || !match) {
    return <PlayerSelector onSelectPlayers={handleSelectPlayers} />;
  }

  return (
    <ScoreboardActive
      match={match}
      onAddPoint={addPoint}
      onUndo={undo}
      onReset={handleReset}
    />
  );
}
