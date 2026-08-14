export interface MatchHistoryEntry {
  date: string; // ISO date (yyyy-mm-dd)
  sport: string;
  player1: string;
  player2: string;
  winner: string;
  score: string;
}

const KEY = 'matchHistory';
const MAX = 50;

export function getMatchHistory(): MatchHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addMatchHistoryEntry(entry: MatchHistoryEntry) {
  if (typeof window === 'undefined') return;
  const updated = [entry, ...getMatchHistory()].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function setMatchHistory(entries: MatchHistoryEntry[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX)));
}

export function removeLastMatchHistoryEntry() {
  const entries = getMatchHistory();
  entries.shift();
  setMatchHistory(entries);
}

export function clearMatchHistory() {
  localStorage.removeItem(KEY);
}
