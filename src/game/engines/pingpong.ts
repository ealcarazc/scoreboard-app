import type { GameState, PingPongFormat } from '@/types';

interface PingPongState extends GameState {
  pointTarget: number; // 11 or 21
}

export function initPingPongGame(
  format: PingPongFormat = '11-points',
  server: 'p1' | 'p2' = 'p1'
): PingPongState {
  const pointTarget = format === '11-points' ? 11 : 21;
  return {
    currentPoints: { p1: 0, p2: 0 },
    currentServer: server,
    isGameOver: false,
    pointTarget,
  };
}

export function addPointPingPong(
  state: PingPongState,
  player: 'p1' | 'p2'
): PingPongState {
  if (state.isGameOver) return state;

  const newState = { ...state };
  newState.currentPoints = { ...state.currentPoints };
  newState.currentPoints[player]++;

  // Check win condition: first to pointTarget with +2 lead
  const p1 = newState.currentPoints.p1;
  const p2 = newState.currentPoints.p2;

  // If both at/above pointTarget - 1, need +2 lead
  if (p1 >= state.pointTarget || p2 >= state.pointTarget) {
    if (Math.abs(p1 - p2) >= 2) {
      newState.isGameOver = true;
      newState.winner = p1 > p2 ? 'p1' : 'p2';
      newState.gameOverReason = `${newState.pointTarget}-point game`;
    }
  }

  // Update server every 2 points (or every 1 if both are 10+ in the pointTarget-1 range)
  const atDeuce = p1 === state.pointTarget - 1 && p2 === state.pointTarget - 1;
  const totalPoints = p1 + p2;

  if (atDeuce || (p1 >= state.pointTarget - 1 && p2 >= state.pointTarget - 1)) {
    // At deuce/high equal: change server every point
    newState.currentServer = state.currentServer === 'p1' ? 'p2' : 'p1';
  } else if (totalPoints % 2 === 0) {
    // Normal play: change server every 2 points
    newState.currentServer = state.currentServer === 'p1' ? 'p2' : 'p1';
  }

  return newState;
}

export function undoPointPingPong(state: PingPongState): PingPongState {
  if (state.currentPoints.p1 === 0 && state.currentPoints.p2 === 0) {
    return state;
  }

  const newState = { ...state };
  newState.currentPoints = { ...state.currentPoints };
  newState.isGameOver = false;
  newState.winner = undefined;
  newState.gameOverReason = undefined;

  // Figure out who had the last point (harder to do without full history)
  // For simplicity, alternate based on current server and point total
  const totalPoints = state.currentPoints.p1 + state.currentPoints.p2;
  const lastScorer = totalPoints % 2 === 1 ? state.currentServer : (state.currentServer === 'p1' ? 'p2' : 'p1');

  if (lastScorer === 'p1' && newState.currentPoints.p1 > 0) {
    newState.currentPoints.p1--;
  } else if (lastScorer === 'p2' && newState.currentPoints.p2 > 0) {
    newState.currentPoints.p2--;
  }

  // Recalculate server
  const newTotalPoints = newState.currentPoints.p1 + newState.currentPoints.p2;
  const p1 = newState.currentPoints.p1;
  const p2 = newState.currentPoints.p2;
  const atDeuce = p1 === state.pointTarget - 1 && p2 === state.pointTarget - 1;

  if (atDeuce || (p1 >= state.pointTarget - 1 && p2 >= state.pointTarget - 1)) {
    newState.currentServer = state.currentServer === 'p1' ? 'p2' : 'p1';
  } else if (newTotalPoints % 2 === 0) {
    newState.currentServer = state.currentServer === 'p1' ? 'p2' : 'p1';
  }

  return newState;
}

export function resetPingPongGame(state: PingPongState): PingPongState {
  return {
    ...state,
    currentPoints: { p1: 0, p2: 0 },
    currentServer: 'p1',
    isGameOver: false,
    winner: undefined,
    gameOverReason: undefined,
  };
}
