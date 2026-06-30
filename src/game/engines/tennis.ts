import type { GameState, TennisFormat } from '@/types';

interface TennisGameState extends GameState {
  currentGames: { p1: number; p2: number };
  currentSets: { p1: number; p2: number };
  isInTiebreak: boolean;
  format: TennisFormat;
}

type TennisPoints = 0 | 15 | 30 | 40 | 'deuce' | 'ad-p1' | 'ad-p2';

function pointToString(p: number): string {
  if (p === 0) return '0';
  if (p === 1) return '15';
  if (p === 2) return '30';
  if (p === 3) return '40';
  return '';
}

export function initTennisGame(format: TennisFormat = 'best-of-3', server: 'p1' | 'p2' = 'p1'): TennisGameState {
  return {
    currentPoints: { p1: 0, p2: 0 },
    currentGames: { p1: 0, p2: 0 },
    currentSets: { p1: 0, p2: 0 },
    currentServer: server,
    isInTiebreak: false,
    isGameOver: false,
    format,
  };
}

export function addPointTennis(state: TennisGameState, player: 'p1' | 'p2'): TennisGameState {
  if (state.isGameOver) return state;

  const newState: TennisGameState = {
    ...state,
    currentPoints: { ...state.currentPoints },
    currentGames: { ...state.currentGames },
    currentSets: { ...state.currentSets },
  };

  newState.currentPoints[player]++;

  const p1Points = newState.currentPoints.p1;
  const p2Points = newState.currentPoints.p2;

  let gameOver = false;

  // Tie-break logic (first to 7 with +2)
  if (newState.isInTiebreak) {
    if (p1Points >= 7 || p2Points >= 7) {
      if (Math.abs(p1Points - p2Points) >= 2) {
        gameOver = true;
        // Winner of tiebreak wins the set
        if (p1Points > p2Points) {
          newState.currentGames.p1 = 7;
        } else {
          newState.currentGames.p2 = 7;
        }
      }
    }
  } else {
    // Regular game: 0-15-30-40-game
    if (p1Points >= 4 || p2Points >= 4) {
      // Deuce or advantage
      if (p1Points === p2Points) {
        // Deuce
      } else if (Math.abs(p1Points - p2Points) >= 2) {
        gameOver = true;
      }
    } else if (p1Points === 4 || p2Points === 4) {
      gameOver = true;
    }
  }

  if (gameOver) {
    // Winner of game gets +1 to games
    const gameWinner = newState.isInTiebreak
      ? p1Points > p2Points ? 'p1' : 'p2'
      : newState.currentPoints.p1 > newState.currentPoints.p2 ? 'p1' : 'p2';

    if (gameWinner === 'p1') {
      newState.currentGames.p1++;
    } else {
      newState.currentGames.p2++;
    }

    // Check if set is won (6+ games with +2 lead, or 7 in tiebreak)
    const p1Games = newState.currentGames.p1;
    const p2Games = newState.currentGames.p2;

    let setOver = false;
    if (p1Games >= 6 || p2Games >= 6) {
      if (Math.abs(p1Games - p2Games) >= 2) {
        setOver = true;
      }
    }

    // Check for tie-break at 6-6
    if (p1Games === 6 && p2Games === 6) {
      newState.isInTiebreak = true;
    }

    if (setOver) {
      // Winner of set gets +1 to sets
      const setWinner = p1Games > p2Games ? 'p1' : 'p2';
      if (setWinner === 'p1') {
        newState.currentSets.p1++;
      } else {
        newState.currentSets.p2++;
      }

      // Check if match is won
      const setsToWin = state.format === 'best-of-3' ? 2 : 3;
      if (newState.currentSets.p1 >= setsToWin || newState.currentSets.p2 >= setsToWin) {
        newState.isGameOver = true;
        newState.winner = newState.currentSets.p1 > newState.currentSets.p2 ? 'p1' : 'p2';
        newState.gameOverReason = `${state.format} match`;
      } else {
        // Reset for next set
        newState.currentGames = { p1: 0, p2: 0 };
        newState.currentPoints = { p1: 0, p2: 0 };
        newState.isInTiebreak = false;
        // Alternate server
        newState.currentServer = state.currentServer === 'p1' ? 'p2' : 'p1';
      }
    } else {
      // Reset for next game
      newState.currentPoints = { p1: 0, p2: 0 };
      // Alternate server
      newState.currentServer = state.currentServer === 'p1' ? 'p2' : 'p1';
    }
  }

  return newState;
}

export function undoPointTennis(state: TennisGameState): TennisGameState {
  if (state.currentPoints.p1 === 0 && state.currentPoints.p2 === 0) {
    // Can't undo if no points in current game
    return state;
  }

  const newState: TennisGameState = {
    ...state,
    currentPoints: { ...state.currentPoints },
    currentGames: { ...state.currentGames },
    currentSets: { ...state.currentSets },
  };

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

export function resetTennisGame(state: TennisGameState): TennisGameState {
  return {
    ...state,
    currentPoints: { p1: 0, p2: 0 },
    currentGames: { p1: 0, p2: 0 },
    currentSets: { p1: 0, p2: 0 },
    currentServer: 'p1',
    isInTiebreak: false,
    isGameOver: false,
    winner: undefined,
    gameOverReason: undefined,
  };
}
