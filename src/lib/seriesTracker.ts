export interface SeriesState {
  key: string;
  p1Name: string;
  p2Name: string;
  sport: string;
  p1Wins: number;
  p2Wins: number;
}

export interface SeriesResult {
  state: SeriesState;
  clinched: boolean;
  seriesFormat: string | null;
  seriesWinnerName: string | null;
}

const KEY = 'activeSeries';

// Series wins needed vs. max opponent wins allowed to still count as that
// format, checked smallest-first so a clean sweep clinches at the first
// format it naturally satisfies.
const THRESHOLDS: { wins: number; maxLosses: number; label: string }[] = [
  { wins: 2, maxLosses: 1, label: 'Mejor de 3' },
  { wins: 3, maxLosses: 2, label: 'Mejor de 5' },
  { wins: 4, maxLosses: 3, label: 'Mejor de 7' },
];

function makeKey(p1Name: string, p2Name: string, sport: string): string {
  return [p1Name, p2Name].sort().join('|') + '::' + sport;
}

export function getSeriesState(): SeriesState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function recordSeriesResult(
  p1Name: string,
  p2Name: string,
  sport: string,
  winnerName: string
): SeriesResult {
  const newKey = makeKey(p1Name, p2Name, sport);
  const existing = getSeriesState();

  const state: SeriesState =
    existing && existing.key === newKey
      ? { ...existing }
      : { key: newKey, p1Name, p2Name, sport, p1Wins: 0, p2Wins: 0 };

  const winnerIsP1 = winnerName === state.p1Name;
  if (winnerIsP1) {
    state.p1Wins += 1;
  } else {
    state.p2Wins += 1;
  }

  const winnerWins = winnerIsP1 ? state.p1Wins : state.p2Wins;
  const loserWins = winnerIsP1 ? state.p2Wins : state.p1Wins;

  let clinched = false;
  let seriesFormat: string | null = null;

  for (const t of THRESHOLDS) {
    if (winnerWins === t.wins && loserWins <= t.maxLosses) {
      clinched = true;
      seriesFormat = t.label;
      break;
    }
  }

  if (clinched) {
    localStorage.removeItem(KEY);
  } else {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  return { state, clinched, seriesFormat, seriesWinnerName: clinched ? winnerName : null };
}

// Reverses the last recorded series win (used when undoing a match
// declared over by mistake). `postIncrementState` is the SeriesResult.state
// returned by the recordSeriesResult call being undone.
export function revertSeriesResult(postIncrementState: SeriesState, winnerName: string) {
  const reverted: SeriesState = { ...postIncrementState };

  if (winnerName === reverted.p1Name) {
    reverted.p1Wins = Math.max(0, reverted.p1Wins - 1);
  } else {
    reverted.p2Wins = Math.max(0, reverted.p2Wins - 1);
  }

  if (reverted.p1Wins === 0 && reverted.p2Wins === 0) {
    localStorage.removeItem(KEY);
  } else {
    localStorage.setItem(KEY, JSON.stringify(reverted));
  }
}

export function clearSeriesState() {
  localStorage.removeItem(KEY);
}
