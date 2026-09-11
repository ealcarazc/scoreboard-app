import type { PlayerInfo } from '@/types';

export interface RecentPair {
  player1: { name: string; color: string };
  player2: { name: string; color: string };
  lastPlayed: number;
}

const KEY = 'recentPairs';
// Keep a deeper bench than we show, so after filtering out the current
// pair / churn there are still 3 fresh ones to offer.
const MAX = 6;
export const RECENT_PAIRS_SHOWN = 3;

export function getRecentPairs(): RecentPair[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecentPair(p1: PlayerInfo, p2: PlayerInfo) {
  if (typeof window === 'undefined') return;

  const pairKey = (a: string, b: string) => [a, b].sort().join('|');
  const newKey = pairKey(p1.name, p2.name);

  const existing = getRecentPairs().filter(
    (p) => pairKey(p.player1.name, p.player2.name) !== newKey
  );

  const updated: RecentPair[] = [
    {
      player1: { name: p1.name, color: p1.color },
      player2: { name: p2.name, color: p2.color },
      lastPlayed: Date.now(),
    },
    ...existing,
  ].slice(0, MAX);

  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function clearRecentPairs() {
  localStorage.removeItem(KEY);
}
