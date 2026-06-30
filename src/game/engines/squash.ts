import type { GameState } from '@/types';

export function initSquashGame(server: 'p1' | 'p2' = 'p1'): GameState {
  return {
    currentPoints: { p1: 0, p2: 0 },
    currentServer: server,
    isGameOver: false,
  };
}

export function addPointSquash(state: GameState, player: 'p1' | 'p2'): GameState {
  if (state.isGameOver) return state;

  const newState = { ...state };
  newState.currentPoints = { ...state.currentPoints };
  newState.currentPoints[player]++;

  const p1 = newState.currentPoints.p1;
  const p2 = newState.currentPoints.p2;

  // Squash PAR rule: victory at 11 points, win by 1 (not 2 like pingpong)
  // But if both reach 10, need +2 to win
  if (p1 >= 11 || p2 >= 11) {
    if (Math.abs(p1 - p2) >= 1) {
      // Check if above 10 for both
      if ((p1 >= 10 && p2 >= 10 && Math.abs(p1 - p2) >= 2) || (p1 < 10 || p2 < 10)) {
        newState.isGameOver = true;
        newState.winner = p1 > p2 ? 'p1' : 'p2';
        newState.gameOverReason = '11-point squash game';
      }
    }
  }

  // Squash: serve doesn't rotate per point like pingpong
  // Server is fixed until next game (but for single game, doesn't matter)
  // Could implement rotation if playing multiple games

  return newState;
}

export function undoPointSquash(state: GameState): GameState {
  if (state.currentPoints.p1 === 0 && state.currentPoints.p2 === 0) {
    return state;
  }

  const newState = { ...state };
  newState.currentPoints = { ...state.currentPoints };
  newState.isGameOver = false;
  newState.winner = undefined;
  newState.gameOverReason = undefined;

  const totalPoints = state.currentPoints.p1 + state.currentPoints.p2;
  const lastScorer = totalPoints % 2 === 1 ? state.currentServer : state.currentServer === 'p1' ? 'p2' : 'p1';

  if (lastScorer === 'p1' && newState.currentPoints.p1 > 0) {
    newState.currentPoints.p1--;
  } else if (lastScorer === 'p2' && newState.currentPoints.p2 > 0) {
    newState.currentPoints.p2--;
  }

  return newState;
}

export function resetSquashGame(state: GameState): GameState {
  return {
    ...state,
    currentPoints: { p1: 0, p2: 0 },
    currentServer: 'p1',
    isGameOver: false,
    winner: undefined,
    gameOverReason: undefined,
  };
}
