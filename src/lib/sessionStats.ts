export interface PlayerSessionStat {
  wins: number;
  matches: number;
}

export type SessionStats = Record<string, PlayerSessionStat>;

const KEY = 'sessionStats';

export function getSessionStats(): SessionStats {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordMatchResult(winnerName: string, loserName: string): SessionStats {
  const stats = getSessionStats();

  if (!stats[winnerName]) stats[winnerName] = { wins: 0, matches: 0 };
  if (!stats[loserName]) stats[loserName] = { wins: 0, matches: 0 };

  stats[winnerName].wins += 1;
  stats[winnerName].matches += 1;
  stats[loserName].matches += 1;

  localStorage.setItem(KEY, JSON.stringify(stats));
  return stats;
}

export function resetSessionStats() {
  localStorage.removeItem(KEY);
}

// Reverses a previously recorded result (used when undoing a match
// declared over by mistake, e.g. a bad Match Point tap).
export function revertMatchResult(winnerName: string, loserName: string): SessionStats {
  const stats = getSessionStats();

  if (stats[winnerName]) {
    stats[winnerName].wins = Math.max(0, stats[winnerName].wins - 1);
    stats[winnerName].matches = Math.max(0, stats[winnerName].matches - 1);
  }
  if (stats[loserName]) {
    stats[loserName].matches = Math.max(0, stats[loserName].matches - 1);
  }

  localStorage.setItem(KEY, JSON.stringify(stats));
  return stats;
}

// Names with the highest win count in the session (empty if nobody has won yet)
export function getSessionLeaders(stats: SessionStats): string[] {
  const entries = Object.entries(stats).filter(([, s]) => s.wins > 0);
  if (entries.length === 0) return [];

  const maxWins = Math.max(...entries.map(([, s]) => s.wins));
  return entries.filter(([, s]) => s.wins === maxWins).map(([name]) => name);
}
