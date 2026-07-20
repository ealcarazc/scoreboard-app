import type { Match } from '@/types';
import { addPointPingPong, initPingPongGame } from './engines/pingpong';
import { addPointSquash, initSquashGame } from './engines/squash';
import { addPointTennis, initTennisGame } from './engines/tennis';

// Determines match point by simulating the next point through the real
// game engine, so it always matches the actual win condition per sport.
export function isMatchPoint(match: Match, player: 'p1' | 'p2'): boolean {
  if (match.result) return false;

  if (match.sport === 'pingpong') {
    const gameState = initPingPongGame(match.format as any, match.currentServer);
    gameState.currentPoints = { ...match.currentPoints };
    gameState.pointTarget = match.format === '11-points' ? 11 : 21;
    const next = addPointPingPong(gameState, player);
    return !!next.isGameOver && next.winner === player;
  }

  if (match.sport === 'squash') {
    const gameState = initSquashGame(match.currentServer);
    gameState.currentPoints = { ...match.currentPoints };
    const next = addPointSquash(gameState, player);
    return !!next.isGameOver && next.winner === player;
  }

  if (match.sport === 'tennis') {
    const gameState = initTennisGame(match.format as any, match.currentServer);
    gameState.currentPoints = { ...match.currentPoints };
    gameState.currentGames = { ...match.currentGames };
    gameState.currentSets = { ...match.currentSets };
    gameState.isInTiebreak = match.isInTiebreak;
    const next = addPointTennis(gameState, player);
    return !!next.isGameOver && next.winner === player;
  }

  return false;
}
