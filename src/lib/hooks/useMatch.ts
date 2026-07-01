'use client';

import { useState, useCallback } from 'react';
import type { Match, PlayerInfo, Sport } from '@/types';
import { addPointPingPong, resetPingPongGame, undoPointPingPong, initPingPongGame } from '@/game/engines/pingpong';
import { nanoid } from 'nanoid';
import { addPointSquash, resetSquashGame, undoPointSquash, initSquashGame } from '@/game/engines/squash';
import { addPointTennis, resetTennisGame, undoPointTennis, initTennisGame } from '@/game/engines/tennis';
import { supabase } from '@/lib/supabase/client';

export function useMatch() {
  const [match, setMatch] = useState<Match | null>(null);

  const createMatch = useCallback(
    (sport: Sport, player1: PlayerInfo, player2: PlayerInfo, format: any) => {
      const newMatch: Match = {
        id: nanoid(),
        sport,
        players: { p1: player1, p2: player2 },
        format,
        currentSet: 1,
        currentPoints: { p1: 0, p2: 0 },
        currentGames: { p1: 0, p2: 0 },
        currentSets: { p1: 0, p2: 0 },
        currentServer: 'p1',
        isInTiebreak: false,
        history: [],
        startTime: new Date(),
      };

      // Save to Supabase (fire and forget)
      const saveMatch = async () => {
        try {
          await supabase.from('matches').insert({
            id: newMatch.id,
            sport: newMatch.sport,
            player1_name: newMatch.players.p1.name,
            player1_color: newMatch.players.p1.color,
            player2_name: newMatch.players.p2.name,
            player2_color: newMatch.players.p2.color,
            format: newMatch.format,
            current_points_p1: newMatch.currentPoints.p1,
            current_points_p2: newMatch.currentPoints.p2,
            current_games_p1: newMatch.currentGames.p1,
            current_games_p2: newMatch.currentGames.p2,
            current_sets_p1: newMatch.currentSets.p1,
            current_sets_p2: newMatch.currentSets.p2,
            current_server: newMatch.currentServer,
            is_in_tiebreak: newMatch.isInTiebreak,
            start_time: newMatch.startTime.toISOString(),
          });
          console.log('Match saved to Supabase:', newMatch.id);
        } catch (err) {
          console.error('Error saving match to Supabase:', err);
        }
      };
      saveMatch();

      setMatch(newMatch);
      return newMatch;
    },
    []
  );

  const addPoint = useCallback(
    (player: 'p1' | 'p2') => {
      if (!match) return;

      let newGameState: any;

      if (match.sport === 'pingpong') {
        const gameState = initPingPongGame(match.format as any, match.currentServer);
        gameState.currentPoints = { ...match.currentPoints };
        gameState.pointTarget = match.format === '11-points' ? 11 : 21;
        newGameState = addPointPingPong(gameState, player);
      } else if (match.sport === 'squash') {
        const gameState = initSquashGame(match.currentServer);
        gameState.currentPoints = { ...match.currentPoints };
        newGameState = addPointSquash(gameState, player);
      } else if (match.sport === 'tennis') {
        const gameState = initTennisGame(match.format as any, match.currentServer);
        gameState.currentPoints = { ...match.currentPoints };
        gameState.currentGames = { ...match.currentGames };
        gameState.currentSets = { ...match.currentSets };
        gameState.isInTiebreak = match.isInTiebreak;
        newGameState = addPointTennis(gameState, player);
      }

      const pointRecord = {
        timestamp: new Date(),
        scorerPlayerId: player,
        gameStateBefore: { ...match, history: [] },
        gameStateAfter: {
          ...match,
          currentPoints: newGameState.currentPoints,
          currentGames: newGameState.currentGames || match.currentGames,
          currentSets: newGameState.currentSets || match.currentSets,
          currentServer: newGameState.currentServer,
          isInTiebreak: newGameState.isInTiebreak || match.isInTiebreak,
          history: [],
        },
      };

      setMatch((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentPoints: newGameState.currentPoints,
          currentGames: newGameState.currentGames || prev.currentGames,
          currentSets: newGameState.currentSets || prev.currentSets,
          currentServer: newGameState.currentServer,
          isInTiebreak: newGameState.isInTiebreak || prev.isInTiebreak,
          result: newGameState.winner ? (newGameState.winner === 'p1' ? 'p1_win' : 'p2_win') : undefined,
          endTime: newGameState.isGameOver ? new Date() : undefined,
          history: [...prev.history, pointRecord],
        };
      });
    },
    [match]
  );

  const undo = useCallback(() => {
    if (!match || match.history.length === 0) return;

    const lastPoint = match.history[match.history.length - 1];
    const previousState = lastPoint.gameStateBefore;

    setMatch((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        currentPoints: previousState.currentPoints,
        currentServer: previousState.currentServer,
        result: undefined,
        endTime: undefined,
        history: prev.history.slice(0, -1),
      };
    });
  }, [match]);

  const resetMatch = useCallback(() => {
    setMatch((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        currentPoints: { p1: 0, p2: 0 },
        currentGames: { p1: 0, p2: 0 },
        currentSets: { p1: 0, p2: 0 },
        currentServer: 'p1',
        isInTiebreak: false,
        history: [],
        result: undefined,
        endTime: undefined,
      };
    });
  }, []);

  const swapPlayers = useCallback(() => {
    setMatch((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: { p1: prev.players.p2, p2: prev.players.p1 },
        currentPoints: { p1: prev.currentPoints.p2, p2: prev.currentPoints.p1 },
        currentGames: { p1: prev.currentGames.p2, p2: prev.currentGames.p1 },
        currentSets: { p1: prev.currentSets.p2, p2: prev.currentSets.p1 },
        currentServer: prev.currentServer === 'p1' ? 'p2' : 'p1',
      };
    });
  }, []);

  return { match, createMatch, addPoint, undo, resetMatch, swapPlayers };
}
