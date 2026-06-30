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

  // Format score display based on sport
  let p1Score: string | number = match.currentPoints.p1;
  let p2Score: string | number = match.currentPoints.p2;
  let subtitle1 = '';
  let subtitle2 = '';

  if (match.sport === 'tennis') {
    // Tennis: show sets and games below score
    subtitle1 = `Sets ${match.currentSets.p1}-${match.currentSets.p2} | Games ${match.currentGames.p1}-${match.currentGames.p2}`;
    subtitle2 = `Sets ${match.currentSets.p1}-${match.currentSets.p2} | Games ${match.currentGames.p1}-${match.currentGames.p2}`;

    // Convert points to tennis display (0-15-30-40-DEUCE-AD)
    const p1Pts = match.currentPoints.p1;
    const p2Pts = match.currentPoints.p2;

    if (match.isInTiebreak) {
      p1Score = p1Pts;
      p2Score = p2Pts;
    } else {
      if (p1Pts >= 3 && p2Pts >= 3) {
        if (p1Pts === p2Pts) {
          p1Score = 'DEUCE';
          p2Score = 'DEUCE';
        } else if (p1Pts > p2Pts) {
          p1Score = 'AD';
          p2Score = '';
        } else {
          p1Score = '';
          p2Score = 'AD';
        }
      } else {
        const pointMap = ['0', '15', '30', '40'];
        p1Score = pointMap[Math.min(p1Pts, 3)];
        p2Score = pointMap[Math.min(p2Pts, 3)];
      }
    }
  }

  return (
    <>
      <ScoreDisplay
        p1Name={match.players.p1.name}
        p2Name={match.players.p2.name}
        p1Score={p1Score}
        p2Score={p2Score}
        p1Color={match.players.p1.color}
        p2Color={match.players.p2.color}
        p1Serving={p1Serving}
        p2Serving={p2Serving}
        subtitle1={subtitle1}
        subtitle2={subtitle2}
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
