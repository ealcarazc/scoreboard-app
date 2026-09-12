'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { ControlPanel } from '@/components/ui/ControlPanel';
import { ResultScreen } from './ResultScreen';
import { SessionStandingsModal } from './SessionStandingsModal';
import { RemotePairing } from './RemotePairing';
import { useTactile } from '@/lib/hooks/useTactile';
import { useSwipeDetection } from '@/lib/hooks/useSwipeDetection';
import { useRemoteChannel } from '@/lib/hooks/useRemoteChannel';
import { isMatchPoint } from '@/game/matchPoint';
import { getSessionStats, getSessionLeaders } from '@/lib/sessionStats';
import { generateRoomCode, type RemoteAction, type RemoteState } from '@/lib/remoteChannel';
import { isRealtimeConfigured } from '@/lib/supabase/client';
import type { Match } from '@/types';

interface ScoreboardActiveProps {
  match: Match;
  onAddPoint: (player: 'p1' | 'p2') => void;
  onUndo: () => void;
  onResetMatch: () => void;
  onResetSession: () => void;
  onResetAll: () => void;
  onNewMatch?: () => void;
  onBackToMenu: () => void;
  onSwapPlayers?: () => void;
  onRematchWithPair?: (p1: Match['players']['p1'], p2: Match['players']['p2']) => void;
}

function formatScores(match: Match): { p1Score: string | number; p2Score: string | number; subtitle: string } {
  if (match.sport !== 'tennis') {
    return { p1Score: match.currentPoints.p1, p2Score: match.currentPoints.p2, subtitle: '' };
  }

  const subtitle = `Sets ${match.currentSets.p1}-${match.currentSets.p2} · Games ${match.currentGames.p1}-${match.currentGames.p2}`;
  const p1Pts = match.currentPoints.p1;
  const p2Pts = match.currentPoints.p2;

  if (match.isInTiebreak) {
    return { p1Score: p1Pts, p2Score: p2Pts, subtitle };
  }
  if (p1Pts >= 3 && p2Pts >= 3) {
    if (p1Pts === p2Pts) return { p1Score: 'DEUCE', p2Score: 'DEUCE', subtitle };
    if (p1Pts > p2Pts) return { p1Score: 'AD', p2Score: '', subtitle };
    return { p1Score: '', p2Score: 'AD', subtitle };
  }
  const pointMap = ['0', '15', '30', '40'];
  return { p1Score: pointMap[Math.min(p1Pts, 3)], p2Score: pointMap[Math.min(p2Pts, 3)], subtitle };
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
  const [remoteCode, setRemoteCode] = useState<string | null>(null);
  const [showPairing, setShowPairing] = useState(false);
  const { pointFeedback, aceFeedback } = useTactile();

  useEffect(() => {
    setLeaders(getSessionLeaders(getSessionStats()));
  }, [match.id, match.result]);

  const handleTapP1 = useCallback(
    (isAce?: boolean) => {
      if (isAce) aceFeedback();
      else pointFeedback();
      onAddPoint('p1');
    },
    [aceFeedback, pointFeedback, onAddPoint]
  );

  const handleTapP2 = useCallback(
    (isAce?: boolean) => {
      if (isAce) aceFeedback();
      else pointFeedback();
      onAddPoint('p2');
    },
    [aceFeedback, pointFeedback, onAddPoint]
  );

  const handleRemoteAction = useCallback(
    (action: RemoteAction) => {
      if (match.result) return; // ignore remote input once the match is over
      if (action.type === 'undo') {
        onUndo();
      } else if (action.type === 'point' || action.type === 'ace') {
        (action.player === 'p1' ? handleTapP1 : handleTapP2)(action.type === 'ace');
      }
    },
    [match.result, onUndo, handleTapP1, handleTapP2]
  );

  const { p1Score, p2Score, subtitle } = formatScores(match);
  const p1Serving = match.currentServer === 'p1';
  const p2Serving = match.currentServer === 'p2';
  const p1MatchPoint = isMatchPoint(match, 'p1');
  const p2MatchPoint = isMatchPoint(match, 'p2');

  const remoteState: RemoteState = {
    sport: match.sport,
    p1Name: match.players.p1.name,
    p2Name: match.players.p2.name,
    p1Color: match.players.p1.color,
    p2Color: match.players.p2.color,
    p1Score,
    p2Score,
    subtitle,
    p1Serving,
    p2Serving,
    p1MatchPoint,
    p2MatchPoint,
    p1SessionLeader: leaders.includes(match.players.p1.name),
    p2SessionLeader: leaders.includes(match.players.p2.name),
    matchOver: !!match.result,
    winnerName: match.result
      ? match.result === 'p1_win'
        ? match.players.p1.name
        : match.players.p2.name
      : null,
  };

  const { connected: remoteConnected, peerConnected } = useRemoteChannel({
    role: 'board',
    roomCode: remoteCode,
    onAction: handleRemoteAction,
    state: remoteCode ? remoteState : null,
  });

  // Swipe detection - disabled when game is over
  useSwipeDetection(
    {
      onSwipeLeft: match.result ? undefined : onUndo,
      onSwipeRight: match.result ? undefined : onUndo,
    },
    !match.result
  );

  const openRemote = () => {
    if (!remoteCode) setRemoteCode(generateRoomCode());
    setShowPairing(true);
  };

  const pairingOverlay =
    remoteCode && showPairing ? (
      <RemotePairing
        isOpen
        onClose={() => setShowPairing(false)}
        roomCode={remoteCode}
        connected={remoteConnected}
        peerConnected={peerConnected}
      />
    ) : null;

  // Show result screen if game is over
  if (match.result && onNewMatch) {
    return (
      <>
        <ResultScreen
          match={match}
          onNewMatch={onNewMatch}
          onBackToMenu={onBackToMenu}
          onRematchWithPair={onRematchWithPair}
          onUndoLastPoint={onUndo}
        />
        {pairingOverlay}
      </>
    );
  }

  const tennisSubtitle = match.sport === 'tennis' ? subtitle : '';

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
          subtitle1={tennisSubtitle}
          subtitle2={tennisSubtitle}
          p1MatchPoint={p1MatchPoint}
          p2MatchPoint={p2MatchPoint}
          p1SessionLeader={leaders.includes(match.players.p1.name)}
          p2SessionLeader={leaders.includes(match.players.p2.name)}
          onTapP1={handleTapP1}
          onTapP2={handleTapP2}
        />
      </div>
      <ControlPanel
        onExitToMenu={onBackToMenu}
        onResetMatch={onResetMatch}
        onResetSession={onResetSession}
        onResetAll={onResetAll}
        onUndo={onUndo}
        canUndo={match.history.length > 0}
        onSwap={onSwapPlayers}
        onOpenStandings={() => setShowStandings(true)}
        onOpenRemote={isRealtimeConfigured() ? openRemote : undefined}
        remoteActive={peerConnected}
      />
      <SessionStandingsModal isOpen={showStandings} onClose={() => setShowStandings(false)} />
      {pairingOverlay}
    </div>
  );
}
