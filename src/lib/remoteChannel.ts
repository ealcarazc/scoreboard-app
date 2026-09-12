// Shared types + helpers for the phone-as-remote feature.
// Every device that opens /r/{code} is a peer: it shows the exact same
// big scoreboard (via ScoreDisplay) and can tap to score. Whichever
// device actually created the match keeps running the game engine and
// broadcasts the resulting state; every peer (including that device)
// renders from a single Supabase Realtime broadcast channel keyed by a
// short room code.

import type { Sport } from '@/types';

export type RemoteAction =
  | { type: 'point'; player: 'p1' | 'p2' }
  | { type: 'ace'; player: 'p1' | 'p2' }
  | { type: 'undo' };

export interface RemoteState {
  sport: Sport;
  p1Name: string;
  p2Name: string;
  p1Color: string;
  p2Color: string;
  p1Score: number | string;
  p2Score: number | string;
  subtitle: string;
  p1Serving: boolean;
  p2Serving: boolean;
  p1MatchPoint: boolean;
  p2MatchPoint: boolean;
  p1SessionLeader: boolean;
  p2SessionLeader: boolean;
  matchOver: boolean;
  winnerName: string | null;
}

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no I, L, O, 0, 1

export function generateRoomCode(length = 5): string {
  let code = '';
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < length; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}

export function channelName(roomCode: string): string {
  return `sb-remote-${roomCode.toUpperCase()}`;
}

export function remoteUrl(roomCode: string): string {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://scoreboard-app-five.vercel.app';
  return `${origin}/r/${roomCode.toUpperCase()}`;
}
