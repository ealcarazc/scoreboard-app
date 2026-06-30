'use client';

import React from 'react';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { ControlPanel } from '@/components/ui/ControlPanel';
import { useTactile } from '@/lib/hooks/useTactile';
import { useSwipeDetection } from '@/lib/hooks/useSwipeDetection';
import type { Match } from '@/types';

interface ScoreboardActiveProps {
  match: Match;
  onAddPoint: (player: 'p1' | 'p2') => void;
  onUndo: () => void;
  onReset: () => void;
}

export function ScoreboardActive({ match, onAddPoint, onUndo, onReset }: ScoreboardActiveProps) {
  const { pointFeedback } = useTactile();

  const handleTapP1 = () => {
    pointFeedback();
    onAddPoint('p1');
  };

  const handleTapP2 = () => {
    pointFeedback();
    onAddPoint('p2');
  };

  // Swipe detection
  useSwipeDetection(
    {
      onSwipeLeft: onUndo,
      onSwipeRight: onUndo,
    },
    !match.result
  );

  const p1Serving = match.currentServer === 'p1';
  const p2Serving = match.currentServer === 'p2';

  return (
    <>
      <ScoreDisplay
        p1Name={match.players.p1.name}
        p2Name={match.players.p2.name}
        p1Score={match.currentPoints.p1}
        p2Score={match.currentPoints.p2}
        p1Color={match.players.p1.color}
        p2Color={match.players.p2.color}
        p1Serving={p1Serving}
        p2Serving={p2Serving}
        onTapP1={handleTapP1}
        onTapP2={handleTapP2}
      />
      <ControlPanel
        onReset={onReset}
        onUndo={onUndo}
        canUndo={match.history.length > 0}
        gameOver={!!match.result}
      />
    </>
  );
}
