export type Sport = 'tennis' | 'pingpong' | 'squash';
export type Format = 'best-of-3' | 'best-of-5' | '11-points' | '21-points';

export interface PlayerInfo {
  id: string;
  name: string;
  color: string; // hex #RRGGBB
  isFrequent: boolean;
}

export interface Point {
  timestamp: Date;
  scorerPlayerId: 'p1' | 'p2';
  gameStateBefore: Omit<Match, 'history'>;
  gameStateAfter: Omit<Match, 'history'>;
}

export interface Match {
  id: string;
  sport: Sport;
  players: { p1: PlayerInfo; p2: PlayerInfo };
  format: Format;

  // Current state
  currentSet: number;
  currentPoints: { p1: number; p2: number };
  currentGames: { p1: number; p2: number }; // Tennis only
  currentSets: { p1: number; p2: number }; // Tennis only
  currentServer: 'p1' | 'p2';
  isInTiebreak: boolean; // Tennis only

  // History for undo
  history: Point[];

  // Metadata
  startTime: Date;
  endTime?: Date;
  result?: 'p1_win' | 'p2_win' | 'abandoned';
}

export type PingPongFormat = '11-points' | '21-points';
export type TennisFormat = 'best-of-3' | 'best-of-5';

export interface GameState {
  currentPoints: { p1: number; p2: number };
  currentGames?: { p1: number; p2: number };
  currentSets?: { p1: number; p2: number };
  currentServer: 'p1' | 'p2';
  isInTiebreak?: boolean;
  isGameOver: boolean;
  winner?: 'p1' | 'p2';
  gameOverReason?: string;
}
