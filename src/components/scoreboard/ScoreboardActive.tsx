'use client';

import React, { useEffect, useState } from 'react';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { ControlPanel } from '@/components/ui/ControlPanel';
import { ResultScreen } from './ResultScreen';
import { SessionStandingsModal } from './SessionStandingsModal';
import { useTactile } from '@/lib/hooks/useTactile';
import { useSwipeDetection } from '@/lib/hooks/useSwipeDetection';
import { isMatchPoint } from '@/game/matchPoint';
import { getSessionStats, getSessionLeaders } from '@/lib/sessionStats';
import type { Match } from '@/types';

interface ScoreboardActiveProps {
  match: Match;
  onAddPoint: (player: 'p1' | 'p2') => void;
  onUndo: () => void;
  onResetMatch: () => void;
  onResetSession: () => void;
  onResetAll: () => void;
  onNewMatch?: () => void;
  onBackToMenu?: () => void;
  onSwapPlayers?: () => void;
  onRematchWithPair?: (p1: Match['players']['p1'], p2: Match['players']['p2']) => void;
}

export function ScoreboardActive({
  match,
  onAddPoint,
  onUndo,
  onResetMatch,
  onResetSession,
  onResetAll,
  onNewMatch,
  onBackToMenu,
  onSwapPlayers,
  onRematchWithPair,
}: ScoreboardActiveProps) {
  const [leaders, setLeaders] = useState<string[]>([]);
  const [showStandings, setShowStandings] = useState(false);
  const { pointFeedback, aceFeedback } = useTactile();

  useEffect(() => {
    setLeaders(getSessionLeaders(getSessionStats()));
  }, [match.id, match.result]);

  const handleTapP1 = (isAce?: boolean) => {
    if (isAce) {
      aceFeedback();
    } else {
      pointFeedback();
    }
    onAddPoint('p1');
  };

  const handleTapP2 = (isAce?: boolean) => {
    if (isAce) {
      aceFeedback();
    } else {
      pointFeedback();
    }
    onAddPoint('p2');
  };

  // Swipe detection - disabled when game is over
  useSwipeDetection(
    {
      onSwipeLeft: match.result ? undefined : onUndo,
      onSwipeRight: match.result ? undefined : onUndo,
    },
    !match.result
  );

  // Show result screen if game is over
  if (match.result && onNewMatch && onBackToMenu) {
    return (
      <ResultScreen
        match={match}
        onNewMatch={onNewMatch}
        onBackToMenu={onBackToMenu}
        onRematchWithPair={onRematchWithPair}
        onUndoLastPoint={onUndo}
      />
    );
  }

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

  const p1MatchPoint = isMatchPoint(match, 'p1');
  const p2MatchPoint = isMatchPoint(match, 'p2');

  return (
    <div className="flex h-[100dvh] w-screen flex-col overflow-hidden bg-black">
      <div className="min-h-0 flex-1">
        <ScoreDisplay
          sport={match.sport}
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
          p1MatchPoint={p1MatchPoint}
          p2MatchPoint={p2MatchPoint}
          p1SessionLeader={leaders.includes(match.players.p1.name)}
          p2SessionLeader={leaders.includes(match.players.p2.name)}
          onTapP1={handleTapP1}
          onTapP2={handleTapP2}
        />
      </div>
      <ControlPanel
        onResetMatch={onResetMatch}
        onResetSession={onResetSession}
        onResetAll={onResetAll}
        onUndo={onUndo}
        canUndo={match.history.length > 0}
        onSwap={onSwapPlayers}
        onOpenStandings={() => setShowStandings(true)}
      />
      <SessionStandingsModal isOpen={showStandings} onClose={() => setShowStandings(false)} />
    </div>
  );
}
