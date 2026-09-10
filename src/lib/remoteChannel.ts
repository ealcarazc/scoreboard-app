// Shared types + helpers for the phone-as-remote feature.
// The iPad runs the real scoreboard (the "board"); the phone runs a dumb
// "remote" that only sends actions. They talk over a Supabase Realtime
// broadcast channel keyed by a short room code.

export type RemoteAction =
  | { type: 'point'; player: 'p1' | 'p2' }
  | { type: 'ace'; player: 'p1' | 'p2' }
  | { type: 'undo' };

export interface RemoteState {
  p1Name: string;
  p2Name: string;
  p1Color: string;
  p2Color: string;
  p1Score: number | string;
  p2Score: number | string;
  subtitle: string;
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
